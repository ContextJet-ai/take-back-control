export function buildMailto(to: string, subject: string, body: string) {
  const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { href, tooLong: href.length > 1900 };
}
