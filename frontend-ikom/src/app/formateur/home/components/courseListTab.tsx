import { Button } from "@/components/ui/button";

export default function CourseListTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-200 border-2 border-black p-6">
        <h2 className="text-2xl font-extrabold text-black mb-4">BROUILLONS</h2>
        <div className="space-y-4">
          <div className="bg-white border-2 border-black p-4 hover:bg-yellow transition-colors">
            <p className="text-lg font-bold text-black">Apprendre à coder</p>
            <p className="text-sm font-bold text-black">3 modules</p>
            <Button
              size="sm"
              className="mt-2 bg-black hover:bg-gray-800 text-yellow font-bold border-2 border-yellow hover:-translate-y-1 transition-transform">
              Modifier
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 border-2 border-black p-6">
        <h2 className="text-2xl font-extrabold text-black mb-4">
          COURS PUBLIÉS
        </h2>
        <div className="space-y-4">
          <div className="bg-white border-2 border-black p-4 hover:bg-yellow transition-colors">
            <p className="text-lg font-bold text-black">Utiliser un PC</p>
            <p className="text-sm font-bold text-black">12 étudiants</p>
          </div>
        </div>
      </div>
    </div>
  );
}
