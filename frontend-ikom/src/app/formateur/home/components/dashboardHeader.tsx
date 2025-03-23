import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button className="inline-flex items-center bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour à l'accueil
          </Button>
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold text-black">
          TABLEAU DE BORD - FORMATEUR
        </h1>
      </div>
    </header>
  );
}
