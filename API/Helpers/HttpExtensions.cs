using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

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