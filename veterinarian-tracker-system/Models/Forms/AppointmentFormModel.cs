using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace TuyetDang.MyVetTracer.ViewModels
{
    public class AppointmentFormModel
    {
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime AppointmentTime { get; set; }

        [Required]
        public bool IsConfirmed { get; set; }

        [Required]
        public int IdPet { get; set; }

        [Required]
        public int IdVeterinarian { get; set; }
    }
}
