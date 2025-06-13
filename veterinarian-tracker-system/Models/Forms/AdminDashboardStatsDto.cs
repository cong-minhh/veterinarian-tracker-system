using System;
using System.Collections.Generic;

public class AdminDashboardStatsDto
{
    public int TotalVeterinarians { get; set; }
    public int TotalOwners { get; set; }
    public int TotalPets { get; set; }
    public int ActiveAppointments { get; set; }
    
    // Trend percentages (compared to previous month/day)
    public double VeterinarianTrend { get; set; }
    public double OwnerTrend { get; set; }
    public double PetTrend { get; set; }
    public double AppointmentTrend { get; set; }
    
    // Last updated timestamp
    public DateTime LastUpdated { get; set; }
    
    // Additional statistics for enhanced dashboard
    public int CompletedAppointments { get; set; }
    public int CancelledAppointments { get; set; }
    public double AppointmentCompletionRate { get; set; } // Percentage of completed vs total
    public Dictionary<string, int> PetTypeDistribution { get; set; } // For pie chart
    public Dictionary<string, int> AppointmentsByDay { get; set; } // For weekly appointment distribution
    public int NewUsersToday { get; set; } // New users registered today
    public int NewPetsToday { get; set; } // New pets registered today
}
