namespace API.DTOs
{
    public class BarberServiceDto
    {
        public int Id { get; set; }
        public int BarberId { get; set; }
        public int ServiceId { get; set; }
        public ServiceDto Service { get; set; }
        public double Price { get; set; }
    }
}