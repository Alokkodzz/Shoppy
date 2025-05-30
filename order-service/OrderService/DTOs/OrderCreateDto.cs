namespace OrderService.DTOs
{
    public class OrderCreateDto
    {
        public string UserId { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }
}