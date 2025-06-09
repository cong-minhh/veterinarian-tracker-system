using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TuyetDang.MyVetTracer.Entity 
{
    [Table("Medicine")]
    public class Medicine: AuditEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdMed { get; set; }

        public string MedName { get; set; }

        public string Amount { get; set; }

        public string Notice { get; set; }

        public string Dose { get; set; }

        public double Total { get; set; }

        [ForeignKey("Pet")]
        public int? IdPet { get; set; }

        [JsonIgnore]
        public virtual Pet Pet { get; set; }

        [ForeignKey("VetUser")]
        public int? IdVeterinarian { get; set; }

        [JsonIgnore]
        public virtual Veterinarian VetUser { get; set; }

        public Medicine()
        {
        }
        public Medicine(string medName, string amount, string notice, string dose, double total, int? idPet, int? idVeterinarian)
        {
            MedName = medName;
            Amount = amount;
            Notice = notice;
            Dose = dose;
            Total = total;
            IdPet = idPet;
            IdVeterinarian = idVeterinarian;
            CreatedAt = DateTime.Now;

        }
    }
}
