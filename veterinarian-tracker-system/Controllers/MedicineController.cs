using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TuyetDang.MyVetTracer.Data;
using TuyetDang.MyVetTracer.Entity;
using TuyetDang.MyVetTracer.ViewModels;

namespace veterinarian_tracker_system.Controllers
{
    public class MedicineController : Controller
    {
        private readonly ILogger<MedicineController> _logger;
        private readonly MyVetTracerDbContext _context;

        public MedicineController(ILogger<MedicineController> logger, MyVetTracerDbContext context)
        {
            _logger = logger;
            _context = context;
        }
        public async Task<IActionResult> MedicineIndex()
        {
            var meds = await _context.Medicines
                                     .Include(m => m.Pet)
                                     .Include(m => m.VetUser)
                                     .ToListAsync();

            return View(meds);
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
        public async Task<IActionResult> Create(MedicineFormModel model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.Pets = await _context.Pets.ToListAsync();
                ViewBag.Vets = await _context.Veterinarians.ToListAsync();
                return View(model);
            }

            var medicine = new Medicine
            {
                MedName = model.MedName,
                Amount = model.Amount,
                Notice = model.Notice,
                Dose = model.Dose,
                Total = model.Total,
                IdPet = model.IdPet,
                IdVeterinarian = model.IdVeterinarian
            };

            _context.Medicines.Add(medicine);
            await _context.SaveChangesAsync();

            return RedirectToAction("MedicineIndex");
        }
        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var medicine = await _context.Medicines.FindAsync(id);
            if (medicine == null) return NotFound();

            var model = new MedicineFormModel
            {
                MedName = medicine.MedName,
                Amount = medicine.Amount,
                Notice = medicine.Notice,
                Dose = medicine.Dose,
                Total = medicine.Total,
                IdPet = medicine.IdPet ?? 0,
                IdVeterinarian = medicine.IdVeterinarian ?? 0
            };

            ViewBag.Pets = await _context.Pets.ToListAsync();
            ViewBag.Vets = await _context.Veterinarians.ToListAsync();

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, MedicineFormModel model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.Pets = await _context.Pets.ToListAsync();
                ViewBag.Vets = await _context.Veterinarians.ToListAsync();
                return View(model);
            }

            var medicine = await _context.Medicines.FindAsync(id);
            if (medicine == null) return NotFound();

            medicine.MedName = model.MedName;
            medicine.Amount = model.Amount;
            medicine.Notice = model.Notice;
            medicine.Dose = model.Dose;
            medicine.Total = model.Total;
            medicine.IdPet = model.IdPet;
            medicine.IdVeterinarian = model.IdVeterinarian;

            await _context.SaveChangesAsync();

            return RedirectToAction("MedicineIndex");
        }
        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var medicine = await _context.Medicines
                                         .Include(m => m.Pet)
                                         .Include(m => m.VetUser)
                                         .FirstOrDefaultAsync(m => m.IdMed == id);

            if (medicine == null) return NotFound();

            return View(medicine);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var medicine = await _context.Medicines.FindAsync(id);
            if (medicine == null) return NotFound();

            _context.Medicines.Remove(medicine);
            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = "Deleted medicine successfully";

            return RedirectToAction("MedicineIndex");
        }

    }
}
