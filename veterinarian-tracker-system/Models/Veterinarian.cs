using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TuyetDang.MyVetTracer.Entity
{
    [Table("Veterinarian")]
    public class Veterinarian
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdVetUser { get; set; }

        public string Img { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string PhoneNum { get; set; }

        public string Password { get; set; }

        public string FullName { get; set; }

        public DateTime? Dob { get; set; } 

        public string Gender { get; set; }

        public string NameOfConsultingRoom { get; set; }

        public string ClinicAddress { get; set; }

        public string Qualification { get; set; }

        public string Experience { get; set; }

        public int Authentication { get; set; }


        [JsonIgnore]
        public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();

        [JsonIgnore]
        public virtual ICollection<Vaccine> Vacs { get; set; } = new List<Vaccine>();

        [JsonIgnore]
        public virtual ICollection<Medicine> Meds { get; set; } = new List<Medicine>();

        [JsonIgnore]
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
