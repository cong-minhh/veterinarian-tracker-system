using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TuyetDang.MyVetTracer.Data;
using TuyetDang.MyVetTracer.Entity;
using veterinarian_tracker_system.Models.Forms;

namespace veterinarian_tracker_system.Controllers
{
    public class AuthController : Controller
    {
        private readonly MyVetTracerDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(MyVetTracerDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: /Auth/Login
        [HttpGet]
        public IActionResult Login(string returnUrl = null)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        // POST: /Auth/Login
        [HttpPost]
        public async Task<IActionResult> Login(UserLoginForm model, bool rememberMe = false, string returnUrl = null)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Check Admin
            var admin = await _context.Owners.FirstOrDefaultAsync(a => a.UserName == "admin");
            if (admin != null && admin.UserName == model.UserName && VerifyPassword(model.Password, admin.Password))
            {
                await SignInUser(admin.UserName, "Admin", admin.IdOwnerUser.ToString(), rememberMe);
                return RedirectToAction("Index", "Admin");
            }

            // Check Owner
            var owner = await _context.Owners.FirstOrDefaultAsync(o => o.UserName == model.UserName);
            if (owner != null && VerifyPassword(model.Password, owner.Password))
            {
                await SignInUser(owner.UserName, "Owner", owner.IdOwnerUser.ToString(), rememberMe);
                
                if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                    return Redirect(returnUrl);
                    
                return RedirectToAction("Index", "Home");
            }

            // Check Veterinarian
            var vet = await _context.Veterinarians.FirstOrDefaultAsync(v => v.UserName == model.UserName);
            if (vet != null && VerifyPassword(model.Password, vet.Password) && vet.Authentication == 1)
            {
                await SignInUser(vet.UserName, "Veterinarian", vet.IdVetUser.ToString(), rememberMe);
                
                if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                    return Redirect(returnUrl);
                    
                return RedirectToAction("Index", "Home");
            }

            ModelState.AddModelError("", "Invalid login credentials or account not verified.");
            return View(model);
        }

