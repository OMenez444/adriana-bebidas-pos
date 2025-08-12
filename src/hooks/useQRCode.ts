import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export function useQRCode(text: string, options?: QRCode.QRCodeOptions) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!text) return;

    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(text, {
          width: 150,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          ...options
        });
        setDataUrl(url);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao gerar QR Code');
        console.error('Erro ao gerar QR Code:', err);
      }
    };

    generateQR();
  }, [text, options]);

  return { dataUrl, error };
}
