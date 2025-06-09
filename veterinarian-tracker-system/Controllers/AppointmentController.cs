using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public async Task<IActionResult> AppointmentIndex()
        {
            var appointments = await _context.Appointments
                                             .Include(a => a.Pet)
                                             .Include(a => a.VetUser)
                                             .ToListAsync();

            return View(appointments);
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
