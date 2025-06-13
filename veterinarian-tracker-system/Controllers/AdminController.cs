using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TuyetDang.MyVetTracer.Data;

namespace veterinarian_tracker_system.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly MyVetTracerDbContext _context;

        public AdminController(MyVetTracerDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserRegistrationStats()
        {
            var startDate = DateTime.Today.AddMonths(-5);
            var startMonth = new DateTime(startDate.Year, startDate.Month, 1);

            var ownerStats = await _context.Owners
                .Where(o => o.CreatedAt >= startMonth)
                .GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .ToListAsync();

            var vetStats = await _context.Veterinarians
                .Where(v => v.CreatedAt >= startMonth)
                .GroupBy(v => new { v.CreatedAt.Year, v.CreatedAt.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .ToListAsync();

            var months = Enumerable.Range(0, 6)
                .Select(i => startMonth.AddMonths(i))
                .ToList();

            var result = months.Select(m =>
            {
                string monthStr = m.ToString("yyyy-MM");
                int ownerCount = ownerStats
                    .Where(x => x.Year == m.Year && x.Month == m.Month)
                    .Sum(x => x.Count);

                int vetCount = vetStats
                    .Where(x => x.Year == m.Year && x.Month == m.Month)
                    .Sum(x => x.Count);

                return new UserRegistrationStatsDto
                {
                    Month = monthStr,
                    OwnerCount = ownerCount,
                    VeterinarianCount = vetCount
                };
            }).ToList();

            return Json(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetPetRegistrationStats()
        {
            var startDate = DateTime.Today.AddMonths(-5);
            var startMonth = new DateTime(startDate.Year, startDate.Month, 1);

            var petStats = await _context.Pets
                .Where(p => p.CreatedAt >= startMonth)
                .GroupBy(p => new { p.CreatedAt.Year, p.CreatedAt.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .ToListAsync();

            var months = Enumerable.Range(0, 6)
                .Select(i => startMonth.AddMonths(i))
                .ToList();

            var result = months.Select(m =>
            {
                string monthStr = m.ToString("yyyy-MM");
                int petCount = petStats
                    .Where(x => x.Year == m.Year && x.Month == m.Month)
                    .Sum(x => x.Count);

                return new
                {
                    Month = monthStr,
                    PetCount = petCount
                };
            }).ToList();

            return Json(result);
        }

        public async Task<IActionResult> Index()
        {
            var totalVeterinarians = await _context.Veterinarians.CountAsync();
            var totalOwners = await _context.Owners.CountAsync();
            var totalPets = await _context.Pets.CountAsync();
            var activeAppointments = await _context.Appointments
                .CountAsync(a => a.IsConfirmed == 1); 

            var stats = new AdminDashboardStatsDto
            {
                TotalVeterinarians = totalVeterinarians,
                TotalOwners = totalOwners,
                TotalPets = totalPets,
                ActiveAppointments = activeAppointments
            };

            return View(stats);
        }
    }
}
