import { Badge } from '@/components/ui/badge';
import type { StatusComanda } from '@/state/types';

export function StatusBadge({ status }: { status: StatusComanda }) {
  const map: Record<StatusComanda, { label: string; variant?: 'default' | 'secondary' | 'destructive' }> = {
    ABERTA: { label: 'Aberta', variant: 'secondary' },
    EM_PREPARO: { label: 'Em preparo', variant: 'default' },
    FECHADA_PAGA: { label: 'Paga', variant: 'default' },
    CANCELADA: { label: 'Cancelada', variant: 'destructive' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}
