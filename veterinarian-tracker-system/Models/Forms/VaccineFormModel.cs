using System;
using System.ComponentModel.DataAnnotations;

namespace TuyetDang.MyVetTracer.ViewModels
{
    public class VaccineFormModel
    {
        [Required]
        public string VacName { get; set; }

        public DateTime? Date { get; set; }

        [Required]
        public string Dose { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Total must be >= 0")]
        public double Total { get; set; }

        [Required]
        public int IdPet { get; set; }

        [Required]
        public int IdVeterinarian { get; set; }
    }
}
