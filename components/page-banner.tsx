import Image from "next/image";

export function PageBanner({ src, alt = "", priority = false }: { src: string; alt?: string; priority?: boolean }) {
  return (
    <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-card border border-border sm:aspect-[21/9]">
      <Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 768px) 672px, 100vw" className="object-cover dark:brightness-90" />
    </div>
  );
}
