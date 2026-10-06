import Image from "next/image";
export default function Logo() {
  return (
    <Image
      src="./cityfix_logo.svg"
      alt="Logo"
      width={32}
      height={32}
      className="h-8 w-8"
    />
  );
}