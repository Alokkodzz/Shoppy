using AutoMapper;
using ProductService.DTOs;
using ProductService.Models;

namespace ProductService.Profiles
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            // Source → Destination
            CreateMap<ProductCreateDto, Product>()
                .ForMember(dest => dest.ImageUrl, opt => opt.Ignore()) // Handle separately
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()));

            // Add reverse mapping if needed
            CreateMap<Product, ProductReadDto>(); // If you have a read DTO
        }
    }
}