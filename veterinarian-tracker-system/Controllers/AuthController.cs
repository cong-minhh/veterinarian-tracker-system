using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TuyetDang.MyVetTracer.Data;
using TuyetDang.MyVetTracer.Entity;
using TuyetDang.MyVetTracer.ViewModels;


namespace veterinarian_tracker_system.Controllers
{
    public class AuthController : Controller
    {
        private readonly MyVetTracerDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AuthController(MyVetTracerDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: /Auth/Login
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        // POST: /Auth/Login
        [HttpPost]
        public async Task<IActionResult> Login(string userName, string password)
        {
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password))
            {
                ViewBag.Error = "Phone and password are required.";
                return View();
            }

            // Check Admin
            if (userName == "admin" && password == "Admin")
            {
                var admin = _context.Owners.FirstOrDefault(a => a.UserName == "admin" && a.Password == "Admin");
                if (admin != null)
                {
                    await SignInUser("admin", "Admin");
                    return RedirectToAction("Index", "Admin");
                }
            }
            // Check Owner
            var owner = _context.Owners.FirstOrDefault(o => o.UserName == userName && o.Password == password);
            if (owner != null)
            {
                await SignInUser(owner.UserName, "Owner");
                return RedirectToAction("Index", "Home");
            }

            // Check Veterinarian
            var vet = _context.Veterinarians.FirstOrDefault(v => v.UserName == userName && v.Password == password);
            if (vet != null)
            {
                await SignInUser(vet.UserName, "Veterinarian");
                return RedirectToAction("Index", "Home");
            }

            ViewBag.Error = "Invalid login credentials.";
            return View();
        }

        private async Task SignInUser(string userName, string role)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, userName),
                new Claim(ClaimTypes.Role, role)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
        }

        // GET: /Auth/Logout
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login", "Auth");
        }

        // GET: /Auth/AccessDenied
        public IActionResult AccessDenied()
        {
            return View();
        }
        private async Task<object?> GetCurrentUserAsync()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                return null;

            var userName = User.Identity.Name;
            var roleClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            var role = roleClaim?.Value;

            switch (role)
            {
                case "Admin":
                    return await _context.Owners.FirstOrDefaultAsync(a => a.UserName == "admin");
                case "Owner":
                    return await _context.Owners.FirstOrDefaultAsync(o => o.UserName == userName);
                case "Veterinarian":
                    return await _context.Veterinarians.FirstOrDefaultAsync(v => v.UserName == userName);
                default:
                    return null;
            }
        }

        // Profile action
        public async Task<IActionResult> Profile()
        {
            var currentUser = await GetCurrentUserAsync();
            if (currentUser == null)
                return RedirectToAction("Login");

            return View(currentUser); // View will use dynamic model
        }
        [HttpGet]
        public async Task<IActionResult> Edit()
        {
            var currentUser = await GetCurrentUserAsync();
            if (currentUser == null) return NotFound();

            // Explicitly cast the object to Owner and handle potential nullability
            var owner = currentUser as Owner;
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

            ViewBag.OwnerId = owner.IdOwnerUser;
            ViewBag.CurrentImg = owner.Img;

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, OwnerFormModel model)
        {
            if (!ModelState.IsValid)
            {
                foreach (var kvp in ModelState)
                {
                    var key = kvp.Key;
                    var errors = kvp.Value.Errors;
                    foreach (var error in errors)
                    {
                        Console.WriteLine($"Field: {key} - Error: {error.ErrorMessage}");
                    }
                }

                ViewBag.OwnerId = id;
                ViewBag.CurrentImg = (await _context.Owners.FindAsync(id))?.Img;
                return View(model);
            }

            var owner = await _context.Owners.FindAsync(id);
            if (owner == null) return NotFound();

            owner.UserName = model.UserName;
            owner.Email = model.Email;
            owner.PhoneNum = model.PhoneNum;
          
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
            return   RedirectToAction("Profile"); ;
        }
        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(OwnerFormModel model)
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


            if (model.Role == "Owner")
            {
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

                return RedirectToAction("Login", "Auth");
            }
            else
            {
                var vet = new Veterinarian
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


                _context.Veterinarians.Add(vet);
                await _context.SaveChangesAsync();

                return RedirectToAction("Login", "Auth");
            }
        }

    
}
}