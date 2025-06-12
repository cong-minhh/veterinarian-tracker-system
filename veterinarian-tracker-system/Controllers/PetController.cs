using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TuyetDang.MyVetTracer.Data;
using TuyetDang.MyVetTracer.Entity;
using TuyetDang.MyVetTracer.ViewModels;

namespace veterinarian_tracker_system.Controllers
{
    public class PetController : Controller
    {
        private readonly ILogger<PetController> _logger;
        private readonly MyVetTracerDbContext _context;
        private readonly IWebHostEnvironment _env;

        public PetController(ILogger<PetController> logger, MyVetTracerDbContext context, IWebHostEnvironment env)
        {
            _logger = logger;
            _context = context;
            _env = env;
        }

        public async Task<IActionResult> PetIndex()
        {
            var pets = await _context.Pets
                                     .Include(p => p.OwnerUser)
                                     .Include(p => p.VetUser)
                                     .ToListAsync();

            return View(pets);
        }
        [HttpGet]
        public async Task<IActionResult> Create()
        {
            ViewBag.Owners = await _context.Owners.ToListAsync();
            ViewBag.Vets = await _context.Veterinarians.ToListAsync();
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(PetFormModel model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.Owners = await _context.Owners.ToListAsync();
                ViewBag.Vets = await _context.Veterinarians.ToListAsync();
                return View(model);
            }

            string imgPath = null;

            if (model.ImgFile != null && model.ImgFile.Length > 0)
            {
                var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/");
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.ImgFile.FileName);
                var filePath = Path.Combine(uploads, fileName);

                if (!Directory.Exists(uploads))
                    Directory.CreateDirectory(uploads);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.ImgFile.CopyToAsync(stream);
                }

                imgPath = "/uploads/" + fileName;
            }

            var pet = new Pet
            {
                Img = imgPath,
                PetType = model.PetType,
                PetName = model.PetName,
                Age = model.Age,
                Sex = model.Sex,
                Weight = model.Weight,
                Height = model.Height,
                Identification = model.Identification,
                IdOwnerUser = model.IdOwnerUser,
                IdVetUser = model.IdVetUser
            };

            _context.Pets.Add(pet);
            await _context.SaveChangesAsync();

            return RedirectToAction("PetIndex");
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var pet = await _context.Pets.FindAsync(id);
            if (pet == null) return NotFound();

            var model = new PetFormModel
            {
                PetType = pet.PetType,
                PetName = pet.PetName,
                Age = pet.Age,
                Sex = pet.Sex,
                Weight = pet.Weight,
                Height = pet.Height,
                Identification = pet.Identification,
                IdOwnerUser = pet.IdOwnerUser ?? 0,
                IdVetUser = pet.IdVetUser
            };

            ViewBag.CurrentImg = pet.Img;
            ViewBag.Owners = await _context.Owners.ToListAsync();
            ViewBag.Vets = await _context.Veterinarians.ToListAsync();

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, PetFormModel model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.CurrentImg = (await _context.Pets.FindAsync(id))?.Img;
                ViewBag.Owners = await _context.Owners.ToListAsync();
                ViewBag.Vets = await _context.Veterinarians.ToListAsync();
                return View(model);
            }

            var pet = await _context.Pets.FindAsync(id);
            if (pet == null) return NotFound();

            string imgPath = pet.Img;

            if (model.ImgFile != null && model.ImgFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.ImgFile.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.ImgFile.CopyToAsync(stream);
                }

                imgPath = "/uploads/" + fileName;
            }

            // Update Pet
            pet.PetType = model.PetType;
            pet.PetName = model.PetName;
            pet.Age = model.Age;
            pet.Sex = model.Sex;
            pet.Weight = model.Weight;
            pet.Height = model.Height;
            pet.Identification = model.Identification;
            pet.IdOwnerUser = model.IdOwnerUser;
            pet.IdVetUser = model.IdVetUser;
            pet.Img = imgPath;

            await _context.SaveChangesAsync();

            return RedirectToAction("PetIndex");
        }

        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var pet = await _context.Pets.FindAsync(id);
            if (pet == null) return NotFound();

            return View(pet);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var pet = await _context.Pets.FindAsync(id);
            if (pet == null) return NotFound();

            _context.Pets.Remove(pet);
            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = "Deleted pet successfully";

            return RedirectToAction("PetIndex");
        }


    }
}
