using OrderService.Entities;

namespace OrderService.DTOs
{
    public class OrderUpdateDto
    {
        public OrderStatus Status { get; set; }
    }
}