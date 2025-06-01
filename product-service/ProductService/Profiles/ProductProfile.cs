// In Profiles/ProductProfile.cs
using AutoMapper;
using ProductService.Entities;
using ProductService.DTOs;

namespace ProductService.Profiles
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            // Individual mappings
            CreateMap<Product, ProductDto>();
            CreateMap<ProductCreateDto, Product>()
                .ForMember(dest => dest.ImageUrl, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()));

        }
    }
}