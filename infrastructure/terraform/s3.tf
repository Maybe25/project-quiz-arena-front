# ── S3 buckets privados — acceso sólo desde CloudFront via OAC ───────────────

resource "aws_s3_bucket" "mfe" {
  for_each = toset(local.mfe_names)
  bucket   = "${var.project}-${each.key}-${var.env}"
  tags     = local.tags
}

resource "aws_s3_bucket_public_access_block" "mfe" {
  for_each = aws_s3_bucket.mfe

  bucket                  = each.value.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Origin Access Control — CloudFront lee S3 sin exponer el bucket al público
resource "aws_cloudfront_origin_access_control" "mfe" {
  for_each = aws_s3_bucket.mfe

  name                              = "${var.project}-${each.key}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Bucket policy — sólo la distribución CloudFront correspondiente puede leer
resource "aws_s3_bucket_policy" "mfe" {
  for_each = aws_s3_bucket.mfe

  bucket = each.value.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "AllowCloudFrontOAC"
      Effect = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action   = "s3:GetObject"
      Resource = "${each.value.arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.mfe[each.key].arn
        }
      }
    }]
  })
  depends_on = [aws_cloudfront_distribution.mfe]
}
