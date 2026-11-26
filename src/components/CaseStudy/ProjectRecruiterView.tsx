import { ArrowUpRight, BookOpen, CheckCircle2, Download, ExternalLink, FlaskConical } from 'lucide-react';
import type { Showcase } from '../../data/showcaseEvidence';
import { EvidenceStatusBadges } from './EvidenceStatusBadges';

const REPO_BLOB = 'https://github.com/Yakhrevan/Yakhrevan-Portfolio/blob/main/';

export function ProjectRecruiterView({ showcase }: { showcase: Showcase }) {
  return (
    <aside aria-label={`${showcase.discipline} recruiter brief`} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-extrabold text-brand-navy"><BookOpen className="h-5 w-5 text-brand-blue" aria-hidden="true" /> Recruiter quick view</h3>
        <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-brand-blue">PROJECT {showcase.number}</span>
      </div>
      <div className="mt-4"><EvidenceStatusBadges compact /></div>

      <dl className="mt-5 space-y-4 text-sm">
        <div><dt className="font-mono text-[10px] font-bold uppercase tracking-[.12em] text-brand-blue">Individual contribution</dt><dd className="mt-1.5 leading-6 text-brand-navy/90">{showcase.contribution}</dd></div>
        <div><dt className="font-mono text-[10px] font-bold uppercase tracking-[.12em] text-brand-blue">Inspectable result</dt><dd className="mt-1.5 flex items-start gap-2 leading-6 text-brand-slate"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />{showcase.verifiedBehavior}</dd></div>
        <div><dt className="font-mono text-[10px] font-bold uppercase tracking-[.12em] text-brand-blue">Validation boundary</dt><dd className="mt-1.5 leading-6 text-brand-slate">{showcase.boundary}. The published software demonstration was AI-assisted; hardware performance has not been established.</dd></div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-2" aria-label="Project technologies">
        {showcase.technologies.map((item) => <span key={item} className="rounded-md border border-blue-100 bg-brand-sky-light px-2.5 py-1.5 text-[11px] font-semibold text-brand-navy">{item}</span>)}
      </div>

      <div className="mt-6 grid gap-2 border-t border-slate-100 pt-5 sm:grid-cols-2">
        <a href={showcase.source} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-blue-100 bg-brand-bg px-3 py-2 text-xs font-bold text-brand-blue hover:border-brand-blue">Inspect source <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
        <a href={`${REPO_BLOB}${showcase.testPath}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs font-bold text-brand-blue hover:border-brand-blue"><FlaskConical className="h-4 w-4" aria-hidden="true" /> {showcase.testCount} model tests <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>
        <a href={`${import.meta.env.BASE_URL}Yakhrevan_S_Resume.pdf`} download="Yakhrevan_S_Resume.pdf" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-blue px-3 py-2 text-xs font-bold text-white hover:bg-brand-blue-dark sm:col-span-2"><Download className="h-4 w-4" aria-hidden="true" /> Download original CV</a>
      </div>
    </aside>
  );
}
