import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-emerald-900/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-semibold text-emerald-800">
          AgroConnect RDC
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/produits" className="text-stone-700 hover:text-emerald-800">
            Produits
          </Link>
          {user?.role === "PRODUCER" && (
            <Link
              href="/produits/nouveau"
              className="text-stone-700 hover:text-emerald-800"
            >
              Publier
            </Link>
          )}
          {user && (
            <Link href="/commandes" className="text-stone-700 hover:text-emerald-800">
              Commandes
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href="/admin" className="text-stone-700 hover:text-emerald-800">
              Admin
            </Link>
          )}
          {user ? (
            <>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-900">
                {user.name ?? user.phone}
              </span>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/connexion"
              className="rounded-full bg-emerald-700 px-3 py-1.5 text-white hover:bg-emerald-800"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
