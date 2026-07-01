import Image from "next/image";
import Link from "next/link";

type LogoVariant = "header" | "footer" | "card";

type LogoProps = {
  variant?: LogoVariant;
  className?: string;
};

const logoSizes: Record<LogoVariant, string> = {
  header: "h-12 w-12 sm:h-14 sm:w-14",
  footer: "h-20 w-20",
  card: "h-16 w-16 sm:h-20 sm:w-20"
};

const logoImage = (
  variant: LogoVariant,
  className = ""
) => (
  <span className={`relative block shrink-0 ${logoSizes[variant]} ${className}`}>
    <Image
      src="/images/brand/martis_mv.webp"
      alt="Martiš MV – interiérové rekonštrukcie"
      width={1254}
      height={1254}
      priority={variant === "header"}
      sizes={variant === "header" ? "56px" : variant === "footer" ? "80px" : "80px"}
      className="h-full w-full object-contain"
    />
  </span>
);

export function Logo({ variant = "header", className = "" }: LogoProps) {
  if (variant === "header") {
    return (
      <Link href="/" aria-label="Martiš MV domov" className="inline-flex items-center">
        {logoImage(variant, className)}
      </Link>
    );
  }

  return logoImage(variant, className);
}
