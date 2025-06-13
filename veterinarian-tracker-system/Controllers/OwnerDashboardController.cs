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
using TuyetDang.MyVetTracer.ViewModels;
using veterinarian_tracker_system.Hubs;
using veterinarian_tracker_system.Models.Forms;
using veterinarian_tracker_system.ViewModels;

namespace veterinarian_tracker_system.Controllers
{
    [Authorize(Policy = "RequireOwnerRole")]
    public class OwnerDashboardController : Controller
    {
        private readonly MyVetTracerDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly ILogger<OwnerDashboardController> _logger;

        public OwnerDashboardController(MyVetTracerDbContext context, IHubContext<NotificationHub> hubContext, ILogger<OwnerDashboardController> logger)
        {
            _context = context;
            _hubContext = hubContext;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            var ownerId = GetCurrentOwnerId();
            if (ownerId == 0)
            {
                return RedirectToAction("Login", "Auth");
            }

            var owner = await _context.Owners
                .Include(o => o.Pets)
                .FirstOrDefaultAsync(o => o.IdOwnerUser == ownerId);

            if (owner == null)
            {
                return NotFound();
            }

            return View(owner);
        }

        public async Task<IActionResult> PetDetails(int id)
        {
            var ownerId = GetCurrentOwnerId();
            if (ownerId == 0)
            {
                return RedirectToAction("Login", "Auth");
            }

            var pet = await _context.Pets
                .Include(p => p.OwnerUser)
                .Include(p => p.VetUser)
                .Include(p => p.Vacs)
                .Include(p => p.Meds)
                .Include(p => p.Appointments)
                    .ThenInclude(a => a.VetUser)
                .FirstOrDefaultAsync(p => p.IdPet == id && p.IdOwnerUser == ownerId);

            if (pet == null)
            {
                return NotFound();
            }

            // Get online veterinarians
            ViewBag.OnlineVeterinarians = await _context.Veterinarians
                .Where(v => v.Authentication == 1) // Only verified vets
                .ToListAsync();

            return View(pet);
        }

        [HttpGet]
        public async Task<IActionResult> RequestAppointment(int petId)
        {
            var ownerId = GetCurrentOwnerId();
            if (ownerId == 0)
            {
                return RedirectToAction("Login", "Auth");
            }

            var pet = await _context.Pets
                .Include(p => p.OwnerUser)
                .FirstOrDefaultAsync(p => p.IdPet == petId && p.IdOwnerUser == ownerId);

            if (pet == null)
            {
                return NotFound();
            }

            var model = new
            {
                IdPet = pet.IdPet,
                PetName = pet.PetName,
                AvailableVeterinarians = await _context.Veterinarians
                    .Where(v => v.Authentication == 1) // Only verified vets
                    .Select(v => new { v.IdVetUser, v.FullName })
                    .ToListAsync()
            };

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RequestAppointment(veterinarian_tracker_system.ViewModels.AppointmentRequestViewModel model)
        {
            if (!ModelState.IsValid)
            {
                model.AvailableVeterinarians = await _context.Veterinarians
                    .Where(v => v.Authentication == 1)
                    .Select(v => new { v.FullName, v.Qualification })
                    .ToListAsync();
                return View(model);
            }

            var ownerId = GetCurrentOwnerId();
            if (ownerId == 0)
            {
                return RedirectToAction("Login", "Auth");
            }

            var pet = await _context.Pets
                .FirstOrDefaultAsync(p => p.IdPet == model.PetId && p.IdOwnerUser == ownerId);

            if (pet == null)
            {
                return NotFound();
            }

            var appointment = new Appointment
            {
                Time = model.AppointmentDate.ToString("yyyy-MM-dd HH:mm"),
                IsConfirmed = 0, // Pending confirmation
                IdPet = model.PetId,
                IdVeterinarian = model.VeterinarianId,
                CreatedAt = DateTime.Now
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Send notification to veterinarian
            var veterinarian = await _context.Veterinarians.FindAsync(model.VeterinarianId);
            if (veterinarian != null)
            {
                var notificationMessage = $"New appointment request from {pet.PetName}'s owner for {model.AppointmentDate}";
                await _hubContext.Clients.Group($"Vet_{veterinarian.IdVetUser}").SendAsync("ReceiveNotification", notificationMessage, "appointment");
            }

            TempData["SuccessMessage"] = "Appointment request submitted successfully. You will be notified when the veterinarian confirms it.";
            return RedirectToAction("PetDetails", new { id = model.PetId });
        }

        public async Task<IActionResult> Medications()
        {
            var ownerId = GetCurrentOwnerId();
            if (ownerId == 0)
            {
                return RedirectToAction("Login", "Auth");
            }

            var owner = await _context.Owners
                .Include(o => o.Pets)
                    .ThenInclude(p => p.Meds)
                        .ThenInclude(m => m.VetUser)
                .Include(o => o.Pets)
                    .ThenInclude(p => p.Vacs)
                        .ThenInclude(v => v.VetUser)
                .FirstOrDefaultAsync(o => o.IdOwnerUser == ownerId);

            if (owner == null)
            {
                return NotFound();
            }

            return View(owner);
        }

        public async Task<IActionResult> Notifications()
        {
            var ownerId = GetCurrentOwnerId();
            if (ownerId == 0)
            {
                return RedirectToAction("Login", "Auth");
            }

            // In a real application, you would have a notifications table
            // For now, we'll just pass the owner to the view
            var owner = await _context.Owners
                .FirstOrDefaultAsync(o => o.IdOwnerUser == ownerId);

            if (owner == null)
            {
                return NotFound();
            }

            return View(owner);
        }

        private int GetCurrentOwnerId()
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