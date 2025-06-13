using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace TuyetDang.MyVetTracer.ViewModels
{
    public class OwnerFormModel
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string PhoneNum { get; set; }

  
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        public string FullName { get; set; }

        [DataType(DataType.Date)]
        public DateTime? Dob { get; set; }

        public string Gender { get; set; }

        // Upload ảnh
        public IFormFile ImgFile { get; set; }

        // Thêm quyền người dùng (Role)
        public string Role { get; set; }
    }
}
