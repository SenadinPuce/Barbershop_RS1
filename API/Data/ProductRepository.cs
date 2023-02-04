using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        
        public ProductRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<ProductBrand>> GetProductBrandsAsync()
        {
            return await _context.ProductBrands.ToListAsync();
        }

        public async Task<ProductToReturnDto> GetProductByIdAsync(int id)
        {
            return _mapper.Map<ProductToReturnDto>(await _context.Products
                .Include(p => p.ProductType)
                .Include(p => p.ProductBrand)
                .FirstOrDefaultAsync(p => p.Id == id));
        }

        public async Task<PagedList<Product>> GetProductsAsync(ProductParams productParams)
        {
            var query = _context.Products.AsQueryable();
            query = query.Include(p => p.ProductBrand).Include(p => p.ProductType).OrderBy(p => p.Name);
            
            if(!string.IsNullOrEmpty(productParams.Search))
                query = query.Where(x => x.Name.ToLower().Contains(productParams.Search));

            if(productParams.BrandId.HasValue)
                query = query.Where(x => x.ProductBrandId == productParams.BrandId);

              if(productParams.TypeId.HasValue)
                query = query.Where(x => x.ProductTypeId == productParams.TypeId);  

             if(!string.IsNullOrEmpty(productParams.SortBy))
            {
                switch (productParams.SortBy) {
                    case "priceAsc": 
                        query = query.OrderBy(p => p.Price);
                        break;
                    case "priceDesc":
                         query = query.OrderByDescending(p => p.Price);
                        break; 
                    default: 
                       query = query.OrderBy(p => p.Name);
                        break;
                }
            }

            return await PagedList<Product>.CreateAsync(
              query,
                productParams.PageNumber, productParams.PageSize);
        }

        public async Task<IReadOnlyList<ProductType>> GetProductTypesAsync()
        {
            return await _context.ProductTypes.ToListAsync();
        }
    }
}