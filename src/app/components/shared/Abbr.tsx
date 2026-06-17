// Plain-language glossary for the dense SOP acronyms (audit DA-027).
// Wraps an acronym in a native <abbr title> so hovering/long-pressing reveals the
// expansion — recognition over recall, especially for the farmer audience.

export const GLOSSARY: Record<string, string> = {
  PoA: 'Power of Attorney — lets the Company Secretary act on the loan documents if you default',
  'SH-4': 'Share Transfer Form (SH-4) — held in blank as security; returned when you fully repay',
  CDSL: 'Central Depository — where D-MAT (electronic) shares are pledged as security',
  NOC: 'No-Objection Certificate — issued when the loan is fully repaid and closed',
  DPD: 'Days Past Due — how many days a repayment is overdue',
  SAP: "SFPCL's accounting system, where loan entries are recorded",
  KYC: 'Know Your Customer — identity verification using PAN, Aadhaar, etc.',
  CKYC: 'Central KYC — a shared KYC record identifier',
  'NACH/ECS': 'Auto-debit mandate that lets approved repayments be collected automatically',
  TAT: 'Turnaround Time — the time allowed to complete a step',
  CFC: 'Chief Financial Controller — authorises the bank transfer',
  TermSheet: 'Term Sheet — the summary of your loan rate, charges and key terms',
};

export function Abbr({ term, children }: { term: keyof typeof GLOSSARY | string; children?: React.ReactNode }) {
  const title = GLOSSARY[term];
  if (!title) return <>{children ?? term}</>;
  return (
    <abbr title={title} style={{ textDecoration: 'underline dotted', textUnderlineOffset: 2, cursor: 'help' }}>
      {children ?? term}
    </abbr>
  );
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Longest-first so "SH-4" / "NACH/ECS" win over shorter overlaps.
const GLOSSARY_RE = new RegExp(`(${Object.keys(GLOSSARY).sort((a, b) => b.length - a.length).map(esc).join('|')})`, 'g');

/** Auto-wrap any glossary acronym found in a plain string with an <abbr> tooltip. */
export function withGlossary(text: string): React.ReactNode {
  const parts = text.split(GLOSSARY_RE);
  return parts.map((part, i) => (GLOSSARY[part] ? <Abbr key={i} term={part} /> : <span key={i}>{part}</span>));
}
