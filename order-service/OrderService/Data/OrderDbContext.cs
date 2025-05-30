using Microsoft.EntityFrameworkCore;
using OrderService.Entities;

namespace OrderService.Data
{
    public class OrderDbContext : DbContext
    {
        public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options)
        {
        }

        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(o => o.Id);
                entity.Property(o => o.UserId).IsRequired();
                entity.Property(o => o.Status).IsRequired().HasConversion<string>();
                entity.Property(o => o.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                entity.HasMany(o => o.OrderItems)
                    .WithOne()
                    .HasForeignKey(oi => oi.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(oi => oi.Id);
                entity.Property(oi => oi.ProductId).IsRequired();
                entity.Property(oi => oi.Quantity).IsRequired();
                entity.Property(oi => oi.UnitPrice).HasColumnType("decimal(18,2)").IsRequired();
            });
        }
    }
}