using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public async Task<IActionResult> OwnerIndex()
        {
            var owners = await _context.Owners
                                       .Include(o => o.Pets)
                                       .ToListAsync();
            return View(owners);
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

            var owner = new Owner
            {
                Img = imgPath,
                UserName = model.UserName,
                Email = model.Email,
                PhoneNum = model.PhoneNum,
                Password = model.Password,
                FullName = model.FullName,
                Dob = model.Dob,
                Gender = model.Gender
            };


            _context.Owners.Add(owner);
            await _context.SaveChangesAsync();

            return RedirectToAction("OwnerIndex");
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

            var owner = await _context.Owners.FindAsync(id);
            if (owner == null) return NotFound();

            owner.UserName = model.UserName;
            owner.Email = model.Email;
            owner.PhoneNum = model.PhoneNum;
            owner.Password = model.Password;
            owner.FullName = model.FullName;
            owner.Dob = model.Dob;
            owner.Gender = model.Gender;
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

                owner.Img = "/uploads/" + fileName;
            }

            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = "Updated owner successfully";
            return RedirectToAction("OwnerIndex");
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
            var owner = await _context.Owners.FindAsync(id);
            if (owner == null) return NotFound();

            _context.Owners.Remove(owner);
            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = "Deleted owner successfully";

            return RedirectToAction("OwnerIndex");
        }

    }
}
