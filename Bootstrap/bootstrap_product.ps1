Start-Transcript -Path "C:\\bootstrap-productservice.log"

$LocalArtifactPath = "C:\temp\productservice.zip"
$ExtractPath = "C:\inetpub\productservice"
$webconfigPath = "C:\inetpub\productservice\"
$SiteName = "productservice"
$Port = 5001
$AppPoolName = "productservice"
$AppPoolDotNetVersion = "v4.0" # Change to "No Managed Code" or "v2.0" if needed

Write-Host "Downloading application artifact from S3..."
New-Item -ItemType Directory -Path "C:\temp" -Force | Out-Null

Invoke-WebRequest -Uri "https://alok-production-artifacts.s3.us-east-1.amazonaws.com/productservice/product-service.zip" -OutFile $LocalArtifactPath

New-Item -ItemType Directory -Path "C:\inetpub\productservice" -Force | Out-Null

Expand-Archive -Path $LocalArtifactPath -DestinationPath $ExtractPath -Force

# Step 4: Configure IIS Application Pool
Write-Host "Configuring IIS Application Pool..."

New-WebAppPool -Name $AppPoolName
New-Website -Name $SiteName -Port $Port -PhysicalPath "C:\inetpub\productservice\publish" -ApplicationPool $AppPoolName -Force | Out-Null

Write-Host "Starting the website..."
Start-Website -Name $SiteName