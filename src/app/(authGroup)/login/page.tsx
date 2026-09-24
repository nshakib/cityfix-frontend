import Link from "next/link";
import LoginForm from "@/components/form/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="text-lg font-semibold">
            CityFix
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}