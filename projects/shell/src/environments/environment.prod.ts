export const environment = {
  production: true,
  // En producción, WSS va por el mismo dominio (CloudFront → API Gateway)
  wsUrl: 'wss://api.quizarena.tudominio.com/dev',
  // En producción, los MFEs están en sus propios CloudFront distributions
  federationManifest: '/federation.manifest.prod.json',
};
