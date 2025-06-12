using System.ComponentModel.DataAnnotations;

namespace TuyetDang.MyVetTracer.ViewModels
{
    public class MedicineFormModel
    {
        [Required]
        public string MedName { get; set; }

        [Required]
        public string Amount { get; set; }

        public string Notice { get; set; }

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
