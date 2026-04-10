output "shell_url" {
  description = "URL de la PWA (comparte esta con los jugadores)"
  value       = "https://${aws_cloudfront_distribution.mfe["shell"].domain_name}"
}

output "cloudfront_domains" {
  description = "URLs de CloudFront de cada MFE (para federation.manifest.prod.json)"
  value = {
    for k, dist in aws_cloudfront_distribution.mfe : k => "https://${dist.domain_name}"
  }
}

output "cloudfront_ids" {
  description = "IDs de las distribuciones (para invalidar cache en CI/CD)"
  value = {
    for k, dist in aws_cloudfront_distribution.mfe : k => dist.id
  }
}

output "s3_buckets" {
  description = "Nombres de los buckets S3"
  value = {
    for k, bucket in aws_s3_bucket.mfe : k => bucket.bucket
  }
}
