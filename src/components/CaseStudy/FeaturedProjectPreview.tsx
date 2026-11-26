import { useState } from 'react';
import { ArrowRight, Images, ScanEye, X } from 'lucide-react';
import type { Project } from '../../types/portfolio';
import type { Showcase } from '../../data/showcaseEvidence';
import { EvidenceStatusBadges } from './EvidenceStatusBadges';
import { ProjectEvidenceGallery } from './ProjectEvidenceGallery';
import { ProjectRecruiterView } from './ProjectRecruiterView';

type PreviewTab = 'evidence' | 'recruiter';

export function FeaturedProjectPreview({ showcase, project, onOpen, onClose }: {
  showcase: Showcase;
  project: Project;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<PreviewTab>('evidence');

  return (
    <section id="featured-preview" tabIndex={-1} aria-labelledby="featured-preview-title" className="mt-8 scroll-mt-24 overflow-hidden rounded-3xl border border-blue-200 bg-[#f4f8fc] shadow-[0_16px_50px_-30px_rgba(15,42,94,.45)]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-blue-100 bg-brand-navy px-5 py-5 text-white sm:px-7">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-sky-300">Project {showcase.number} / Engineering evidence</p>
          <h3 id="featured-preview-title" className="mt-2 text-xl font-extrabold sm:text-2xl">{project.title.replace(/^P\d+ — /, '')}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{showcase.recruiterSummary}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close project preview" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/15"><X className="h-5 w-5" aria-hidden="true" /></button>
      </div>

      <div className="p-4 sm:p-6">
        <EvidenceStatusBadges />
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Project preview view">
          <button type="button" aria-pressed={tab === 'evidence'} onClick={() => setTab('evidence')} className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${tab === 'evidence' ? 'bg-brand-blue text-white' : 'border border-slate-200 bg-white text-brand-navy hover:border-brand-blue'}`}><Images className="h-4 w-4" aria-hidden="true" /> Visual evidence</button>
          <button type="button" aria-pressed={tab === 'recruiter'} onClick={() => setTab('recruiter')} className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${tab === 'recruiter' ? 'bg-brand-blue text-white' : 'border border-slate-200 bg-white text-brand-navy hover:border-brand-blue'}`}><ScanEye className="h-4 w-4" aria-hidden="true" /> Recruiter brief</button>
        </div>

        <div className="mt-4">
          {tab === 'evidence' ? (
            <ProjectEvidenceGallery entries={showcase.gallery} projectName={project.title.replace(/^P\d+ — /, '')} />
          ) : (
            <ProjectRecruiterView showcase={showcase} />
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-blue-100 pt-5">
          <p className="max-w-xl text-xs leading-5 text-brand-slate">Visuals are identified as virtual stills or illustrations. To verify live behavior, open the interactive demo and inspect its five-part case study.</p>
          <button type="button" onClick={onOpen} className="btn-primary w-full justify-center sm:w-auto">Open live demo + full case study <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  );
}
