namespace veterinarian_tracker_system.Models.Forms
{
    public class RegisterVetDto: RegisterOwnerDto
    {
        public string NameOfConsultingRoom { get; set; }
        public string ClinicAddress { get; set; }
        public string Qualification { get; set; }
        public string Experience { get; set; }
    }
}
