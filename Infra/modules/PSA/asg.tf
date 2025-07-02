resource "aws_security_group" "PSA_asg_sg" {
  name_prefix = "windows-asg-shoppy-PSA"
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

resource "aws_launch_template" "PSA_template" {
  name_prefix   = "PSA-template"
  image_id      = var.ami # Windows Server AMI
  instance_type = var.instance_type
  key_name      = "windows"
  vpc_security_group_ids = [aws_security_group.PSA_asg_sg.id]

  user_data = base64encode(<<-EOF
    <powershell>
      Start-Transcript -Path "C:\\bootstrap-log.txt"
      Invoke-WebRequest "https://alok-production-artifacts.s3.us-east-1.amazonaws.com/productservice/bootstrap_product.ps1" -OutFile "C:\\bootstrap.ps1"
      & "C:\\bootstrap.ps1"
      stop-Transcript
    </powershell>
    <persist>true</persist>
  EOF
  )
}


resource "aws_autoscaling_group" "PSA_asg" {
  name  = "SB1-batch"
  desired_capacity     = 2
  max_size            = 2
  min_size            = 1
  vpc_zone_identifier = var.public_subnet_ids

  launch_template {
    id      = aws_launch_template.PSA_template.id
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
    value               = "PSA-batch"
    propagate_at_launch = true
  }
}

resource "aws_lb" "PSA_alb" {
  name               = "PSA-alb-tf"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.PSA_asg_sg.id]
  subnets            = var.public_subnet_ids


  tags = {
    Environment = "Prod"
  }
}

resource "aws_lb_target_group" "PSA_alb_target_group" {
  name     = "PSA-alb-target-group"
  port     = 5001
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/api/hello"  # Or a dedicated health endpoint
    port                = "traffic-port" # Uses the same port (5002)
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher             = "200-399"  # Success HTTP codes
  }
}

resource "aws_autoscaling_attachment" "PSA_attachment" {
  autoscaling_group_name = aws_autoscaling_group.PSA_asg.id
  lb_target_group_arn    = aws_lb_target_group.PSA_alb_target_group.arn
}

resource "aws_lb_listener" "http_listener_PSA" {
  load_balancer_arn = aws_lb.PSA_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.PSA_alb_target_group.arn
  }
}
