using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace TuyetDang.MyVetTracer.ViewModels
{
    public class PetFormModel
    {
        public IFormFile ImgFile { get; set; }

        [Required]
        public string PetType { get; set; }

        [Required]
        public string PetName { get; set; }

        //[Range(0, 100)]
        public int Age { get; set; }

        public string Sex { get; set; }

        public string Weight { get; set; }

        public string Height { get; set; }

        public string Identification { get; set; }

        [Required]
        public int IdOwnerUser { get; set; } 

        public int? IdVetUser { get; set; }  
    }
}
