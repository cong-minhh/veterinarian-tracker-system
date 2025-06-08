using Microsoft.EntityFrameworkCore;
using TuyetDang.MyVetTracer.Entity;

namespace TuyetDang.MyVetTracer.Data
{
    public class MyVetTracerDbContext : DbContext
    {

        public DbSet<Owner> Owners { get; set; }
        public DbSet<Veterinarian> Veterinarians { get; set; }
        public DbSet<Pet> Pets { get; set; }
        public DbSet<Vaccine> Vaccines { get; set; }
        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

        public MyVetTracerDbContext(DbContextOptions<MyVetTracerDbContext> options)
     : base(options)
        {
        }
    }
}
