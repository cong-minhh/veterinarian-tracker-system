using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TuyetDang.MyVetTracer.Data;

namespace veterinarian_tracker_system.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly MyVetTracerDbContext _context;

        public HomeController(ILogger<HomeController> logger, MyVetTracerDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        // GET:
        public async Task<IActionResult> Index()
        {
            var vets = await _context.Veterinarians.ToListAsync();
            return View(vets);
        }


    }
}
