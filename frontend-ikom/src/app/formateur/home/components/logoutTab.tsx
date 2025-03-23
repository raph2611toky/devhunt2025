import { Button } from "@/components/ui/button";

export default function LogoutTab() {
  return (
    <div className="bg-black border-2 border-yellow p-6 text-center">
      <h2 className="text-2xl font-extrabold text-yellow mb-4">DÉCONNEXION</h2>
      <p className="text-lg font-bold text-yellow mb-6">
        Voulez-vous vraiment vous déconnecter ?
      </p>
      <Button
        size="lg"
        className="bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform">
        Confirmer la déconnexion
      </Button>
    </div>
  );
}
