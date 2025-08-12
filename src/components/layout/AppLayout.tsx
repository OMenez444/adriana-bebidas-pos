import { NavLink, useNavigate } from 'react-router-dom';
import { useSettingsStore } from '@/state/settings';
import { cn } from '@/lib/utils';
import { LayoutGrid, ListChecks, PlusCircle, Shield, QrCode } from 'lucide-react';
import { ReactNode, useState } from 'react';
import OrderNotification from '../OrderNotification';

export default function AppLayout({ children, title }: { children: ReactNode; title?: string }) {
  const lojaNome = useSettingsStore((s) => s.settings.lojaNome);
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="container flex items-center justify-between h-14">
          <button onClick={() => navigate('/mesas')} className="font-semibold tracking-wide">
            {lojaNome}
          </button>
          <div className="text-sm opacity-80">{title}</div>
        </div>
      </header>

      <main className="flex-1 container py-4">{children}</main>
      
      {showNotification && (
        <OrderNotification onClose={() => setShowNotification(false)} />
      )}

      <nav className="sticky bottom-0 border-t bg-background h-14">
        <div className="grid grid-cols-5 h-full">
          <Tab to="/mesas" icon={<LayoutGrid className="h-5 w-5" />} label="Mesas" />
          <Tab to="/comandas" icon={<ListChecks className="h-5 w-5" />} label="Comandas" />
          <Tab to="/nova" icon={<PlusCircle className="h-5 w-5" />} label="Nova" />
          <Tab to="/qrcode" icon={<QrCode className="h-5 w-5" />} label="QR Code" />
          <Tab to="/admin" icon={<Shield className="h-5 w-5" />} label="Admin" />
        </div>
      </nav>
    </div>
  );
}

function Tab({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  const base = 'flex items-center justify-center gap-2 text-sm';
  return (
    <NavLink to={to} className={({ isActive }) => cn(base, isActive ? 'text-primary font-medium' : 'opacity-80 hover:opacity-100') }>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </NavLink>
  );
}
