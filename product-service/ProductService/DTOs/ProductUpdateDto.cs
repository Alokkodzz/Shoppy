using Microsoft.AspNetCore.Http;

namespace ProductService.DTOs
{
    public class ProductUpdateDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public int? Stock { get; set; }
        public IFormFile? ImageFile { get; set; }
    }
}