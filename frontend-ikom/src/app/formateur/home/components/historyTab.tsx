export default function HistoryTab() {
  return (
    <div className="bg-gray-200 border-2 border-black p-6">
      <h2 className="text-2xl font-extrabold text-black mb-4">
        HISTORIQUE DES ACTIONS
      </h2>
      <div className="space-y-4">
        <div className="bg-white border-2 border-black p-4">
          <p className="text-lg font-bold text-black">
            Cours "Utiliser un PC" publié
          </p>
          <p className="text-sm font-bold text-black">22/03/2025 - 14:32</p>
        </div>
        <div className="bg-white border-2 border-black p-4">
          <p className="text-lg font-bold text-black">
            Module ajouté à "Cuisine de base"
          </p>
          <p className="text-sm font-bold text-black">20/03/2025 - 09:15</p>
        </div>
      </div>
    </div>
  );
}
