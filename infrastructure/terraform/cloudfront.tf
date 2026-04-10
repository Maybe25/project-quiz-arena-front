# ── CORS Response Headers Policy ─────────────────────────────────────────────
# Los MFEs se cargan cross-origin desde el shell. Sin CORS el browser bloquea
# los dynamic import() y fetch() de remoteEntry.json entre dominios CloudFront.

resource "aws_cloudfront_response_headers_policy" "cors" {
  name    = "${var.project}-cors-${var.env}"
  comment = "CORS para micro-frontends de ${var.project}"

  cors_config {
    access_control_allow_credentials = false

    access_control_allow_headers {
      items = ["*"]
    }
    access_control_allow_methods {
      items = ["GET", "HEAD", "OPTIONS"]
    }
    access_control_allow_origins {
      items = ["*"]
    }
    origin_override = true
  }
}

# ── CloudFront distributions — sin dominio propio, HTTPS gratis ──────────────
#
# Cada MFE tiene su distribución independiente:
#   shell           → https://dXXX.cloudfront.net  (PWA instalable)
#   mfe-home        → https://dYYY.cloudfront.net
#   mfe-game        → https://dZZZ.cloudfront.net
#   mfe-leaderboard → https://dWWW.cloudfront.net
#
# El script post-deploy actualiza federation.manifest.prod.json con las URLs reales.

resource "aws_cloudfront_distribution" "mfe" {
  for_each = aws_s3_bucket.mfe

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"   # US + Europa — menor costo
  comment             = "${var.project}-${each.key}-${var.env}"
  tags                = local.tags

  # Sin aliases — usamos el dominio *.cloudfront.net generado automáticamente

  origin {
    domain_name              = each.value.bucket_regional_domain_name
    origin_id                = "s3-${each.key}"
    origin_access_control_id = aws_cloudfront_origin_access_control.mfe[each.key].id
  }

  # Cache default: 1 hora para assets normales
  default_cache_behavior {
    allowed_methods              = ["GET", "HEAD", "OPTIONS"]
    cached_methods               = ["GET", "HEAD"]
    target_origin_id             = "s3-${each.key}"
    compress                     = true
    viewer_protocol_policy       = "redirect-to-https"
    response_headers_policy_id   = aws_cloudfront_response_headers_policy.cors.id

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  # index.html — sin cache (crítico para actualizaciones de PWA)
  ordered_cache_behavior {
    path_pattern                 = "/index.html"
    allowed_methods              = ["GET", "HEAD"]
    cached_methods               = ["GET", "HEAD"]
    target_origin_id             = "s3-${each.key}"
    compress                     = true
    viewer_protocol_policy       = "redirect-to-https"
    response_headers_policy_id   = aws_cloudfront_response_headers_policy.cors.id

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  # *.json sin cache — federation manifest y ngsw.json deben estar siempre frescos
  ordered_cache_behavior {
    path_pattern                 = "/*.json"
    allowed_methods              = ["GET", "HEAD"]
    cached_methods               = ["GET", "HEAD"]
    target_origin_id             = "s3-${each.key}"
    compress                     = true
    viewer_protocol_policy       = "redirect-to-https"
    response_headers_policy_id   = aws_cloudfront_response_headers_policy.cors.id

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 30
  }

  # SPA routing: 403/404 → index.html (Angular Router maneja la ruta)
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  # TLS con certificado CloudFront por defecto (gratis, *.cloudfront.net)
  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }
}
