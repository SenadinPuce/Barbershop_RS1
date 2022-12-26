namespace API.Entities
{
    public class Barber
    {
        public int AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public string Info { get; set; }
        public ICollection<BarberService> BarberServices { get; set; }
    }
}