        private async Task SignInUser(string username, string role, string userId, bool rememberMe = false)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role),
                new Claim("UserId", userId)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = rememberMe,
                ExpiresUtc = rememberMe ? DateTimeOffset.UtcNow.AddDays(30) : DateTimeOffset.UtcNow.AddMinutes(30)
            };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, authProperties);
        }

        // GET: /Auth/Register
        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        // POST: /Auth/Register
        [HttpPost]
        public async Task<IActionResult> Register(RegisterOwnerDto model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Check if username already exists
            if (await _context.Owners.AnyAsync(o => o.UserName == model.UserName) ||
                await _context.Veterinarians.AnyAsync(v => v.UserName == model.UserName))
            {
                ModelState.AddModelError("UserName", "Username already exists.");
                return View(model);
            }

            // Check if email already exists
            if (await _context.Owners.AnyAsync(o => o.Email == model.Email) ||
                await _context.Veterinarians.AnyAsync(v => v.Email == model.Email))
            {
                ModelState.AddModelError("Email", "Email already exists.");
                return View(model);
            }

            // Create new owner with hashed password
            var owner = new Owner
            {
                UserName = model.UserName,
                Email = model.Email,
                PhoneNum = model.PhoneNum,
                Password = HashPassword(model.Password),
                FullName = model.FullName,
                Dob = model.Dob,
                Gender = model.Gender,
                Img = model.Img ?? "/images/default-user.png",
                CreatedAt = DateTime.UtcNow
            };

            _context.Owners.Add(owner);
            await _context.SaveChangesAsync();

            // Auto login after registration
            await SignInUser(owner.UserName, "Owner", owner.IdOwnerUser.ToString());

            return RedirectToAction("Index", "Home");
        }

        // POST: /Auth/RegisterVet
        [HttpPost]
        public async Task<IActionResult> RegisterVet(RegisterVetDto model)
        {
            if (!ModelState.IsValid)
            {
                return View("Register", model);
            }

            // Check if username already exists
            if (await _context.Owners.AnyAsync(o => o.UserName == model.UserName) ||
                await _context.Veterinarians.AnyAsync(v => v.UserName == model.UserName))
            {
                ModelState.AddModelError("UserName", "Username already exists.");
                return View("Register", model);
            }

            // Check if email already exists
            if (await _context.Owners.AnyAsync(o => o.Email == model.Email) ||
                await _context.Veterinarians.AnyAsync(v => v.Email == model.Email))
            {
                ModelState.AddModelError("Email", "Email already exists.");
                return View("Register", model);
            }

            // Create new veterinarian with hashed password
            var vet = new Veterinarian
            {
                UserName = model.UserName,
                Email = model.Email,
                PhoneNum = model.PhoneNum,
                Password = HashPassword(model.Password),
                FullName = model.FullName,
                Dob = model.Dob,
                Gender = model.Gender,
                Img = model.Img ?? "/images/default-user.png",
                NameOfConsultingRoom = model.NameOfConsultingRoom,
                ClinicAddress = model.ClinicAddress,
                Qualification = model.Qualification,
                Experience = model.Experience,
                Authentication = 0, // Pending verification
                CreatedAt = DateTime.UtcNow
            };

            _context.Veterinarians.Add(vet);
            await _context.SaveChangesAsync();

            // Redirect to a waiting for verification page
            return RedirectToAction("VerificationPending");
        }

        // GET: /Auth/VerificationPending
        public IActionResult VerificationPending()
        {
            return View();
        }

        // GET: /Auth/ForgotPassword
        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        // POST: /Auth/ForgotPassword
        [HttpPost]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                ModelState.AddModelError("", "Email is required.");
                return View();
            }

            var owner = await _context.Owners.FirstOrDefaultAsync(o => o.Email == email);
            var vet = await _context.Veterinarians.FirstOrDefaultAsync(v => v.Email == email);

            if (owner == null && vet == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToAction("ForgotPasswordConfirmation");
            }

            // Generate password reset token
            var token = GeneratePasswordResetToken();
            var expiryTime = DateTime.UtcNow.AddHours(24);

            // Store token in database or cache
            // For demo purposes, we'll just show the token
            TempData["ResetToken"] = token;
            TempData["ResetEmail"] = email;

            // In a real application, send email with reset link
            // SendPasswordResetEmail(email, token);

            return RedirectToAction("ForgotPasswordConfirmation");
        }

        // GET: /Auth/ForgotPasswordConfirmation
        public IActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        // GET: /Auth/ResetPassword
        [HttpGet]
        public IActionResult ResetPassword(string token, string email)
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
            {
                return RedirectToAction("Login");
            }

            var model = new ResetPasswordViewModel { Token = token, Email = email };
            return View(model);
        }

        // POST: /Auth/ResetPassword
        [HttpPost]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Validate token (in a real app, check against stored token)
            if (TempData["ResetToken"]?.ToString() != model.Token || 
                TempData["ResetEmail"]?.ToString() != model.Email)
            {
                ModelState.AddModelError("", "Invalid token.");
                return View(model);
            }

            // Find user by email
            var owner = await _context.Owners.FirstOrDefaultAsync(o => o.Email == model.Email);
            if (owner != null)
            {
                owner.Password = HashPassword(model.Password);
                await _context.SaveChangesAsync();
                return RedirectToAction("ResetPasswordConfirmation");
            }

            var vet = await _context.Veterinarians.FirstOrDefaultAsync(v => v.Email == model.Email);
            if (vet != null)
            {
                vet.Password = HashPassword(model.Password);
                await _context.SaveChangesAsync();
                return RedirectToAction("ResetPasswordConfirmation");
            }

            ModelState.AddModelError("", "User not found.");
            return View(model);
        }

        // GET: /Auth/ResetPasswordConfirmation
        public IActionResult ResetPasswordConfirmation()
        {
            return View();
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

        // API endpoint for JWT token generation
        [HttpPost("api/auth/token")]
        public async Task<IActionResult> GetToken([FromBody] UserLoginForm model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check Owner
            var owner = await _context.Owners.FirstOrDefaultAsync(o => o.UserName == model.UserName);
            if (owner != null && VerifyPassword(model.Password, owner.Password))
            {
                var token = GenerateJwtToken(owner.UserName, "Owner", owner.IdOwnerUser.ToString());
                return Ok(new { token });
            }

            // Check Veterinarian
            var vet = await _context.Veterinarians.FirstOrDefaultAsync(v => v.UserName == model.UserName);
            if (vet != null && VerifyPassword(model.Password, vet.Password) && vet.Authentication == 1)
            {
                var token = GenerateJwtToken(vet.UserName, "Veterinarian", vet.IdVetUser.ToString());
                return Ok(new { token });
            }

            return Unauthorized();
        }

        #region Helper Methods

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private bool VerifyPassword(string inputPassword, string storedPassword)
        {
            // If the stored password is not hashed yet (for existing accounts)
            if (!IsBase64String(storedPassword))
            {
                return inputPassword == storedPassword;
            }

            // For hashed passwords
            var hashedInput = HashPassword(inputPassword);
            return hashedInput == storedPassword;
        }

        private bool IsBase64String(string base64)
        {
            if (string.IsNullOrEmpty(base64))
                return false;

            try
            {
                Convert.FromBase64String(base64);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private string GeneratePasswordResetToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        private string GenerateJwtToken(string username, string role, string userId)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role),
                new Claim("UserId", userId)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        #endregion
    }

    public class ResetPasswordViewModel
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
