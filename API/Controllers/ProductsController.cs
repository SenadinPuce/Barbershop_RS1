using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        public ProductsController(IUnitOfWork uow, IMapper mapper)
        {
            _mapper = mapper;
            _uow = uow;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<ProductToReturnDto>>> GetProducts(
        [FromQuery]ProductParams productParams)
        {
            var products = await _uow.ProductRepository.GetProductsAsync(productParams);



            PagedList<ProductToReturnDto> productsToReturnDto = new PagedList<ProductToReturnDto>(
                _mapper.Map<IEnumerable<ProductToReturnDto>>(products.GetRange(0, products.Count)),
                products.TotalCount, products.CurrentPage, products.PageSize); 

            Response.AddPaginationHeader(new PaginationHeader(productsToReturnDto.TotalCount, productsToReturnDto.CurrentPage, productsToReturnDto.PageSize, productsToReturnDto.TotalPages));
           
            return Ok(productsToReturnDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
           return await _uow.ProductRepository.GetProductByIdAsync(id);
        }


        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
           return Ok(await _uow.ProductRepository.GetProductBrandsAsync());
        }
        

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductType()
        {
           return Ok(await _uow.ProductRepository.GetProductTypesAsync());
        }      
    
    }
}