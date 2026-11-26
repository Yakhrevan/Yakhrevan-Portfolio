import { useId, useState } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
import type { EvidenceImage } from '../../data/showcaseEvidence';

export function ProjectEvidenceGallery({ entries, projectName }: { entries: EvidenceImage[]; projectName: string }) {
  const [selected, setSelected] = useState(0);
  const headingId = useId();
  const current = entries[selected];

  if (!current) return null;

  const goTo = (index: number) => setSelected((index + entries.length) % entries.length);

  return (
    <section aria-labelledby={headingId} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
        <h3 id={headingId} className="flex items-center gap-2 text-sm font-extrabold text-brand-navy">
          <Images className="h-4 w-4 text-brand-blue" aria-hidden="true" /> {projectName} evidence gallery
        </h3>
        <span className="font-mono text-[11px] font-bold text-brand-slate">{selected + 1} / {entries.length}</span>
      </div>

      <figure className="min-w-0">
        <div className="relative flex aspect-[16/10] min-h-[190px] items-center justify-center overflow-hidden bg-[#edf3f7]">
          <img key={current.src} src={current.src} alt={current.alt} loading="lazy" decoding="async" className="h-full max-h-[410px] w-full object-contain" />
          {entries.length > 1 && (
            <div className="pointer-events-none absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
              <button type="button" aria-label={`Previous ${projectName} evidence image`} onClick={() => goTo(selected - 1)} className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-brand-navy shadow-md transition-colors hover:bg-brand-sky-light"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
              <button type="button" aria-label={`Next ${projectName} evidence image`} onClick={() => goTo(selected + 1)} className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-brand-navy shadow-md transition-colors hover:bg-brand-sky-light"><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
            </div>
          )}
        </div>
        <figcaption className="min-h-[130px] space-y-2 p-4 sm:p-5" aria-live="polite">
          <span className={`inline-block rounded-md px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide ${current.mediaType === 'Virtual simulation still' ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-900'}`}>{current.mediaType}</span>
          <p className="text-base font-extrabold text-brand-navy">{current.title}</p>
          <p className="text-xs leading-5 text-brand-slate">{current.context}</p>
        </figcaption>
      </figure>

      {entries.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-3 sm:px-5" role="group" aria-label={`Choose ${projectName} evidence image`}>
          {entries.map((entry, index) => (
            <button key={entry.src} type="button" onClick={() => goTo(index)} aria-label={`Show image ${index + 1}: ${entry.title}`} aria-pressed={selected === index} className={`h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-colors focus-visible:outline-offset-2 ${selected === index ? 'border-brand-blue' : 'border-slate-200 hover:border-brand-blue/50'}`}>
              <img src={entry.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
