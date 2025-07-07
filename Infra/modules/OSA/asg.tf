resource "aws_security_group" "OSA_asg_sg" {
  name_prefix = "windows-asg-shoppy-OSA"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 3389
    to_port     = 3389
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Replace with your IP for security
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_launch_template" "OSA_template" {
  name_prefix   = "OSA-template"
  image_id      = var.ami # Windows Server AMI
  instance_type = var.instance_type
  key_name      = "win"
  vpc_security_group_ids = [aws_security_group.OSA_asg_sg.id]

  user_data = base64encode(<<-EOF
    <powershell>
      Start-Transcript -Path "C:\\bootstrap-log.txt"
      write-host "Starting iis installation"
      Install-WindowsFeature -Name Web-Server, Web-WebServer, Web-App-Dev, Web-Net-Ext, Web-Net-Ext45, Web-ASP, Web-Asp-Net, Web-Asp-Net45, Web-CGI, Web-ISAPI-Ext, Web-ISAPI-Filter, Web-Includes, Web-WebSockets, Web-AppInit -IncludeManagementTools
      $dotnetInstaller = "https://builds.dotnet.microsoft.com/dotnet/Sdk/6.0.428/dotnet-sdk-6.0.428-win-x64.exe"
      Invoke-WebRequest $dotnetInstaller -OutFile "C:\\dotnet6.exe"
      Start-Process "C:\\dotnet6.exe" -ArgumentList "/quiet" -Wait
      write-host "Starting dotnet6 installation"
      $dotnetInstaller_1 = "https://builds.dotnet.microsoft.com/dotnet/aspnetcore/Runtime/6.0.36/dotnet-hosting-6.0.36-win.exe"
      Invoke-WebRequest $dotnetInstaller_1 -OutFile "C:\\dotnet6_hosting.exe"
      Start-Process "C:\\dotnet6_hosting.exe" -ArgumentList "/quiet" -Wait
      write-host "downloading bootstrap script"
      Invoke-WebRequest "https://shoppy-artifacts.s3.us-east-1.amazonaws.com/bootstrap_order.ps1" -OutFile "C:\\bootstrap.ps1"
      & "C:\\bootstrap.ps1"
      write-host "adding firewall rule for port 5002"
      New-NetFirewallRule -DisplayName "Allow Port 5002" -Direction Inbound -LocalPort 5002 -Protocol TCP -Action Allow
      stop-Transcript
    </powershell>
  EOF
  )
}


resource "aws_autoscaling_group" "OSA_asg" {
  name  = "OSA-batch"
  desired_capacity     = 1
  max_size            = 1
  min_size            = 1
  vpc_zone_identifier = var.public_subnet_ids

  launch_template {
    id      = aws_launch_template.OSA_template.id
    version = "$Latest"
  }

  termination_policies = ["OldestInstance"]

  instance_refresh {
    strategy = "Rolling"
    preferences {
      instance_warmup        = 0
      min_healthy_percentage = 25
      }
  }

  tag {
    key                 = "version"
    value               = "v1.0.0"
    propagate_at_launch = true
  }
  tag {
    key                 = "Name"
    value               = "OSA-batch"
    propagate_at_launch = true
  }
}

resource "aws_lb" "OSA_alb" {
  name               = "OSA-alb-tf"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.OSA_asg_sg.id]
  subnets            = var.public_subnet_ids


  tags = {
    Environment = "Shoppy"
  }
}

resource "aws_lb_target_group" "OSA_alb_target_group" {
  name     = "OSA-alb-target-group"
  port     = 5002
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/swagger"  # Or a dedicated health endpoint
    port                = "traffic-port" # Uses the same port (5002)
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher             = "200-399"  # Success HTTP codes
  }
}

resource "aws_autoscaling_attachment" "OSA_attachment" {
  autoscaling_group_name = aws_autoscaling_group.OSA_asg.id
  lb_target_group_arn    = aws_lb_target_group.OSA_alb_target_group.arn
}

resource "aws_lb_listener" "http_listener_OSA" {
  load_balancer_arn = aws_lb.OSA_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.OSA_alb_target_group.arn
  }
}
