using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.HttpResults;

namespace TuyetDang.MyVetTracer.Entity
{
    [Table("Vaccine")]
    public class Vaccine : AuditEntity
    {
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int IdVac { get; set; }

		public string VacName { get; set; }

		public DateTime? Date { get; set; }

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
        public Vaccine()
        {
        }
        public Vaccine(string vacName, DateTime? date, string dose, double total, int? idPet, int? idVeterinarian)
        {
            VacName = vacName;
            Date = date;
            Dose = dose;
            Total = total;
            IdPet = idPet;
            IdVeterinarian = idVeterinarian;
            CreatedAt = DateTime.Now;

        }
    }
}
