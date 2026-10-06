// Display names change; exported plan data and schema stay untouched.
export function projectFileLabel(project){return String(project||'Basement restoration').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9]+/g,'-').slice(0,80).replace(/^-+|-+$/g,'')||'Basement-restoration';}
export function planFilename(plan){return `RebuildReady-${projectFileLabel(plan.project)}-Plan.json`;}
export function estimateFilename(plan,complete){return `RebuildReady-${projectFileLabel(plan.project)}-${complete?'':'Incomplete-'}${plan.role==='contractor'?'Contractor-Estimate':'Planning-Estimate'}.pdf`;}
