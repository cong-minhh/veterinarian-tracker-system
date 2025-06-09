using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TuyetDang.MyVetTracer.Data;
using TuyetDang.MyVetTracer.Entity;
using TuyetDang.MyVetTracer.ViewModels;

namespace veterinarian_tracker_system.Controllers
{
    public class VaccineController : Controller
    {
        private readonly ILogger<VaccineController> _logger;
        private readonly MyVetTracerDbContext _context;

        public VaccineController(ILogger<VaccineController> logger, MyVetTracerDbContext context)
        {
            _logger = logger;
            _context = context;
        }
        public async Task<IActionResult> VaccineIndex()
        {
            var vacs = await _context.Vaccines
                                     .Include(v => v.Pet)
                                        .ThenInclude(p => p.OwnerUser)
                                     .Include(v => v.VetUser)
                                     .ToListAsync();

            return View(vacs);
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
        public async Task<IActionResult> Create(VaccineFormModel model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.Pets = await _context.Pets.ToListAsync();
                ViewBag.Vets = await _context.Veterinarians.ToListAsync();
                return View(model);
            }

            var vaccine = new Vaccine
            {
                VacName = model.VacName,
                Date = model.Date,
                Dose = model.Dose,
                Total = model.Total,
                IdPet = model.IdPet,
                IdVeterinarian = model.IdVeterinarian
            };

            _context.Vaccines.Add(vaccine);
            await _context.SaveChangesAsync();

            return RedirectToAction("VaccineIndex");
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var vaccine = await _context.Vaccines.FindAsync(id);
            if (vaccine == null) return NotFound();

            var model = new VaccineFormModel
            {
                VacName = vaccine.VacName,
                Date = vaccine.Date,
                Dose = vaccine.Dose,
                Total = vaccine.Total,
                IdPet = vaccine.IdPet ?? 0,
                IdVeterinarian = vaccine.IdVeterinarian ?? 0
            };

            ViewBag.Pets = await _context.Pets.ToListAsync();
            ViewBag.Vets = await _context.Veterinarians.ToListAsync();

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, VaccineFormModel model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.Pets = await _context.Pets.ToListAsync();
                ViewBag.Vets = await _context.Veterinarians.ToListAsync();
                return View(model);
            }

            var vaccine = await _context.Vaccines.FindAsync(id);
            if (vaccine == null) return NotFound();

            vaccine.VacName = model.VacName;
            vaccine.Date = model.Date;
            vaccine.Dose = model.Dose;
            vaccine.Total = model.Total;
            vaccine.IdPet = model.IdPet;
            vaccine.IdVeterinarian = model.IdVeterinarian;

            await _context.SaveChangesAsync();

            return RedirectToAction("VaccineIndex");
        }
        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var vaccine = await _context.Vaccines
                                        .Include(v => v.Pet)
                                        .Include(v => v.VetUser)
                                        .FirstOrDefaultAsync(v => v.IdVac == id);

            if (vaccine == null) return NotFound();

            return View(vaccine);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var vaccine = await _context.Vaccines.FindAsync(id);
            if (vaccine == null) return NotFound();

            _context.Vaccines.Remove(vaccine);
            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = "Deleted vaccine successfully";

            return RedirectToAction("VaccineIndex");
        }

    }
}
