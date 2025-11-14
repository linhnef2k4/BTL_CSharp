namespace Freelancer.DTOs
{

    public class UserProfileDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string Role { get; set; }
        public DateTime? DateOfBirth { get; set; }

        // Thông tin hồ sơ đính kèm (có thể null)
        public SeekerProfileDto Seeker { get; set; }
        public EmployerProfileDto Employer { get; set; }
    }
}