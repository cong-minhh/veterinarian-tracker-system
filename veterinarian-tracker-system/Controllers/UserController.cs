using Microsoft.AspNetCore.Mvc;

namespace veterinarian_tracker_system.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
