import { CheckCircle2, ShieldAlert } from 'lucide-react';

export function EvidenceStatusBadges({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Validation status">
      <span className={`inline-flex items-center gap-1.5 rounded-md bg-emerald-50 font-mono font-bold text-emerald-800 ring-1 ring-emerald-200 ${compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-[10px]'}`}>
        <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" /> Software simulation-tested
      </span>
      <span className={`inline-flex items-center gap-1.5 rounded-md bg-amber-50 font-mono font-bold text-amber-800 ring-1 ring-amber-200 ${compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-[10px]'}`}>
        <ShieldAlert className="h-3 w-3 shrink-0" aria-hidden="true" /> Hardware unverified
      </span>
    </div>
  );
}
