import Link from "next/link";

const links = [
  { href: "/auth/login", label: "Connexion" },
  { href: "/auth/register", label: "Créer un compte" },
];

export default function Navbar() {
  return (
    <header className="border-b border-gray-800 bg-gray-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-wide text-green-400">
          TERANGA
        </Link>

        <nav className="flex items-center gap-3 text-sm text-gray-300">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-gray-700 px-3 py-2 transition hover:border-green-500 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
