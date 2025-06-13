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

        public async Task<IActionResult> VeterinarianIndex(string searchTerm, string qualification, string sortBy, int page = 1)
        {
            try
            {
                // Start with all veterinarians
                var vetsQuery = _context.Veterinarians
                    .Include(v => v.Pets)
                    .Include(v => v.Appointments)
                        .ThenInclude(a => a.Pet)
                    .AsQueryable();

                // Apply search if provided
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    searchTerm = searchTerm.ToLower();
                    vetsQuery = vetsQuery.Where(v => 
                        v.UserName.ToLower().Contains(searchTerm) ||
                        v.FullName.ToLower().Contains(searchTerm) ||
                        v.Email.ToLower().Contains(searchTerm) ||
                        v.PhoneNum.ToLower().Contains(searchTerm) ||
                        v.NameOfConsultingRoom.ToLower().Contains(searchTerm) ||
                        v.ClinicAddress.ToLower().Contains(searchTerm) ||
                        v.Qualification.ToLower().Contains(searchTerm)
                    );
                }

                // Apply qualification filter if provided
                if (!string.IsNullOrEmpty(qualification))
                {
                    vetsQuery = vetsQuery.Where(v => v.Qualification == qualification);
                }

                // Count total records for pagination
                int totalRecords = await vetsQuery.CountAsync();
                int pageSize = 9; // Number of records per page
                int totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

                // Ensure page is within valid range
                page = Math.Max(1, Math.Min(page, Math.Max(1, totalPages)));

                // Apply sorting
                switch (sortBy)
                {
                    case "name-desc":
                        vetsQuery = vetsQuery.OrderByDescending(v => v.FullName);
                        break;
                    case "date":
                        vetsQuery = vetsQuery.OrderByDescending(v => v.UpdatedAt);
                        break;
                    case "pets":
                        vetsQuery = vetsQuery.OrderByDescending(v => v.Pets.Count);
                        break;
                    default: // Default to name ascending
                        vetsQuery = vetsQuery.OrderBy(v => v.FullName);
                        break;
                }

                // Apply pagination
                var vets = await vetsQuery
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                // Pass data to view
                ViewBag.CurrentSearch = searchTerm;
                ViewBag.CurrentQualification = qualification;
                ViewBag.CurrentSortBy = sortBy;
                ViewBag.CurrentPage = page;
                ViewBag.TotalPages = totalPages;
                ViewBag.HasPreviousPage = page > 1;
                ViewBag.HasNextPage = page < totalPages;

                // Get statistics for dashboard
                ViewBag.TotalVeterinarians = totalRecords;
                ViewBag.VerifiedVeterinarians = await _context.Veterinarians.CountAsync(v => v.Authentication == 1);
                ViewBag.PendingVeterinarians = await _context.Veterinarians.CountAsync(v => v.Authentication == 0);
                ViewBag.TotalPets = await _context.Pets.CountAsync();

                // Get qualification distribution for filtering
                ViewBag.Qualifications = await _context.Veterinarians
                    .GroupBy(v => v.Qualification)
                    .Select(g => new { Qualification = g.Key, Count = g.Count() })
                    .ToListAsync();

                return View(vets);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving veterinarians");
                TempData["ErrorMessage"] = "An error occurred while retrieving veterinarians. Please try again.";
                return View(new List<Veterinarian>());
            }
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

            // Check if username or email already exists
            if (await _context.Veterinarians.AnyAsync(v => v.UserName == model.UserName))
            {
                ModelState.AddModelError("UserName", "This username is already taken.");
                return View(model);
            }

            if (await _context.Veterinarians.AnyAsync(v => v.Email == model.Email))
            {
                ModelState.AddModelError("Email", "This email is already registered.");
                return View(model);
            }

            string imgPath = "/uploads/default-profile.png"; // Default image path

            if (model.ImgFile != null && model.ImgFile.Length > 0)
            {
                // Check if file is an image
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(model.ImgFile.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(extension))
                {
                    ModelState.AddModelError("ImgFile", "Only image files (jpg, jpeg, png, gif) are allowed.");
                    return View(model);
                }

                // Check file size (max 5MB)
                if (model.ImgFile.Length > 5 * 1024 * 1024)
                {
                    ModelState.AddModelError("ImgFile", "The file size should not exceed 5MB.");
                    return View(model);
                }

                var uploads = Path.Combine(_env.WebRootPath, "uploads");
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
                Password = model.Password, // In a real app, you should hash this password
                FullName = model.FullName,
                Dob = model.Dob,
                Gender = model.Gender,
                NameOfConsultingRoom = model.NameOfConsultingRoom,
                ClinicAddress = model.ClinicAddress,
                Qualification = model.Qualification,
                Experience = model.Experience,
                Authentication = model.Authentication,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            try
            {
                _context.Veterinarians.Add(veterinarian);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "Veterinarian created successfully!";
                return RedirectToAction("VeterinarianIndex");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new veterinarian");
                ModelState.AddModelError("", "An error occurred while saving. Please try again.");
                return View(model);
            }
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
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, VeterinarianFormModel model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.CurrentImg = (await _context.Veterinarians.FindAsync(id))?.Img;
                return View(model);
            }

            var vet = await _context.Veterinarians.FindAsync(id);
            if (vet == null) return NotFound();

            // Handle image upload
            string imgPath = vet.Img; // Keep existing image path by default
            if (model.ImgFile != null && model.ImgFile.Length > 0)
            {
                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
                var fileExtension = Path.GetExtension(model.ImgFile.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    ModelState.AddModelError("ImgFile", "Only JPG and PNG images are allowed.");
                    return View(model);
                }

                // Validate file size (max 5MB)
                if (model.ImgFile.Length > 5 * 1024 * 1024)
                {
                    ModelState.AddModelError("ImgFile", "Image size should not exceed 5MB.");
                    return View(model);
                }

                // Save the new image
                var uniqueFileName = Guid.NewGuid().ToString() + fileExtension;
                var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "veterinarians");
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Ensure directory exists
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await model.ImgFile.CopyToAsync(fileStream);
                }

                imgPath = $"/images/veterinarians/{uniqueFileName}";

                // Delete old image if it's not the default
                if (vet.Img != "/images/default-vet.png" && System.IO.File.Exists(Path.Combine(_env.WebRootPath, vet.Img.TrimStart('/'))))
                {
                    System.IO.File.Delete(Path.Combine(_env.WebRootPath, vet.Img.TrimStart('/')));
                }
            }

            // Update the entity
            vet.UserName = model.UserName;
            vet.Email = model.Email;
            vet.PhoneNum = model.PhoneNum;
            // Only update password if a new one is provided
            if (!string.IsNullOrWhiteSpace(model.Password))
            {
                vet.Password = model.Password; // In a real app, you should hash this password
            }
            vet.FullName = model.FullName;
            vet.Dob = model.Dob;
            vet.Gender = model.Gender;
            vet.NameOfConsultingRoom = model.NameOfConsultingRoom;
            vet.ClinicAddress = model.ClinicAddress;
            vet.Qualification = model.Qualification;
            vet.Experience = model.Experience;
            vet.Authentication = model.Authentication;
            vet.Img = imgPath;
            vet.UpdatedAt = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "Veterinarian updated successfully!";
                return RedirectToAction("VeterinarianIndex");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating veterinarian with ID {Id}", id);
                ModelState.AddModelError("", "An error occurred while saving changes. Please try again.");
                ViewBag.CurrentImg = vet.Img;
                return View(model);
            }
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
            var vet = await _context.Veterinarians
                .Include(v => v.Pets)
                .FirstOrDefaultAsync(v => v.IdVetUser == id);
                
            if (vet == null) return NotFound();

            // Check if veterinarian has associated pets
            if (vet.Pets != null && vet.Pets.Any())
            {
                TempData["ErrorMessage"] = "Cannot delete veterinarian with associated pets. Please reassign or delete the pets first.";
                return RedirectToAction("Delete", new { id });
            }

            // Delete the profile image if it exists and is not the default image
            if (!string.IsNullOrEmpty(vet.Img) && !vet.Img.Contains("default"))
            {
                var imagePath = Path.Combine(_env.WebRootPath, vet.Img.TrimStart('/').Replace("/", "\\"));
                if (System.IO.File.Exists(imagePath))
                {
                    try
                    {
                        System.IO.File.Delete(imagePath);
                    }
                    catch (Exception ex)
                    {
                        // Log the error but continue with deletion
                        _logger.LogError(ex, "Failed to delete image file: {Path}", imagePath);
                    }
                }
            }

            try
            {
                _context.Veterinarians.Remove(vet);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "Veterinarian deleted successfully";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting veterinarian with ID {Id}", id);
                TempData["ErrorMessage"] = "An error occurred while deleting the veterinarian. Please try again.";
            }

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
