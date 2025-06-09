using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace TuyetDang.MyVetTracer.ViewModels
{
    public class VeterinarianFormModel
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string PhoneNum { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        public string FullName { get; set; }

        [DataType(DataType.Date)]
        public DateTime? Dob { get; set; }

        public string Gender { get; set; }

        public string NameOfConsultingRoom { get; set; }

        public string ClinicAddress { get; set; }

        public string Qualification { get; set; }

        public string Experience { get; set; }

        public int Authentication { get; set; }

        public IFormFile ImgFile { get; set; }
    }
}
