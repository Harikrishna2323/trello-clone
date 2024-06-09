import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const Font = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image src="/logo.svg" alt="logo" height={30} width={30} />
        <p className={cn("text-lg text-neutral-700 pb-1", Font.className)}>
          Taskify
        </p>
      </div>
    </Link>
  );
};
