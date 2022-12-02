namespace API.DTOs
{
    public class AppointmentTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public int Duration { get; set; }
        public ServiceDto[] Services { get; set; }
    }
}