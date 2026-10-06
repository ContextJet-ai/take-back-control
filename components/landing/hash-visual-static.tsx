import Image from "next/image";
export function HashVisualStatic() {
  return <Image src="/hash-static.webp" alt="An image breaking into a grid of tiles that fade into a short code" width={1200} height={900} className="rounded-card object-cover" data-testid="hash-static" />;
}
