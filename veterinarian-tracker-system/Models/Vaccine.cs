using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TuyetDang.MyVetTracer.Entity
{
    [Table("Vaccine")]
    public class Vaccine
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int IdVac { get; set; }

		public string VacName { get; set; }

		public DateTime? Date { get; set; }  // Consider changing to DateTime if it's a real date

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
	}
}
