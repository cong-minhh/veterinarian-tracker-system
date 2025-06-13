using System.ComponentModel.DataAnnotations;

namespace veterinarian_tracker_system.Models.Forms
{
    public class RegisterVetDto: RegisterOwnerDto
    {
        [Required(ErrorMessage = "Tên phòng khám là bắt buộc")]
        [Display(Name = "Tên phòng khám")]
        public string NameOfConsultingRoom { get; set; }

        [Required(ErrorMessage = "Địa chỉ phòng khám là bắt buộc")]
        [Display(Name = "Địa chỉ phòng khám")]
        public string ClinicAddress { get; set; }

        [Required(ErrorMessage = "Bằng cấp là bắt buộc")]
        [Display(Name = "Bằng cấp")]
        public string Qualification { get; set; }

        [Required(ErrorMessage = "Kinh nghiệm là bắt buộc")]
        [Display(Name = "Kinh nghiệm")]
        public string Experience { get; set; }
    }
}
