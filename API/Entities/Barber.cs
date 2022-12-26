namespace API.Entities
{
    public class Barber : AppUser
    {
        public int AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public string Info { get; set; }
        public ICollection<BarberService> BarberServices { get; set; }
    }
}