terraform {
  required_version = ">= 1.7.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "quizarena-tfstate-976138221384"
    key            = "frontend/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "quizarena-tfstate-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  mfe_names = ["shell", "mfe-home", "mfe-game", "mfe-leaderboard"]

  tags = {
    Project     = var.project
    Environment = var.env
    ManagedBy   = "terraform"
  }
}
