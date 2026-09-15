import Image from "next/image";
import Link from "next/link";
export function Logo() {
  return <Link href="/" aria-label="KROVEX – domov" className="brand"><Image src="/images/roofing/krovex-logo.png" alt="KROVEX" width={480} height={160} priority /></Link>;
}
