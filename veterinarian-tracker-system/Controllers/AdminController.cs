using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuyetDang.MyVetTracer.Data;
using veterinarian_tracker_system.Models.Forms;

namespace veterinarian_tracker_system.Controllers
{
    // [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly MyVetTracerDbContext _context;

        public AdminController(MyVetTracerDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserRegistrationStats(int months = 6)
        {
            var startDate = DateTime.Today.AddMonths(-(months - 1));
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

            var monthRange = Enumerable.Range(0, months)
                .Select(i => startMonth.AddMonths(i))
                .ToList();

            var result = monthRange.Select(m =>
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
        public async Task<IActionResult> GetPetRegistrationStats(int months = 6)
        {
            var startDate = DateTime.Today.AddMonths(-(months - 1));
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

            var monthRange = Enumerable.Range(0, months)
                .Select(i => startMonth.AddMonths(i))
                .ToList();

            var result = monthRange.Select(m =>
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
            // Get current counts
            var totalVeterinarians = await _context.Veterinarians.CountAsync();
            var totalOwners = await _context.Owners.CountAsync();
            var totalPets = await _context.Pets.CountAsync();
            var activeAppointments = await _context.Appointments
                .CountAsync(a => a.IsConfirmed == 1);

            // Calculate trends (comparing current month with previous month)
            var currentMonth = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
            var previousMonth = currentMonth.AddMonths(-1);

            // Veterinarian trend
            var previousMonthVets = await _context.Veterinarians
                .CountAsync(v => v.CreatedAt < currentMonth && v.CreatedAt > previousMonth);
            var currentMonthVets = await _context.Veterinarians
                .CountAsync(v => v.CreatedAt >= currentMonth && v.CreatedAt < currentMonth.AddMonths(1));
            var vetTrend = previousMonthVets > 0
                ? Math.Round((double)currentMonthVets / previousMonthVets * 100 - 100, 1)
                : 0;

            // Owner trend
            var previousMonthOwners = await _context.Owners
                .CountAsync(o => o.CreatedAt < currentMonth && o.CreatedAt > previousMonth);
            var currentMonthOwners = await _context.Owners
                .CountAsync(o => o.CreatedAt >= currentMonth && o.CreatedAt < currentMonth.AddMonths(1));
            var ownerTrend = previousMonthOwners > 0
                ? Math.Round((double)currentMonthOwners / previousMonthOwners * 100 - 100, 1)
                : 0;

            // Pet trend
            var previousMonthPets = await _context.Pets
                .CountAsync(p => p.CreatedAt < currentMonth && p.CreatedAt > previousMonth);
            var currentMonthPets = await _context.Pets
                .CountAsync(p => p.CreatedAt >= currentMonth && p.CreatedAt < currentMonth.AddMonths(1));
            var petTrend = previousMonthPets > 0
                ? Math.Round((double)currentMonthPets / previousMonthPets * 100 - 100, 1)
                : 0;

            // Appointment trend (comparing today with yesterday)
            var yesterday = DateTime.Today.AddDays(-1);
            var yesterdayAppointments = await _context.Appointments
                .CountAsync(a => a.IsConfirmed == 1 && a.CreatedAt.Date == yesterday);
            var todayAppointments = await _context.Appointments
                .CountAsync(a => a.IsConfirmed == 1 && a.CreatedAt.Date == DateTime.Today);
            var appointmentTrend = yesterdayAppointments > 0
                ? Math.Round((double)todayAppointments / yesterdayAppointments * 100 - 100, 1)
                : 0;

            // Additional statistics for enhanced dashboard
            var completedAppointments = await _context.Appointments
                .CountAsync(a => a.IsConfirmed == 2); // Assuming 2 means completed
            var cancelledAppointments = await _context.Appointments
                .CountAsync(a => a.IsConfirmed == 0); // Assuming 0 means cancelled
            var totalAppointments = activeAppointments + completedAppointments + cancelledAppointments;
            var appointmentCompletionRate = totalAppointments > 0
                ? Math.Round((double)completedAppointments / totalAppointments * 100, 1)
                : 0;

            // Pet type distribution for pie chart
            var petTypeDistribution = await _context.Pets
                .GroupBy(p => p.PetType)
                .Select(g => new { PetType = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.PetType, x => x.Count);

            // Appointments by day of week for weekly distribution
            var startOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(7);
            var appointmentsByDay = _context.Appointments
                .Where(a => a.CreatedAt >= startOfWeek && a.CreatedAt < endOfWeek)
                .AsEnumerable() // Switch to client evaluation before using DayOfWeek
                .GroupBy(a => a.CreatedAt.DayOfWeek)
                .Select(g => new { DayOfWeek = g.Key.ToString(), Count = g.Count() })
                .ToDictionary(x => x.DayOfWeek, x => x.Count); // Using synchronous version since we're already in memory

            // Ensure all days of the week are represented
            foreach (var day in Enum.GetNames(typeof(DayOfWeek)))
            {
                if (!appointmentsByDay.ContainsKey(day))
                {
                    appointmentsByDay[day] = 0;
                }
            }

            // New users and pets today
            var newUsersToday = await _context.Owners
                .CountAsync(o => o.CreatedAt.Date == DateTime.Today);
            newUsersToday += await _context.Veterinarians
                .CountAsync(v => v.CreatedAt.Date == DateTime.Today);
            var newPetsToday = await _context.Pets
                .CountAsync(p => p.CreatedAt.Date == DateTime.Today);

            var stats = new AdminDashboardStatsDto
            {
                TotalVeterinarians = totalVeterinarians,
                TotalOwners = totalOwners,
                TotalPets = totalPets,
                ActiveAppointments = activeAppointments,
                VeterinarianTrend = vetTrend,
                OwnerTrend = ownerTrend,
                PetTrend = petTrend,
                AppointmentTrend = appointmentTrend,
                LastUpdated = DateTime.Now,
                // New enhanced dashboard properties
                CompletedAppointments = completedAppointments,
                CancelledAppointments = cancelledAppointments,
                AppointmentCompletionRate = appointmentCompletionRate,
                PetTypeDistribution = petTypeDistribution,
                AppointmentsByDay = appointmentsByDay,
                NewUsersToday = newUsersToday,
                NewPetsToday = newPetsToday
            };

            // Check if this is an AJAX request
            if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
            {
                return Json(stats);
            }

            return View(stats);
        }
    }
}
