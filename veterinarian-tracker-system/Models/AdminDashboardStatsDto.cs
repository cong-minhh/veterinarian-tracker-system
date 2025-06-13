using System;
using System.Collections.Generic;

namespace veterinarian_tracker_system.Models
{
    public class AdminDashboardStatsDto
    {
        // Main statistics
        public int TotalVeterinarians { get; set; }
        public int TotalOwners { get; set; }
        public int TotalPets { get; set; }
        public int ActiveAppointments { get; set; }
        
        // Trend percentages
        public int VeterinarianTrend { get; set; }
        public int OwnerTrend { get; set; }
        public int PetTrend { get; set; }
        public int AppointmentTrend { get; set; }
        
        // Mini stats
        public int NewUsersToday { get; set; }
        public int NewPetsToday { get; set; }
        public int CompletedAppointments { get; set; }
        public int CancelledAppointments { get; set; }
        
        // Chart data
        public Dictionary<string, int> PetTypeDistribution { get; set; }
        public Dictionary<string, int> AppointmentsByDay { get; set; }
        
        // Timestamp
        public DateTime LastUpdated { get; set; }
        
        public AdminDashboardStatsDto()
        {
            PetTypeDistribution = new Dictionary<string, int>();
            AppointmentsByDay = new Dictionary<string, int>();
            LastUpdated = DateTime.Now;
        }
    }
}