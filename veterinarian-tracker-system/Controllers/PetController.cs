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

        public async Task<IActionResult> PetIndex(string searchString, string sortOrder)
        {
            // Store filter values in ViewBag for maintaining state in the view
            ViewBag.CurrentFilter = searchString;
            ViewBag.CurrentSort = sortOrder;
            
            // Set up sort options
            ViewBag.NameSortParm = sortOrder == "name_asc" ? "name_desc" : "name_asc";
            ViewBag.TypeSortParm = sortOrder == "type_asc" ? "type_desc" : "type_asc";
            ViewBag.AgeSortParm = sortOrder == "age_asc" ? "age_desc" : "age_asc";
            ViewBag.DateSortParm = sortOrder == "date_asc" ? "date_desc" : "date_asc";
            
            // Start with base query
            var petsQuery = _context.Pets
                .Include(p => p.OwnerUser)
                .Include(p => p.VetUser)
                .Include(p => p.Appointments)
                    .ThenInclude(a => a.VetUser)
                .Include(p => p.Meds)
                    .ThenInclude(m => m.VetUser)
                .Include(p => p.Vacs)
                    .ThenInclude(v => v.VetUser)
                .AsQueryable();
            
            // Apply search filter if provided
            if (!string.IsNullOrEmpty(searchString))
            {
                searchString = searchString.ToLower();
                petsQuery = petsQuery.Where(p => 
                    p.PetName.ToLower().Contains(searchString) ||
                    p.PetType.ToLower().Contains(searchString) ||
                    (p.Identification != null && p.Identification.ToLower().Contains(searchString)) ||
                    (p.OwnerUser != null && p.OwnerUser.FullName.ToLower().Contains(searchString))
                );
            }
            
            // Apply sorting
            petsQuery = sortOrder switch
            {
                "name_asc" => petsQuery.OrderBy(p => p.PetName),
                "name_desc" => petsQuery.OrderByDescending(p => p.PetName),
                "type_asc" => petsQuery.OrderBy(p => p.PetType),
                "type_desc" => petsQuery.OrderByDescending(p => p.PetType),
                "age_asc" => petsQuery.OrderBy(p => p.Age),
                "age_desc" => petsQuery.OrderByDescending(p => p.Age),
                "date_asc" => petsQuery.OrderBy(p => p.CreatedAt),
                "date_desc" => petsQuery.OrderByDescending(p => p.CreatedAt),
                _ => petsQuery.OrderByDescending(p => p.CreatedAt) // Default sort is newest first
            };
            
            var pets = await petsQuery.ToListAsync();
            
            // Log search results for debugging
            _logger.LogInformation($"Pet search: {searchString ?? "none"}, Sort: {sortOrder ?? "none"}, Results: {pets.Count}");
            
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
