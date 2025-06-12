using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TuyetDang.MyVetTracer.Entity
{
    [Table("Owner")]
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

        public DateTime? Dob { get; set; } 

        public string Gender { get; set; }


        [JsonIgnore]
        public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();
    }
}
