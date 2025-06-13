using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TuyetDang.MyVetTracer.Data;
using TuyetDang.MyVetTracer.Entity;
using veterinarian_tracker_system.Hubs;

namespace veterinarian_tracker_system.Controllers
{
    [Authorize(Policy = "RequireVeterinarianRole")]
    public class VeterinarianDashboardController : Controller
    {
        private readonly MyVetTracerDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly ILogger<VeterinarianDashboardController> _logger;

        public VeterinarianDashboardController(MyVetTracerDbContext context, IHubContext<NotificationHub> hubContext, ILogger<VeterinarianDashboardController> logger)
        {
            _context = context;
            _hubContext = hubContext;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            var vetId = GetCurrentVeterinarianId();
            if (vetId == 0)
            {
                return RedirectToAction("Login", "Auth");
            }

            var veterinarian = await _context.Veterinarians
                .Include(v => v.Appointments)
                    .ThenInclude(a => a.Pet)
                        .ThenInclude(p => p.OwnerUser)
                .FirstOrDefaultAsync(v => v.IdVetUser == vetId);

            if (veterinarian == null)
            {
                return NotFound();
            }

            // Get today's appointments
            var today = DateTime.Today.ToString("yyyy-MM-dd");
            ViewBag.TodayAppointments = veterinarian.Appointments
                .Where(a => a.Time.StartsWith(today))
                .OrderBy(a => a.Time)
                .ToList();

            return View(veterinarian);
        }

