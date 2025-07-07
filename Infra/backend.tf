terraform {
  backend "s3" {
    bucket = "alokkodzz-tf"
    key    = "State/terraform.tfstate"
    region = "us-east-1"
  }
}
