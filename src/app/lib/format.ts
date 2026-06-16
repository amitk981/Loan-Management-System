// One home for number / currency formatting (see CLAUDE.md — "one thing, one place").
// Replaces 18 per-file copies of formatCurrency.

const RUPEE = '₹';

/** Format an amount in Indian rupees, e.g. 150000 -> "₹1,50,000". */
export function formatCurrency(n: number, paise = false): string {
  return RUPEE + n.toLocaleString('en-IN') + (paise ? '.00' : '');
}

/** Format a plain number with Indian digit grouping, e.g. 150000 -> "1,50,000". */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-IN');
}
