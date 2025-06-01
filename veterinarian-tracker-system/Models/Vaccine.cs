using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TuyetDang.MyVetTracer.Entity
{
	public class Vaccine
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int IdVac { get; set; }

		public string VacName { get; set; }

		public string Date { get; set; }  // Consider changing to DateTime if it's a real date

		public string Dose { get; set; }

		public double Total { get; set; }

		[ForeignKey("Pet")]
		public int? IdPet { get; set; }

		[JsonIgnore]
		public virtual Pet Pet { get; set; }

		[ForeignKey("VetUser")]
		public int? IdUser { get; set; }

		[JsonIgnore]
		public virtual VetUser VetUser { get; set; }
	}
}
