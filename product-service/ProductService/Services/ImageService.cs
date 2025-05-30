using Amazon.S3;
using Amazon.S3.Model;

namespace ProductService.Services
{
    public interface IImageService
    {
        Task<string> UploadImageAsync(IFormFile file);
        Task DeleteImageAsync(string imageUrl);
    }

    public class ImageService : IImageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public ImageService(IAmazonS3 s3Client, IConfiguration configuration)
        {
            _s3Client = s3Client;
            _bucketName = configuration["AWS:BucketName"];
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            var key = $"products/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            using var stream = file.OpenReadStream();
            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                InputStream = stream,
                ContentType = file.ContentType
            };

            await _s3Client.PutObjectAsync(request);
            return $"https://{_bucketName}.s3.amazonaws.com/{key}";
        }

        public async Task DeleteImageAsync(string imageUrl)
        {
            var key = imageUrl.Split('/').Last();
            var request = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = key
            };

            await _s3Client.DeleteObjectAsync(request);
        }
    }
}