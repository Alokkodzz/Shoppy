using Microsoft.AspNetCore.Mvc;
using OrderService.Data;
using OrderService.DTOs;
using OrderService.Entities;

namespace OrderService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _repository;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(IOrderRepository repository, ILogger<OrdersController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders([FromQuery] string userId)
        {
            try
            {
                var orders = await _repository.GetAllAsync(userId);
                return Ok(orders.Select(MapToDto));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting orders");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(Guid id)
        {
            try
            {
                var order = await _repository.GetByIdAsync(id);
                if (order == null) return NotFound();
                return Ok(MapToDto(order));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting order with id: {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] OrderCreateDto orderDto)
        {
            try
            {
                var order = new Order
                {
                    UserId = orderDto.UserId,
                    Status = OrderStatus.Pending,
                    OrderItems = orderDto.Items.Select(i => new OrderItem
                    {
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice
                    }).ToList()
                };

                await _repository.AddAsync(order);
                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, MapToDto(order));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] OrderUpdateDto statusDto)
        {
            try
            {
                var order = await _repository.GetByIdAsync(id);
                if (order == null) return NotFound();

                order.Status = statusDto.Status;
                await _repository.UpdateAsync(order);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating order status for order id: {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        private static OrderDto MapToDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                Status = order.Status.ToString(),
                CreatedAt = order.CreatedAt,
                TotalAmount = order.OrderItems.Sum(oi => oi.Quantity * oi.UnitPrice),
                Items = order.OrderItems.Select(oi => new OrderItemDto
                {
                    ProductId = oi.ProductId,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            };
        }
    }
}