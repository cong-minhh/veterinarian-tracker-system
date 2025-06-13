using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using TuyetDang.MyVetTracer.Data;
using TuyetDang.MyVetTracer.Entity;
using TuyetDang.MyVetTracer.ViewModels;

namespace veterinarian_tracker_system.Controllers
{
    public class OwnerController : Controller
    {
        private readonly ILogger<OwnerController> _logger;
        private readonly MyVetTracerDbContext _context;
        private readonly IWebHostEnvironment _env;

        public OwnerController(ILogger<OwnerController> logger, MyVetTracerDbContext context, IWebHostEnvironment env)
        {
            _logger = logger;
            _context = context;
            _env = env;
        }

        public async Task<IActionResult> OwnerIndex(string searchString, string sortOrder, int page = 1)
        {
            try
            {
                // Start with all owners
                var ownersQuery = _context.Owners
                    .Include(o => o.Pets)
                    .AsQueryable();

                // Apply search if provided
                if (!string.IsNullOrEmpty(searchString))
                {
                    searchString = searchString.ToLower();
                    ownersQuery = ownersQuery.Where(o =>
                        o.UserName.ToLower().Contains(searchString) ||
                        o.FullName.ToLower().Contains(searchString) ||
                        o.Email.ToLower().Contains(searchString) ||
                        o.PhoneNum.ToLower().Contains(searchString) ||
                        o.Gender.ToLower().Contains(searchString)
                    );
                }

                // Count total records for pagination
                int totalRecords = await ownersQuery.CountAsync();
                int pageSize = 9; // Number of records per page
                int totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

                // Ensure page is within valid range
                page = Math.Max(1, Math.Min(page, Math.Max(1, totalPages)));

                // Apply sorting
                switch (sortOrder)
                {
                    case "name_desc":
                        ownersQuery = ownersQuery.OrderByDescending(o => o.FullName);
                        break;
                    case "date_asc":
                        ownersQuery = ownersQuery.OrderBy(o => o.CreatedAt);
                        break;
                    case "date_desc":
                        ownersQuery = ownersQuery.OrderByDescending(o => o.CreatedAt);
                        break;
                    case "pets_asc":
                        ownersQuery = ownersQuery.OrderBy(o => o.Pets.Count);
                        break;
                    case "pets_desc":
                        ownersQuery = ownersQuery.OrderByDescending(o => o.Pets.Count);
                        break;
                    case "name_asc":
                    default: // Default to name ascending
                        ownersQuery = ownersQuery.OrderBy(o => o.FullName);
                        break;
                }

                // Apply pagination
                var owners = await ownersQuery
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                // Pass data to view
                ViewBag.CurrentFilter = searchString;
                ViewBag.CurrentSort = sortOrder;
                ViewBag.CurrentPage = page;
                ViewBag.TotalPages = totalPages;
                ViewBag.HasPreviousPage = page > 1;
                ViewBag.HasNextPage = page < totalPages;
                ViewBag.TotalOwners = totalRecords;

                return View(owners);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving owners");
                return View(new List<Owner>());
            }
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(OwnerFormModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            try
            {
                // Check if username already exists
                if (await _context.Owners.AnyAsync(o => o.UserName == model.UserName))
                {
                    ModelState.AddModelError("UserName", "This username is already taken");
                    return View(model);
                }

                // Check if email already exists
                if (await _context.Owners.AnyAsync(o => o.Email == model.Email))
                {
                    ModelState.AddModelError("Email", "This email address is already registered");
                    return View(model);
                }

                string imgPath = null;

                // Process image upload if provided
                if (model.ImgFile != null && model.ImgFile.Length > 0)
                {
                    // Validate file type
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                    var extension = Path.GetExtension(model.ImgFile.FileName).ToLowerInvariant();
                    
                    if (!allowedExtensions.Contains(extension))
                    {
                        ModelState.AddModelError("ImgFile", "Only image files (.jpg, .jpeg, .png, .gif) are allowed");
                        return View(model);
                    }

                    // Validate file size (max 5MB)
                    if (model.ImgFile.Length > 5 * 1024 * 1024)
                    {
                        ModelState.AddModelError("ImgFile", "The file size should not exceed 5MB");
                        return View(model);
                    }

                    var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                    var fileName = Guid.NewGuid().ToString() + extension;
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.ImgFile.CopyToAsync(stream);
                    }

                    imgPath = "/uploads/" + fileName;
                }

                var owner = new Owner
                {
                    Img = imgPath,
                    UserName = model.UserName,
                    Email = model.Email,
                    PhoneNum = model.PhoneNum,
                    Password = model.Password, // In a real application, this should be hashed
                    FullName = model.FullName,
                    Dob = model.Dob,
                    Gender = model.Gender,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _context.Owners.Add(owner);
                await _context.SaveChangesAsync();

                TempData["SuccessMessage"] = "Owner created successfully";
                return RedirectToAction("OwnerIndex");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating owner");
                ModelState.AddModelError("", "An error occurred while creating the owner. Please try again.");
                return View(model);
            }
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var owner = await _context.Owners.FindAsync(id);
            if (owner == null) return NotFound();

            var model = new OwnerFormModel
            {
                UserName = owner.UserName,
                Email = owner.Email,
                PhoneNum = owner.PhoneNum,
                Password = owner.Password,
                FullName = owner.FullName,
                Dob = owner.Dob,
                Gender = owner.Gender
            };

            ViewBag.OwnerId = id;
            ViewBag.CurrentImg = owner.Img;

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, OwnerFormModel model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.OwnerId = id;
                ViewBag.CurrentImg = (await _context.Owners.FindAsync(id))?.Img;
                return View(model);
            }

            try
            {
                var owner = await _context.Owners.FindAsync(id);
                if (owner == null) return NotFound();

                // Check if username is changed and already exists
                if (owner.UserName != model.UserName && await _context.Owners.AnyAsync(o => o.UserName == model.UserName))
                {
                    ModelState.AddModelError("UserName", "This username is already taken");
                    ViewBag.OwnerId = id;
                    ViewBag.CurrentImg = owner.Img;
                    return View(model);
                }

                // Check if email is changed and already exists
                if (owner.Email != model.Email && await _context.Owners.AnyAsync(o => o.Email == model.Email))
                {
                    ModelState.AddModelError("Email", "This email address is already registered");
                    ViewBag.OwnerId = id;
                    ViewBag.CurrentImg = owner.Img;
                    return View(model);
                }

                // Process image upload if provided
                if (model.ImgFile != null && model.ImgFile.Length > 0)
                {
                    // Validate file type
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                    var extension = Path.GetExtension(model.ImgFile.FileName).ToLowerInvariant();
                    
                    if (!allowedExtensions.Contains(extension))
                    {
                        ModelState.AddModelError("ImgFile", "Only image files (.jpg, .jpeg, .png, .gif) are allowed");
                        ViewBag.OwnerId = id;
                        ViewBag.CurrentImg = owner.Img;
                        return View(model);
                    }

                    // Validate file size (max 5MB)
                    if (model.ImgFile.Length > 5 * 1024 * 1024)
                    {
                        ModelState.AddModelError("ImgFile", "The file size should not exceed 5MB");
                        ViewBag.OwnerId = id;
                        ViewBag.CurrentImg = owner.Img;
                        return View(model);
                    }

                    var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                    Directory.CreateDirectory(uploadsFolder);

                    var fileName = Guid.NewGuid().ToString() + extension;
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.ImgFile.CopyToAsync(stream);
                    }

                    // Delete old image file if it exists
                    if (!string.IsNullOrEmpty(owner.Img))
                    {
                        var oldImagePath = Path.Combine(_env.WebRootPath, owner.Img.TrimStart('/'));
                        if (System.IO.File.Exists(oldImagePath))
                        {
                            try
                            {
                                System.IO.File.Delete(oldImagePath);
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(ex, "Failed to delete old image file: {FilePath}", oldImagePath);
                            }
                        }
                    }

                    owner.Img = "/uploads/" + fileName;
                }

                // Update owner properties
                owner.UserName = model.UserName;
                owner.Email = model.Email;
                owner.PhoneNum = model.PhoneNum;
                owner.Password = model.Password; // In a real application, this should be hashed
                owner.FullName = model.FullName;
                owner.Dob = model.Dob;
                owner.Gender = model.Gender;
                owner.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                TempData["SuccessMessage"] = "Owner updated successfully";
                return RedirectToAction("OwnerIndex");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating owner with ID {OwnerId}", id);
                ModelState.AddModelError("", "An error occurred while updating the owner. Please try again.");
                ViewBag.OwnerId = id;
                ViewBag.CurrentImg = (await _context.Owners.FindAsync(id))?.Img;
                return View(model);
            }
        }

        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var owner = await _context.Owners.FindAsync(id);
            if (owner == null) return NotFound();

