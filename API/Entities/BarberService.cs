namespace API.Entities
{
    public class BarberService
    {
        public int Id { get; set; }
        public int BarberId { get; set; }
        public Barber Barber { get; set; }
        public int ServiceId { get; set; }
        public Service Service { get; set; }
        public double Price { get; set; }
    }
}