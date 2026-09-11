# 1. Configuración de Proveedores
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1" 
}

# 2. Definición del Bucket S3
resource "aws_s3_bucket" "react_hosting" {
  bucket_prefix = "jef901-react-app-" # Prefijo único global
  force_destroy = true                # Permite borrar con archivos adentro
}

# 3. Configuración para Hosting de Sitio Web Estático
resource "aws_s3_bucket_website_configuration" "react_hosting_config" {
  bucket = aws_s3_bucket.react_hosting.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# 4. Desactivar el bloqueo de políticas públicas (Requerido para sitios web públicos en S3)
resource "aws_s3_bucket_public_access_block" "react_hosting_public_block" {
  bucket = aws_s3_bucket.react_hosting.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# 5. Política IAM para permitir lecturas públicas anónimas
resource "aws_s3_bucket_policy" "allow_public_access" {
  depends_on = [aws_s3_bucket_public_access_block.react_hosting_public_block]
  bucket     = aws_s3_bucket.react_hosting.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.react_hosting.arn}/*"
      }
    ]
  })
}

# 6. Salidas (Outputs): Devuelve la URL pública para abrir en tu navegador
output "url_sitio_web" {
  value       = "http://${aws_s3_bucket_website_configuration.react_hosting_config.website_endpoint}"
  description = "URL oficial de tu App de React en AWS S3"
}
