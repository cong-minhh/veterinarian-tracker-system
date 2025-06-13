using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using TuyetDang.MyVetTracer.Data;
using TuyetDang.MyVetTracer.Entity;
using TuyetDang.MyVetTracer.ViewModels;

namespace veterinarian_tracker_system.Controllers
{
    public class AppointmentController : Controller
    {
        private readonly ILogger<AppointmentController> _logger;
        private readonly MyVetTracerDbContext _context;

        public AppointmentController(ILogger<AppointmentController> logger, MyVetTracerDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IActionResult> AppointmentIndex(string searchString, string dateRange, string statusFilter)
        {
            try
            {
                // Store filter values in ViewBag for maintaining state in the view
                ViewBag.CurrentFilter = searchString;
                ViewBag.CurrentDateRange = dateRange;
                ViewBag.CurrentStatus = statusFilter;

                // Start with base query
                var appointmentsQuery = _context.Appointments
                    .Include(a => a.Pet)
                        .ThenInclude(p => p.OwnerUser)
                    .Include(a => a.VetUser)
                    .AsQueryable();

                // Apply search filter if provided
                if (!string.IsNullOrEmpty(searchString))
                {
                    searchString = searchString.ToLower();
                    appointmentsQuery = appointmentsQuery.Where(a =>
                        (a.Pet != null && a.Pet.PetName.ToLower().Contains(searchString)) ||
                        (a.Pet != null && a.Pet.PetType.ToLower().Contains(searchString)) ||
                        (a.Pet != null && a.Pet.OwnerUser != null && a.Pet.OwnerUser.FullName.ToLower().Contains(searchString)) ||
                        (a.VetUser != null && a.VetUser.FullName.ToLower().Contains(searchString)) ||
                        a.Time.ToLower().Contains(searchString)
                    );
                }

                // Apply date range filter if provided
                if (!string.IsNullOrEmpty(dateRange))
                {
                    // Parse date range (format: MM/DD/YYYY - MM/DD/YYYY)
                    var dates = dateRange.Split('-');
                    if (dates.Length == 2)
                    {
                        if (DateTime.TryParse(dates[0].Trim(), out DateTime startDate) && 
                            DateTime.TryParse(dates[1].Trim(), out DateTime endDate))
                        {
                            // Add one day to end date to include the entire day
                            endDate = endDate.AddDays(1).AddSeconds(-1);
                            
                            // Format dates to match the stored format
                            string startDateStr = startDate.ToString("yyyy-MM-dd");
                            string endDateStr = endDate.ToString("yyyy-MM-dd 23:59:59");
                            
                            appointmentsQuery = appointmentsQuery.Where(a => 
                                string.Compare(a.Time, startDateStr) >= 0 && 
                                string.Compare(a.Time, endDateStr) <= 0);
                        }
                    }
                }

                // Apply status filter if provided
                if (!string.IsNullOrEmpty(statusFilter))
                {
                    if (statusFilter.ToLower() == "confirmed")
                    {
                        appointmentsQuery = appointmentsQuery.Where(a => a.IsConfirmed == 1);
                    }
                    else if (statusFilter.ToLower() == "pending")
                    {
                        appointmentsQuery = appointmentsQuery.Where(a => a.IsConfirmed == 0);
                    }
                }

                // Order by date (newest first)
                appointmentsQuery = appointmentsQuery.OrderByDescending(a => a.Time);

                var appointments = await appointmentsQuery.ToListAsync();

                // Log search results for debugging
                _logger.LogInformation($"Appointment search: {searchString ?? "none"}, Date Range: {dateRange ?? "none"}, Status: {statusFilter ?? "all"}, Results: {appointments.Count}");

                return View(appointments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointments");
                TempData["ErrorMessage"] = "An error occurred while retrieving appointments. Please try again.";
                return View(new List<Appointment>());
            }
        }

        [HttpGet]
        public async Task<IActionResult> Create()
        {
            ViewBag.Pets = await _context.Pets.ToListAsync();
            ViewBag.Vets = await _context.Veterinarians.ToListAsync();
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(AppointmentFormModel model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.Pets = await _context.Pets.ToListAsync();
                ViewBag.Vets = await _context.Veterinarians.ToListAsync();
                return View(model);
            }

            var appointment = new Appointment
            {
                Time = model.AppointmentTime.ToString("yyyy-MM-dd HH:mm:ss"),
                IsConfirmed = model.IsConfirmed ? 1 : 0,
                IdPet = model.IdPet,
                IdVeterinarian = model.IdVeterinarian
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return RedirectToAction("AppointmentIndex");
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();

            var model = new AppointmentFormModel
            {
                AppointmentTime = DateTime.Parse(appointment.Time),
                IsConfirmed = appointment.IsConfirmed == 1,
                IdPet = appointment.IdPet ?? 0,
                IdVeterinarian = appointment.IdVeterinarian ?? 0
            };

            ViewBag.Pets = await _context.Pets.ToListAsync();
            ViewBag.Vets = await _context.Veterinarians.ToListAsync();

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, AppointmentFormModel model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.Pets = await _context.Pets.ToListAsync();
                ViewBag.Vets = await _context.Veterinarians.ToListAsync();
                return View(model);
            }

            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();

            appointment.Time = model.AppointmentTime.ToString("yyyy-MM-dd HH:mm:ss");
            appointment.IsConfirmed = model.IsConfirmed ? 1 : 0;
            appointment.IdPet = model.IdPet;
            appointment.IdVeterinarian = model.IdVeterinarian;

            await _context.SaveChangesAsync();

            return RedirectToAction("AppointmentIndex");
        }

        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Pet)
                .Include(a => a.VetUser)
                .FirstOrDefaultAsync(a => a.IdAppointment == id);

            if (appointment == null) return NotFound();

            return View(appointment);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = "Deleted appointment successfully";

            return RedirectToAction("AppointmentIndex");
        }
    }
}
