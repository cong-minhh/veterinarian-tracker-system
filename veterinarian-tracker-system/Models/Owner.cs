using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TuyetDang.MyVetTracer.Entity
{
    public class Owner : AuditEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdOwnerUser { get; set; }

        public string Img { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string PhoneNum { get; set; }

        public string Password { get; set; }

        public string FullName { get; set; }

        public string Dob { get; set; }  // Consider using DateTime if DOB is stored as date

        public string Gender { get; set; }

        public int NumOfPet { get; set; }

        [JsonIgnore]
        public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();
    }
}
