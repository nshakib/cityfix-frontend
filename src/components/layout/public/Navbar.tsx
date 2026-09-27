"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useGetMe, useLogout } from "@/hooks/auth.hook";
import { dashboardRouteByRole } from "@/types/user.type";

const routes = [
  { name: "Home", url: "/" },
  { name: "Track a Complaint", url: "/track" },
  { name: "About us", url: "/about-us" },
];

export default function Navbar() {
  const { data, isLoading } = useGetMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const queryClient = useQueryClient();

  const user = data?.data;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        queryClient.removeQueries({ queryKey: ["user"] });
      },
      onError: () => {
        toast.error("Something went wrong logging out");
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            C
          </span>
          CityFix
        </Link>

        <nav className="hidden gap-6 text-sm font-medium md:flex">
          {routes.map((route) => (
            <Link
              key={route.url}
              href={route.url}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {route.name}
            </Link>
          ))}
          {user && (
            <Link
              href={dashboardRouteByRole[user.role]}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!isLoading && !user && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Report an Issue</Link>
              </Button>
            </>
          )}
          {!isLoading && user && (
            <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}