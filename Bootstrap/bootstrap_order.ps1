Start-Transcript -Path "C:\\bootstrap-orderservice.log"

$LocalArtifactPath = "C:\temp\orderservice.zip"
$ExtractPath = "C:\inetpub\orderservice"
$webconfigPath = "C:\inetpub\orderservice\"
$SiteName = "orderservice"
$Port = 5002
$AppPoolName = "orderservice"
$AppPoolDotNetVersion = "v4.0" # Change to "No Managed Code" or "v2.0" if needed

Write-Host "Downloading application artifact from S3..."
New-Item -ItemType Directory -Path "C:\temp" -Force | Out-Null

Invoke-WebRequest -Uri "https://alok-production-artifacts.s3.us-east-1.amazonaws.com/orderservice/order-service.zip" -OutFile $LocalArtifactPath

New-Item -ItemType Directory -Path "C:\inetpub\orderservice" -Force | Out-Null

Expand-Archive -Path $LocalArtifactPath -DestinationPath $ExtractPath -Force

# Step 4: Configure IIS Application Pool
Write-Host "Configuring IIS Application Pool..."

New-WebAppPool -Name $AppPoolName
New-Website -Name $SiteName -Port $Port -PhysicalPath "C:\inetpub\orderservice\publish" -ApplicationPool $AppPoolName -Force | Out-Null

Write-Host "Starting the website..."
Start-Website -Name $SiteName