using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TuyetDang.MyVetTracer.Entity;
namespace TuyetDang.MyVetTracer.Entity
{
    [Table("Appointment")]
    public class Appointment : AuditEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdAppointment { get; set; }

        public string Time { get; set; }

        public int IsConfirmed { get; set; }

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