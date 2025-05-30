using Microsoft.AspNetCore.Mvc;
using ProductService.Data;
using ProductService.DTOs;
using ProductService.Entities;
using ProductService.Services;
using AutoMapper;

namespace ProductService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _repository;
        private readonly IImageService _imageService;
        private readonly IMapper _mapper;

        public ProductsController(
            IProductRepository repository, 
            IImageService imageService,
            IMapper mapper)
        {
            _repository = repository;
            _imageService = imageService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10)
        {
            var products = await _repository.GetAllAsync(page, pageSize);
            return Ok(_mapper.Map<IEnumerable<ProductDto>>(products));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(Guid id)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(_mapper.Map<ProductDto>(product));
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct([FromForm] ProductCreateDto productDto)
        {
            var product = _mapper.Map<Product>(productDto);
            
            if (productDto.ImageFile != null)
            {
                product.ImageUrl = await _imageService.UploadImageAsync(productDto.ImageFile);
            }

            await _repository.AddAsync(product);
            return CreatedAtAction(
                nameof(GetProduct), 
                new { id = product.Id }, 
                _mapper.Map<ProductDto>(product));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromForm] ProductUpdateDto productDto)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null) return NotFound();

            _mapper.Map(productDto, product);

            if (productDto.ImageFile != null)
            {
                if (!string.IsNullOrEmpty(product.ImageUrl))
                {
                    await _imageService.DeleteImageAsync(product.ImageUrl);
                }
                product.ImageUrl = await _imageService.UploadImageAsync(productDto.ImageFile);
            }

            await _repository.UpdateAsync(product);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null) return NotFound();

            if (!string.IsNullOrEmpty(product.ImageUrl))
            {
                await _imageService.DeleteImageAsync(product.ImageUrl);
            }

            await _repository.DeleteAsync(product);
            return NoContent();
        }
    }
}