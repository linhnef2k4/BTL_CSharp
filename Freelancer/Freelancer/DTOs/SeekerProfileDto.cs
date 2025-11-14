namespace Freelancer.DTOs
{
    public class SeekerProfileDto
    {
        public string Headline { get; set; }
        public bool IsVip { get; set; }
        public string Rank { get; set; }
        public string ResumeUrl { get; set; }
        public int YearsOfExperience { get; set; }

        public string? Location { get; set; }
       
        public string? Level{ get; set; }
        public string? Skills{get; set; }

        }
}