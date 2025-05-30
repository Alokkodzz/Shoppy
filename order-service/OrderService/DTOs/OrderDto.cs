namespace OrderService.DTOs
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }
}