using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TuyetDang.MyVetTracer.Entity
{
    [Table("Pet")]
    public class Pet : AuditEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdPet { get; set; }

        public string Img { get; set; }

        public string PetType { get; set; }

        public string PetName { get; set; }

        public int Age { get; set; }

        public string Sex { get; set; }

        public string Weight { get; set; }

        public string Height { get; set; }

        public string Identification { get; set; }

        [ForeignKey("OwnerUser")]
        public int? IdOwnerUser { get; set; }

        [JsonIgnore]
        public virtual Owner OwnerUser { get; set; }

        [ForeignKey("VetUser")]
        public int? IdVetUser { get; set; }

        [JsonIgnore]
        public virtual Veterinarian VetUser { get; set; }

        [JsonIgnore]
        public virtual ICollection<Vaccine> Vacs { get; set; } = new List<Vaccine>();

        [JsonIgnore]
        public virtual ICollection<Medicine> Meds { get; set; } = new List<Medicine>();

        [JsonIgnore]
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
