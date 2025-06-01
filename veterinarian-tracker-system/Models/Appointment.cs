using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
public class Appointment : AuditEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int IdAppointment { get; set; }

    public string Time { get; set; }

    public string OwnerName { get; set; }

    public string Veterinarian { get; set; }

    public int IsConfirmed { get; set; }

    [ForeignKey("Pet")]
    public int? IdPet { get; set; }

    [JsonIgnore]
    public virtual Pet Pet { get; set; }

    [ForeignKey("VetUser")]
    public int? IdUser { get; set; }

    [JsonIgnore]
    public virtual VetUser VetUser { get; set; }
}
