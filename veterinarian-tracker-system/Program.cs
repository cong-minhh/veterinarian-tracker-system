using Microsoft.EntityFrameworkCore;
using TuyetDang.MyVetTracer.Data;
using veterinarian_tracker_system;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Add DbContext with SQL Server connection string from appsettings.json
builder.Services.AddDbContext<MyVetTracerDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapHub<DashboardHub>("/dashboardHub");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Admin}/{action=Index}/{id?}");

app.Run();
