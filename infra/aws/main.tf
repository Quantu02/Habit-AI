resource "aws_vpc" "habit_ai" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "habit-ai-vpc"
  }
}

resource "aws_subnet" "habit_ai_public" {
  vpc_id            = aws_vpc.habit_ai.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = var.aws_region
  map_public_ip_on_launch = true

  tags = {
    Name = "habit-ai-public-subnet"
  }
}

resource "aws_security_group" "habit_ai_alb" {
  name        = "habit-ai-alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.habit_ai.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "habit-ai-alb-sg"
  }
}

resource "aws_lb" "habit_ai" {
  name               = "habit-ai-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.habit_ai_alb.id]
  subnets            = [aws_subnet.habit_ai_public.id]

  tags = {
    Name = "habit-ai-alb"
  }
}

resource "aws_rds_instance" "habit_ai" {
  identifier     = "habit-ai-db"
  engine         = "postgres"
  engine_version = "15.2"
  instance_class = "db.t3.micro"
  
  db_name  = "habit_ai"
  username = "admin"
  password = var.db_password
  
  allocated_storage = 20
  skip_final_snapshot = true

  tags = {
    Name = "habit-ai-database"
  }
}

resource "aws_ecs_cluster" "habit_ai" {
  name = "habit-ai-cluster"

  tags = {
    Name = "habit-ai-cluster"
  }
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "habit-ai-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = var.backend_image
      essential = true
      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "DATABASE_URL"
          value = "postgresql://${aws_rds_instance.habit_ai.username}:${var.db_password}@${aws_rds_instance.habit_ai.endpoint}:5432/${aws_rds_instance.habit_ai.db_name}"
        }
      ]
    }
  ])

  tags = {
    Name = "habit-ai-backend-task"
  }
}

output "alb_dns_name" {
  value       = aws_lb.habit_ai.dns_name
  description = "DNS name of the load balancer"
}

output "rds_endpoint" {
  value       = aws_rds_instance.habit_ai.endpoint
  description = "RDS database endpoint"
}
