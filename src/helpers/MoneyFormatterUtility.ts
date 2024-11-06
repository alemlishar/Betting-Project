export function formatCents(cents: number, fractionalDigits: number) {
  return (cents / 100).toFixed(fractionalDigits).toString();
}
