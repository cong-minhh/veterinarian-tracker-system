using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TuyetDang.MyVetTracer.Data;
using TuyetDang.MyVetTracer.Entity;
using TuyetDang.MyVetTracer.ViewModels;

namespace veterinarian_tracker_system.Controllers
{
    public class VeterinarianController : Controller
    {
        private readonly ILogger<VeterinarianController> _logger;
        private readonly MyVetTracerDbContext _context;
        private readonly IWebHostEnvironment _env;

        public VeterinarianController(ILogger<VeterinarianController> logger, MyVetTracerDbContext context, IWebHostEnvironment env)
        {
            _logger = logger;
            _context = context;
            _env = env;
        }

        public async Task<IActionResult> VeterinarianIndex()
        {
            var vets = await _context.Veterinarians
                .Include(v => v.Pets)
                .ToListAsync();
            return View(vets);
        }
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(VeterinarianFormModel model)
        {
            if (!ModelState.IsValid)
            {
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

            var veterinarian = new Veterinarian
            {
                Img = imgPath,
                UserName = model.UserName,
                Email = model.Email,
                PhoneNum = model.PhoneNum,
                Password = model.Password,
                FullName = model.FullName,
                Dob = model.Dob,
                Gender = model.Gender,
                NameOfConsultingRoom = model.NameOfConsultingRoom,
                ClinicAddress = model.ClinicAddress,
                Qualification = model.Qualification,
                Experience = model.Experience,
                Authentication = model.Authentication
            };

            _context.Veterinarians.Add(veterinarian);
            await _context.SaveChangesAsync();

            return RedirectToAction("VeterinarianIndex");
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var vet = await _context.Veterinarians.FindAsync(id);
            if (vet == null) return NotFound();

            var model = new VeterinarianFormModel
            {
                UserName = vet.UserName,
                Email = vet.Email,
                PhoneNum = vet.PhoneNum,
                Password = vet.Password,
                FullName = vet.FullName,
                Dob = vet.Dob,
                Gender = vet.Gender,
                NameOfConsultingRoom = vet.NameOfConsultingRoom,
                ClinicAddress = vet.ClinicAddress,
                Qualification = vet.Qualification,
                Experience = vet.Experience,
                Authentication = vet.Authentication
            };

            ViewBag.CurrentImg = vet.Img;

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, VeterinarianFormModel model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.CurrentImg = (await _context.Veterinarians.FindAsync(id))?.Img;
                return View(model);
            }

            var vet = await _context.Veterinarians.FindAsync(id);
            if (vet == null) return NotFound();

            string imgPath = vet.Img;

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

            // Update the entity
            vet.UserName = model.UserName;
            vet.Email = model.Email;
            vet.PhoneNum = model.PhoneNum;
            vet.Password = model.Password;
            vet.FullName = model.FullName;
            vet.Dob = model.Dob;
            vet.Gender = model.Gender;
            vet.NameOfConsultingRoom = model.NameOfConsultingRoom;
            vet.ClinicAddress = model.ClinicAddress;
            vet.Qualification = model.Qualification;
            vet.Experience = model.Experience;
            vet.Authentication = model.Authentication;
            vet.Img = imgPath;

            await _context.SaveChangesAsync();

            return RedirectToAction("VeterinarianIndex");
        }

        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var vet = await _context.Veterinarians.FindAsync(id);
            if (vet == null) return NotFound();

            return View(vet);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var vet = await _context.Veterinarians.FindAsync(id);
            if (vet == null) return NotFound();

            _context.Veterinarians.Remove(vet);
            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = "Deleted user successfully";

            return RedirectToAction("VeterinarianIndex");
        }



        private int GetCurrentVeterinarianId()
        {
            // retrieve the ID from the authenticated user's claims.  
            //var userIdClaim = User?.Claims?.FirstOrDefault(c => c.Type == "VeterinarianId");
            //if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int vetId))
            //{
            //    return vetId;
            //}
            //throw new InvalidOperationException("Unable to determine the current veterinarian ID.");

            // If using session to store the veterinarian ID
            return int.Parse(HttpContext.Session.GetString("VeterinarianId"));

        }

        [HttpGet]
        public async Task<IActionResult> Profile()
        {
            int vetId = GetCurrentVeterinarianId();
            var vet = await _context.Veterinarians.FindAsync(vetId);
            if (vet == null) return NotFound();

            return View(vet);
        }

        [HttpGet]
        public async Task<IActionResult> EditProfile()
        {
            int vetId = GetCurrentVeterinarianId();
            var vet = await _context.Veterinarians.FindAsync(vetId);
            if (vet == null) return NotFound();

            var model = new VeterinarianFormModel
            {
                UserName = vet.UserName,
                Email = vet.Email,
                PhoneNum = vet.PhoneNum,
                Password = vet.Password,
                FullName = vet.FullName,
                Dob = vet.Dob,
                Gender = vet.Gender,
                NameOfConsultingRoom = vet.NameOfConsultingRoom,
                ClinicAddress = vet.ClinicAddress,
                Qualification = vet.Qualification,
                Experience = vet.Experience,
                Authentication = vet.Authentication
            };

            ViewBag.CurrentImg = vet.Img;
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProfile(VeterinarianFormModel model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.CurrentImg = (await _context.Veterinarians.FindAsync(GetCurrentVeterinarianId()))?.Img;
                return View(model);
            }

            var vet = await _context.Veterinarians.FindAsync(GetCurrentVeterinarianId());
            if (vet == null) return NotFound();

            string imgPath = vet.Img;
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

            vet.UserName = model.UserName;
            vet.Email = model.Email;
            vet.PhoneNum = model.PhoneNum;
            vet.Password = model.Password;
            vet.FullName = model.FullName;
            vet.Dob = model.Dob;
            vet.Gender = model.Gender;
            vet.NameOfConsultingRoom = model.NameOfConsultingRoom;
            vet.ClinicAddress = model.ClinicAddress;
            vet.Qualification = model.Qualification;
            vet.Experience = model.Experience;
            vet.Authentication = model.Authentication;
            vet.Img = imgPath;

            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = "Updated successfully";
            return RedirectToAction("Profile");
        }

        [HttpGet]
        public async Task<IActionResult> MyPets()
        {
            int vetId = GetCurrentVeterinarianId();
            var pets = await _context.Pets
                .Where(p => p.IdVetUser == vetId)
                .ToListAsync();

            return View(pets);
        }

        [HttpGet]
        public async Task<IActionResult> PetDetails(int id)
        {
            var pet = await _context.Pets
                .Include(p => p.OwnerUser)
                .FirstOrDefaultAsync(p => p.IdPet == id && p.IdVetUser == GetCurrentVeterinarianId());

            if (pet == null) return NotFound();

            return View(pet);
        }

    }
}
