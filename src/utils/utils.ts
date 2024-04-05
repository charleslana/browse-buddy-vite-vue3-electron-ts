export function formatBreakLines(text: string): string {
  text = text.replace(/\n/g, '<br>');
  return text;
}
