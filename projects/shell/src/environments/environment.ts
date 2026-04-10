export const environment = {
  production: false,
  // URL del WebSocket — reemplaza <API_ID> con el ID de tu API Gateway
  wsUrl: 'wss://<API_ID>.execute-api.us-east-1.amazonaws.com/dev',
  // En desarrollo, los MFEs corren en localhost
  federationManifest: '/federation.manifest.json',
};
