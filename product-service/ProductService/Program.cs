using Microsoft.EntityFrameworkCore;
using ProductService.Data;
using ProductService.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.ConfigureCors();
builder.Services.ConfigureIISIntegration();
builder.Services.ConfigureLoggerService();
builder.Services.ConfigureRepositoryManager(); // Updated to use repository
builder.Services.ConfigureAWS(builder.Configuration);
builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddDbContext<ProductDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("ProductDb")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");

app.UseAuthorization();
app.MapControllers();

// Migrate database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ProductDbContext>();
    db.Database.Migrate();
}

app.Run();