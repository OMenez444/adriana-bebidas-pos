// Configuração de ambiente para detectar se está rodando local ou publicamente
export interface EnvironmentConfig {
  isPublic: boolean;
  apiUrl: string;
  qrCodeBaseUrl: string;
  environment: 'local' | 'public' | 'development';
}

// Detectar ambiente baseado na URL
const isPublic = window.location.hostname !== 'localhost' && 
                 !window.location.hostname.startsWith('192.168.') &&
                 !window.location.hostname.startsWith('10.') &&
                 !window.location.hostname.startsWith('172.');

// Configuração baseada no ambiente
export const environmentConfig: EnvironmentConfig = {
  isPublic,
  apiUrl: isPublic 
    ? 'https://adriana-bebidas-pos.vercel.app/api' 
    : `http://${window.location.hostname}:3000/api`,
  qrCodeBaseUrl: isPublic 
    ? 'https://adriana-bebidas-pos.vercel.app/pedir' 
    : `http://${window.location.hostname}:3000/pedir`,
  environment: isPublic ? 'public' : 'local'
};

// Função para obter URL completa para QR Code
export const getQRCodeUrl = (mesaNumero: number): string => {
  return `${environmentConfig.qrCodeBaseUrl}/${mesaNumero}`;
};

// Função para obter URL da API
export const getApiUrl = (endpoint: string): string => {
  return `${environmentConfig.apiUrl}/${endpoint}`;
};

// Função para verificar se está em modo público
export const isPublicEnvironment = (): boolean => {
  return environmentConfig.isPublic;
};

// Função para obter informações do ambiente
export const getEnvironmentInfo = () => {
  return {
    ...environmentConfig,
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    port: window.location.port
  };
};

export default environmentConfig;
