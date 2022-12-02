namespace API.Entities
{
    public class Service
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Duration { get; set; }
        public string Description { get; set; }
        public double DefaultPrice { get; set; }
        public ICollection<BarberService> BarberServices { get; set; }
    }
}