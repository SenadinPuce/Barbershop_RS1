namespace API.Entities
{
    public class CustomHours
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public bool IsOpen { get; set; }
    }
}