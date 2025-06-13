using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace veterinarian_tracker_system.ViewModels
{
    public class AppointmentRequestViewModel
    {
        public int PetId { get; set; }
        public string PetName { get; set; }
        
        [Required(ErrorMessage = "Please select a veterinarian")]
        public int VeterinarianId { get; set; }
        
        [Required(ErrorMessage = "Please select an appointment date")]
        [DataType(DataType.Date)]
        public DateTime AppointmentDate { get; set; }
        
        [Required(ErrorMessage = "Please select an appointment time")]
        [DataType(DataType.Time)]
        public TimeSpan AppointmentTime { get; set; }
        
        [Required(ErrorMessage = "Please provide a reason for the appointment")]
        public string Reason { get; set; }
        
        public IEnumerable<dynamic> AvailableVeterinarians { get; set; }
    }
}