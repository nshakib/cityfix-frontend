import Link from "next/link";
import { redirect } from "next/navigation";
import z from "zod";
import VerifyAccountForm from "@/components/form/VerifyAccountForm";

// In this Next.js version `searchParams` is a Promise, so the page is async.
export default async function VerifyAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { email } = await searchParams;
  const value = Array.isArray(email) ? email[0] : email;

  // Landing here without a valid email (e.g. a bookmarked URL) means there is nothing to verify.
  if (!value || !z.email().safeParse(value).success) {
    redirect("/register");
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="text-lg font-semibold">
            CityFix
          </Link>
        </div>
        <VerifyAccountForm email={value} />
      </div>
    </div>
  );
}