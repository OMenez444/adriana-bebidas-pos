import { useEffect, useState } from 'react';

interface UseMesaSecurityProps {
  mesaNumero: number;
  onSecurityWarning: () => void;
}

export function useMesaSecurity({ mesaNumero, onSecurityWarning }: UseMesaSecurityProps) {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (mesaNumero && mesaNumero > 0) {
      setIsLocked(true);
      
      // Prevenir navegação para trás
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      
      // Prevenir navegação com botão voltar
      const handlePopState = (e: PopStateEvent) => {
        e.preventDefault();
        onSecurityWarning();
      };
      
      // Bloquear teclas de atalho
      const handleKeyDown = (e: KeyboardEvent) => {
        // Ctrl/Cmd + W (fechar aba)
        if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
          e.preventDefault();
          onSecurityWarning();
        }
        
        // Ctrl/Cmd + N (nova aba)
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
          e.preventDefault();
          onSecurityWarning();
        }
        
        // Ctrl/Cmd + T (nova aba)
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
          e.preventDefault();
          onSecurityWarning();
        }
        
        // F5 (refresh)
        if (e.key === 'F5') {
          e.preventDefault();
          onSecurityWarning();
        }
        
        // F12 (dev tools)
        if (e.key === 'F12') {
          e.preventDefault();
          onSecurityWarning();
        }
        
        // Ctrl/Cmd + Shift + I (dev tools)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
          e.preventDefault();
          onSecurityWarning();
        }
        
        // Ctrl/Cmd + Shift + C (dev tools)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
          e.preventDefault();
          onSecurityWarning();
        }
      };
      
      // Bloquear clique direito
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        onSecurityWarning();
      };
      
      // Bloquear arrastar elementos
      const handleDragStart = (e: DragEvent) => {
        e.preventDefault();
      };
      
      // Bloquear seleção de texto
      const handleSelectStart = (e: Event) => {
        e.preventDefault();
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('dragstart', handleDragStart);
      document.addEventListener('selectstart', handleSelectStart);
      
      // Desabilitar zoom com Ctrl + scroll
      const handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      };
      
      document.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('dragstart', handleDragStart);
        document.removeEventListener('selectstart', handleSelectStart);
        document.removeEventListener('wheel', handleWheel);
      };
    }
  }, [mesaNumero, onSecurityWarning]);

  return { isLocked };
}
