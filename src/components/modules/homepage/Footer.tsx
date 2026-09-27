import Link from "next/link";

const columns = [
  {
    title: "Platform",
    links: [
      { name: "Report an Issue", url: "/register" },
      { name: "Track a Complaint", url: "/track" },
      { name: "About us", url: "/about-us" },
    ],
  },
  {
    title: "Departments",
    links: [
      { name: "Roads & Infrastructure", url: "/departments" },
      { name: "Waste Management", url: "/departments" },
      { name: "Water & Sanitation", url: "/departments" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Contact us", url: "/contact" },
      { name: "FAQ", url: "/faq" },
      { name: "Privacy Policy", url: "/privacy" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                C
              </span>
              CityFix
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              A platform for citizens to report and track civic issues with
              their city.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.url}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {year} CityFix. All rights reserved.</p>
          <p>City Complaint & Service Management Platform</p>
        </div>
      </div>
    </footer>
  );
}