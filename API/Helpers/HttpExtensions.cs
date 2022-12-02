using System.Text.Json;

namespace API.Helpers
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int totalItems, int currentPage, int pageSize, int totalPages)
        {
            var paginationHeader = new PaginationHeader(totalItems, currentPage, pageSize, totalPages);
            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader, jsonOptions));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}