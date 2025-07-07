Start-Transcript -Path "C:\\bootstrap-orderservice.log"

$LocalArtifactPath = "C:\temp\order-service.zip"
$ExtractPath = "C:\inetpub\orderservice"
$webconfigPath = "C:\inetpub\orderservice\"
$SiteName = "orderservice"
$Port = 5002
$AppPoolName = "orderservice"
$AppPoolDotNetVersion = "v4.0" # Change to "No Managed Code" or "v2.0" if needed

Write-Host "Downloading application artifact from S3..."
New-Item -ItemType Directory -Path "C:\temp" -Force | Out-Null

Invoke-WebRequest -Uri "https://shoppy-artifacts.s3.us-east-1.amazonaws.com/order-service.zip" -OutFile $LocalArtifactPath

New-Item -ItemType Directory -Path "C:\inetpub\orderservice" -Force | Out-Null

Expand-Archive -Path $LocalArtifactPath -DestinationPath $ExtractPath -Force

# Step 4: Configure IIS Application Pool
Write-Host "Configuring IIS Application Pool..."

New-WebAppPool -Name $AppPoolName
New-Website -Name $SiteName -Port $Port -PhysicalPath "C:\inetpub\orderservice\publish" -ApplicationPool $AppPoolName -Force | Out-Null

$webConfigPath = "C:\inetpub\orderservice\publish\web.config"
Write-Host "Modifying web.config..."
# Rename existing web.config if it exists
if (Test-Path $webConfigPath) {
    Rename-Item -Path $webConfigPath -NewName "web.config.bak" -Force
}

# Define new web.config content
$newConfigContent = @"
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath="C:\Program Files\dotnet\dotnet.exe" arguments=".\OrderService.dll" stdoutLogEnabled="false" stdoutLogFile=".\logs\stdout" hostingModel="inprocess" />
    </system.webServer>
  </location>
</configuration>
"@

# Write new web.config
$newConfigContent | Out-File -FilePath $webConfigPath -Encoding utf8 -Force

Write-Host "Starting the website..."
Start-Website -Name $SiteName