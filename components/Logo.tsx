import Image from "next/image";
import Link from "next/link";

type LogoProps = { variant?: "dark" | "light" };

export function Logo({ variant = "dark" }: LogoProps) {
  const src = variant === "light"
    ? "/images/roofing/krovex-logo-light.png"
    : "/images/roofing/krovex-logo.png";

  return (
    <Link href="/" aria-label="KROVEX – domov" className="brand">
      <Image src={src} alt="KROVEX" width={480} height={160} priority />
    </Link>
  );
}
