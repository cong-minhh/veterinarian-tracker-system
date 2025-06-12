using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using TuyetDang.MyVetTracer.Data;

var builder = WebApplication.CreateBuilder(args);

// -----------------------------
// Configure Services
// -----------------------------

// Add DbContext
builder.Services.AddDbContext<MyVetTracerDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add MVC + Razor
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

// Add Cookie Authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Auth/Login";               // Redirect to Login when not authenticated
        options.AccessDeniedPath = "/Auth/AccessDenied"; // Redirect to AccessDenied when forbidden
        options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
        options.SlidingExpiration = true;
    });

// Add Authorization
builder.Services.AddAuthorization();

var app = builder.Build();

// -----------------------------
// Configure Middleware
// -----------------------------

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Routes
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Admin}/{action=Index}/{id?}");

    endpoints.MapRazorPages();
});

app.Run();
