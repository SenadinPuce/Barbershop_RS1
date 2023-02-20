using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces.Repositories
{
    public interface IProductRepository
    { 
        Task<ProductToReturnDto> GetProductByIdAsync(int id);
        Task<PagedList<Product>>  GetProductsAsync(ProductParams productParams);
        Task<IReadOnlyList<ProductBrand>> GetProductBrandsAsync();
        Task<IReadOnlyList<ProductType>> GetProductTypesAsync();
    }
}