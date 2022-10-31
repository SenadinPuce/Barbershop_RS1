using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class PaginationHeader
    {
        public PaginationHeader(int totalItems, int currentPage, int pageSize, int totalPages)
        {
            TotalItems = totalItems;
            TotalPages = totalPages;
            ItemsPerPage = pageSize;
            CurrentPage = currentPage;
        }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public int ItemsPerPage { get; set; }
        public int CurrentPage { get; set; }
    }
}