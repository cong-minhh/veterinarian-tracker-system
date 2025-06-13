using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System.ComponentModel;

namespace TuyetDang.MyVetTracer.ViewModels
{
    public class OwnerFormModel
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        [RegularExpression(@"^[a-zA-Z0-9_-]+$", ErrorMessage = "Username can only contain letters, numbers, underscores and hyphens")]
        [DisplayName("Username")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Email address is required")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address")]
        [DisplayName("Email Address")]
        public string Email { get; set; }

        [Phone(ErrorMessage = "Please enter a valid phone number")]
        [DisplayName("Phone Number")]
        public string PhoneNum { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long")]
        [DisplayName("Password")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Full name is required")]
        [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters")]
        [DisplayName("Full Name")]
        public string FullName { get; set; }

        [DataType(DataType.Date)]
        [DisplayName("Date of Birth")]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? Dob { get; set; }

        [DisplayName("Gender")]
        public string Gender { get; set; }

        [DisplayName("Profile Image")]
        [DataType(DataType.Upload)]
        public IFormFile ImgFile { get; set; }
    }
}
