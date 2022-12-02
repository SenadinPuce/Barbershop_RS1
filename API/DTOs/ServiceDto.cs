namespace API.DTOs
{
    public class ServiceDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Duration { get; set; }
        public string Description { get; set; }
        public double DefaultPrice { get; set; }
    }
}