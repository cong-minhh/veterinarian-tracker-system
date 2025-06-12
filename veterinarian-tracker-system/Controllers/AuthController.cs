using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TuyetDang.MyVetTracer.Data;


namespace veterinarian_tracker_system.Controllers
{
    public class AuthController : Controller
    {
        private readonly MyVetTracerDbContext _context;

        public AuthController(MyVetTracerDbContext context)
        {
            _context = context;
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
            var admin = _context.Owners.FirstOrDefault(a => a.UserName == "admin" && a.Password == "Admin");
            if (admin != null)
            {
                await SignInUser("admin", "Admin");
                return RedirectToAction("Index", "Admin");
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

        private async Task SignInUser(string phone, string role)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, phone),
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
    }
}
