variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "db_password" {
  description = "RDS password"
  sensitive   = true
}

variable "backend_image" {
  description = "Backend Docker image URI"
  default     = "ghcr.io/your-username/habit-ai/backend:latest"
}

variable "frontend_image" {
  description = "Frontend Docker image URI"
  default     = "ghcr.io/your-username/habit-ai/frontend:latest"
}
