import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Crop, 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Check, 
  X,
  Image as ImageIcon
} from 'lucide-react';
import ReactCrop, { Crop as CropType, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageEditorProps {
  image: string;
  onSave: (editedImage: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

interface ImageSettings {
  quality: number;
  maxWidth: number;
  maxHeight: number;
  format: 'jpeg' | 'png' | 'webp';
}

export default function ImageEditor({ 
  image, 
  onSave, 
  onCancel, 
  aspectRatio = 1 
}: ImageEditorProps) {
  const [crop, setCrop] = useState<CropType>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<ImageSettings>({
    quality: 0.8,
    maxWidth: 800,
    maxHeight: 800,
    format: 'jpeg'
  });
  
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Aplicar recorte e edições
  const applyEdits = useCallback(async () => {
    if (!imgRef.current || !completedCrop || !canvasRef.current) return;

    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = imgRef.current;
    
    // Aguardar a imagem carregar completamente
    if (!image.complete) {
      await new Promise((resolve) => {
        image.onload = resolve;
      });
    }

    const { naturalWidth, naturalHeight } = image;

    // Calcular dimensões do recorte
    const cropX = (completedCrop.x * naturalWidth) / 100;
    const cropY = (completedCrop.y * naturalHeight) / 100;
    const cropWidth = (completedCrop.width * naturalWidth) / 100;
    const cropHeight = (completedCrop.height * naturalHeight) / 100;

    // Configurar canvas com as dimensões finais
    canvas.width = Math.min(cropWidth, settings.maxWidth);
    canvas.height = Math.min(cropHeight, settings.maxHeight);

    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Definir fundo branco para evitar transparência
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Aplicar rotação e escala
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Desenhar imagem recortada
    try {
      ctx.drawImage(
        image,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, canvas.width, canvas.height
      );
    } catch (error) {
      console.error('Erro ao desenhar imagem:', error);
      // Fallback: desenhar imagem completa
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    ctx.restore();

    // Converter para base64
    try {
      const mimeType = `image/${settings.format}`;
      const dataUrl = canvas.toDataURL(mimeType, settings.quality);
      
      if (dataUrl && dataUrl !== 'data:,') {
        onSave(dataUrl);
      } else {
        console.error('Erro ao gerar dataURL');
        alert('Erro ao processar imagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao converter para base64:', error);
      alert('Erro ao salvar imagem. Tente novamente.');
    }
  }, [completedCrop, rotation, scale, settings, onSave]);

  // Resetar edições
  const resetEdits = () => {
    setCrop({
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5
    });
    setRotation(0);
    setScale(1);
    setCompletedCrop(undefined);
  };

  // Rotacionar imagem
  const rotateImage = (direction: 'left' | 'right') => {
    setRotation(prev => prev + (direction === 'left' ? -90 : 90));
  };

  // Zoom da imagem
  const adjustZoom = (direction: 'in' | 'out') => {
    setScale(prev => {
      const newScale = direction === 'in' ? prev * 1.1 : prev * 0.9;
      return Math.max(0.5, Math.min(3, newScale));
    });
  };

  // Presets de tamanho
  const sizePresets = [
    { name: 'Quadrado (1:1)', width: 400, height: 400, aspect: 1 },
    { name: 'Retrato (3:4)', width: 300, height: 400, aspect: 0.75 },
    { name: 'Paisagem (4:3)', width: 400, height: 300, aspect: 1.33 },
    { name: 'Wide (16:9)', width: 400, height: 225, aspect: 1.78 },
    { name: 'Instagram (4:5)', width: 400, height: 500, aspect: 0.8 }
  ];

  const applySizePreset = (preset: typeof sizePresets[0]) => {
    setSettings(prev => ({
      ...prev,
      maxWidth: preset.width,
      maxHeight: preset.height
    }));
    
    // Ajustar crop para a nova proporção
    if (preset.aspect !== aspectRatio) {
      const newAspect = preset.aspect;
      setCrop(prev => ({
        ...prev,
        height: prev.width / newAspect
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Crop className="w-5 h-5" />
            Editor de Imagem
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Área de Edição */}
          <div className="flex gap-6">
            {/* Editor de Imagem */}
            <div className="flex-1 space-y-4">
              <div className="border rounded-lg overflow-hidden bg-muted">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                  minWidth={50}
                  minHeight={50}
                >
                  <img
                    ref={imgRef}
                    src={image}
                    alt="Editar"
                    style={{
                      transform: `rotate(${rotation}deg) scale(${scale})`,
                      maxWidth: '100%',
                      maxHeight: '60vh'
                    }}
                  />
                </ReactCrop>
              </div>
              
              {/* Controles de Edição */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rotacionar</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rotateImage('left')}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rotateImage('right')}
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Zoom</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustZoom('out')}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustZoom('in')}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Painel de Configurações */}
            <div className="w-80 space-y-6">
              {/* Presets de Tamanho */}
              <div className="space-y-3">
                <Label>Tamanho da Imagem</Label>
                <Select
                  value={`${settings.maxWidth}x${settings.maxHeight}`}
                  onValueChange={(value) => {
                    const [width, height] = value.split('x').map(Number);
                    const preset = sizePresets.find(p => p.width === width && p.height === height);
                    if (preset) applySizePreset(preset);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizePresets.map((preset) => (
                      <SelectItem key={`${preset.width}x${preset.height}`} value={`${preset.width}x${preset.height}`}>
                        {preset.name} ({preset.width}x{preset.height})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Qualidade */}
              <div className="space-y-3">
                <Label>Qualidade: {Math.round(settings.quality * 100)}%</Label>
                <Slider
                  value={[settings.quality]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, quality: value }))}
                  min={0.1}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Formato */}
              <div className="space-y-3">
                <Label>Formato</Label>
                <Select
                  value={settings.format}
                  onValueChange={(value: 'jpeg' | 'png' | 'webp') => 
                    setSettings(prev => ({ ...prev, format: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG (menor arquivo)</SelectItem>
                    <SelectItem value="png">PNG (transparência)</SelectItem>
                    <SelectItem value="webp">WebP (moderno)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dimensões Personalizadas */}
              <div className="space-y-3">
                <Label>Dimensões Personalizadas</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Largura (px)</Label>
                    <input
                      type="number"
                      value={settings.maxWidth}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        maxWidth: parseInt(e.target.value) || 400 
                      }))}
                      className="w-full px-2 py-1 border rounded text-sm"
                      min="100"
                      max="2000"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Altura (px)</Label>
                    <input
                      type="number"
                      value={settings.maxHeight}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        maxHeight: parseInt(e.target.value) || 400 
                      }))}
                      className="w-full px-2 py-1 border rounded text-sm"
                      min="100"
                      max="2000"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-3">
                <Label>Preview</Label>
                <div className="border rounded p-3 bg-muted">
                  <div className="text-xs text-muted-foreground mb-2">
                    Tamanho: {settings.maxWidth} x {settings.maxHeight}px
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Formato: {settings.format.toUpperCase()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Qualidade: {Math.round(settings.quality * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas oculto para processamento */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Botões de Ação */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetEdits}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Resetar
              </Button>
              <Button variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
            
            <Button onClick={applyEdits} className="px-6" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Aplicar Edições
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