            return View(owner);
        }

        // POST: Owner/DeleteConfirmed
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var owner = await _context.Owners.Include(o => o.Pets).FirstOrDefaultAsync(o => o.IdOwnerUser == id);
                if (owner == null) return NotFound();

                // Check if owner has pets
                if (owner.Pets != null && owner.Pets.Any())
                {
                    TempData["ErrorMessage"] = "Cannot delete owner with associated pets. Please remove or reassign the pets first.";
                    return RedirectToAction("OwnerIndex");
                }

                // Delete owner's image file if it exists
                if (!string.IsNullOrEmpty(owner.Img))
                {
                    var imagePath = Path.Combine(_env.WebRootPath, owner.Img.TrimStart('/'));
                    if (System.IO.File.Exists(imagePath))
                    {
                        try
                        {
                            System.IO.File.Delete(imagePath);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex, "Failed to delete image file: {FilePath}", imagePath);
                        }
                    }
                }

                _context.Owners.Remove(owner);
                await _context.SaveChangesAsync();

                TempData["SuccessMessage"] = "Owner deleted successfully";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting owner with ID {OwnerId}", id);
                TempData["ErrorMessage"] = "An error occurred while deleting the owner. Please try again.";
            }

            return RedirectToAction("OwnerIndex");
        }

    }
}