        public async Task<IActionResult> Schedule(string? date = null)
        {
            var vetId = GetCurrentVeterinarianId();
            if (vetId == 0)
            {
                return RedirectToAction("Login", "Auth");
            }

            DateTime selectedDate = string.IsNullOrEmpty(date) ? DateTime.Today : DateTime.Parse(date);
            ViewBag.SelectedDate = selectedDate.ToString("yyyy-MM-dd");

            var appointments = await _context.Appointments
                .Include(a => a.Pet)
                    .ThenInclude(p => p.OwnerUser)
                .Where(a => a.IdVeterinarian == vetId)
                .ToListAsync();

            return View(appointments);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateStatus(bool isAvailable)
        {
            var vetId = GetCurrentVeterinarianId();
            if (vetId == 0)
            {
                return Json(new { success = false, message = "Not authenticated" });
            }

            // In a real application, you would update a status field in the database
            // For now, we'll just broadcast the status change via SignalR
            await _hubContext.Clients.All.SendAsync("VeterinarianStatusChanged", vetId, isAvailable);

            return Json(new { success = true });
        }

        public async Task<IActionResult> PetMedicalRecords(int id)
        {
            var vetId = GetCurrentVeterinarianId();
            if (vetId == 0)
            {
                return RedirectToAction("Login", "Auth");
            }

            var pet = await _context.Pets
                .Include(p => p.OwnerUser)
                .Include(p => p.Vacs)
                .Include(p => p.Meds)
                .Include(p => p.Appointments)
                .FirstOrDefaultAsync(p => p.IdPet == id && (p.IdVetUser == vetId || p.Appointments.Any(a => a.IdVeterinarian == vetId)));

            if (pet == null)
            {
                return NotFound();
            }

            return View(pet);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateAppointment(int id, int status)
        {
            var vetId = GetCurrentVeterinarianId();
            if (vetId == 0)
            {
                return RedirectToAction("Login", "Auth");
            }

            var appointment = await _context.Appointments
                .Include(a => a.Pet)
                    .ThenInclude(p => p.OwnerUser)
                .FirstOrDefaultAsync(a => a.IdAppointment == id && a.IdVeterinarian == vetId);

            if (appointment == null)
            {
                return NotFound();
            }

            appointment.IsConfirmed = status;
            _context.Update(appointment);
            await _context.SaveChangesAsync();

            // Send notification to owner
            if (appointment.Pet?.OwnerUser != null)
            {
                var statusText = status == 1 ? "confirmed" : status == 2 ? "completed" : "declined";
                var notificationMessage = $"Your appointment for {appointment.Pet.PetName} on {appointment.Time} has been {statusText}";
                await _hubContext.Clients.Group($"Owner_{appointment.Pet.OwnerUser.IdOwnerUser}")
                    .SendAsync("ReceiveNotification", notificationMessage, "appointment");
            }

            return RedirectToAction(nameof(Schedule));
        }

        [HttpGet]
        public async Task<IActionResult> AssignMedicine(int petId)
        {
            var vetId = GetCurrentVeterinarianId();
            if (vetId == 0)
            {
                return RedirectToAction("Login", "Auth");
            }

            var pet = await _context.Pets
                .Include(p => p.OwnerUser)
                .FirstOrDefaultAsync(p => p.IdPet == petId && (p.IdVetUser == vetId || p.Appointments.Any(a => a.IdVeterinarian == vetId)));

            if (pet == null)
            {
                return NotFound();
            }

            ViewBag.Pet = pet;
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AssignMedicine(Medicine medicine)
        {
            var vetId = GetCurrentVeterinarianId();
            if (vetId == 0)
            {
                return RedirectToAction("Login", "Auth");
            }

            if (ModelState.IsValid)
            {
                medicine.IdVeterinarian = vetId;
                medicine.CreatedAt = DateTime.Now;

                _context.Medicines.Add(medicine);
                await _context.SaveChangesAsync();

                // Send notification to owner
                var pet = await _context.Pets
                    .Include(p => p.OwnerUser)
                    .FirstOrDefaultAsync(p => p.IdPet == medicine.IdPet);

                if (pet?.OwnerUser != null)
                {
                    var notificationMessage = $"New medicine prescribed for {pet.PetName}: {medicine.MedName}";
                    await _hubContext.Clients.Group($"Owner_{pet.OwnerUser.IdOwnerUser}")
                        .SendAsync("ReceiveNotification", notificationMessage, "prescription");
                }

                return RedirectToAction("PetMedicalRecords", new { id = medicine.IdPet });
            }

            var petModel = await _context.Pets
                .Include(p => p.OwnerUser)
                .FirstOrDefaultAsync(p => p.IdPet == medicine.IdPet);

            if (petModel == null)
            {
                return NotFound();
            }

            ViewBag.Pet = petModel;
            return View(medicine);
        }

        [HttpGet]
        public async Task<IActionResult> AssignVaccine(int petId)
        {
            var vetId = GetCurrentVeterinarianId();
            if (vetId == 0)
            {
                return RedirectToAction("Login", "Auth");
            }

            var pet = await _context.Pets
                .Include(p => p.OwnerUser)
                .FirstOrDefaultAsync(p => p.IdPet == petId && (p.IdVetUser == vetId || p.Appointments.Any(a => a.IdVeterinarian == vetId)));

            if (pet == null)
            {
                return NotFound();
            }

            ViewBag.Pet = pet;
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AssignVaccine(Vaccine vaccine)
        {
            var vetId = GetCurrentVeterinarianId();
            if (vetId == 0)
            {
                return RedirectToAction("Login", "Auth");
            }

            if (ModelState.IsValid)
            {
                vaccine.IdVeterinarian = vetId;
                vaccine.CreatedAt = DateTime.Now;

                _context.Vaccines.Add(vaccine);
                await _context.SaveChangesAsync();

                // Send notification to owner
                var pet = await _context.Pets
                    .Include(p => p.OwnerUser)
                    .FirstOrDefaultAsync(p => p.IdPet == vaccine.IdPet);

                if (pet?.OwnerUser != null)
                {
                    var notificationMessage = $"New vaccine administered to {pet.PetName}: {vaccine.VacName}";
                    await _hubContext.Clients.Group($"Owner_{pet.OwnerUser.IdOwnerUser}")
                        .SendAsync("ReceiveNotification", notificationMessage, "vaccine");
                }

                return RedirectToAction("PetMedicalRecords", new { id = vaccine.IdPet });
            }

            var petModel = await _context.Pets
                .Include(p => p.OwnerUser)
                .FirstOrDefaultAsync(p => p.IdPet == vaccine.IdPet);

            if (petModel == null)
            {
                return NotFound();
            }

            ViewBag.Pet = petModel;
            return View(vaccine);
        }

        private int GetCurrentVeterinarianId()
        {
            var userIdClaim = User.FindFirst("UserId");
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }
            return 0;
        }
    }
}