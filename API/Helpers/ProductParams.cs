namespace API.Helpers
{


    public class ProductParams : BaseParams
    {
        public int? BrandId {get; set; }
        public int? TypeId {get; set; }

        private string _search;

        public new string Search 
        {
            get => _search;
            set => _search = value.ToLower();    
        }
    }
}