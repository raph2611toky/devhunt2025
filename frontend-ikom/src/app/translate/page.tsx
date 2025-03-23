"use client";

import { useState, type ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Video,
  FileText,
  Upload,
  Check,
  X,
  Headphones,
  Languages,
  Volume2,
  Mic,
  Loader2,
  Info,
} from "lucide-react";

export default function TranslateTools() {
  const [activeTab, setActiveTab] = useState<"video" | "pdf">("video");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("fr");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Langues disponibles
  const languages = [
    { code: "fr", name: "Français" },
    { code: "en", name: "Anglais" },
    { code: "es", name: "Espagnol" },
    { code: "de", name: "Allemand" },
    { code: "it", name: "Italien" },
    { code: "pt", name: "Portugais" },
  ];

  // Gestion de l'upload de la vidéo
  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    } else {
      setVideoPreview(null);
    }
  };

  // Gestion de l'upload du PDF
  const handlePdfUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPdfFile(file);
  };

  // Soumission pour traduction vidéo
  const onVideoSubmit = () => {
    if (!videoFile) {
      alert("Veuillez sélectionner une vidéo.");
      return;
    }
    setIsLoadingVideo(true);
    setProgress(0);

    // Simulation de progression
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoadingVideo(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  // Soumission pour conversion PDF en parole
  const onPdfSubmit = () => {
    if (!pdfFile) {
      alert("Veuillez sélectionner un fichier PDF.");
      return;
    }
    setIsLoadingPdf(true);
    setProgress(0);

    // Simulation de progression
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoadingPdf(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const triggerVideoFileInput = () => {
    videoInputRef.current?.click();
  };

  const triggerPdfFileInput = () => {
    pdfInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue/5 to-violet/5 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-soft-black">
            Outils de Traduction Intelligents
          </h1>
          <p className="text-grey mt-2">
            Convertissez facilement vos médias en différentes langues
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Panneau principal - 2 colonnes */}
          <div className="md:col-span-2 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-soft-grey/20 overflow-hidden">
            {/* Onglets */}
            <div className="flex">
              <button
                onClick={() => setActiveTab("video")}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 transition-all ${
                  activeTab === "video"
                    ? "bg-blue/10 text-blue border-b-2 border-blue"
                    : "bg-white/60 text-grey hover:bg-blue/5"
                }`}>
                <Video className="h-5 w-5" />
                <span className="font-medium">Traduire une Vidéo</span>
              </button>
              <button
                onClick={() => setActiveTab("pdf")}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 transition-all ${
                  activeTab === "pdf"
                    ? "bg-blue/10 text-blue border-b-2 border-blue"
                    : "bg-white/60 text-grey hover:bg-blue/5"
                }`}>
                <FileText className="h-5 w-5" />
                <span className="font-medium">PDF vers Parole</span>
              </button>
            </div>

            {/* Contenu des onglets */}
            <div className="p-6">
              {activeTab === "video" && (
                <div className="space-y-6">
                  {!videoFile ? (
                    <div
                      onClick={triggerVideoFileInput}
                      className="border-2 border-dashed border-soft-grey/30 rounded-xl p-8 text-center cursor-pointer hover:bg-blue/5 transition-colors">
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        disabled={isLoadingVideo}
                      />
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center mb-4">
                          <Upload className="h-8 w-8 text-blue" />
                        </div>
                        <h3 className="text-lg font-medium text-soft-black mb-2">
                          Déposez votre vidéo ici
                        </h3>
                        <p className="text-grey text-sm mb-4">
                          ou cliquez pour parcourir vos fichiers
                        </p>
                        <p className="text-xs text-grey">
                          Formats supportés: MP4, AVI, MOV, WMV (max 500MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative rounded-xl overflow-hidden bg-soft-black/5">
                        {videoPreview && (
                          <video
                            src={videoPreview}
                            className="w-full h-64 object-cover"
                            controls
                          />
                        )}
                        <button
                          onClick={() => {
                            setVideoFile(null);
                            setVideoPreview(null);
                          }}
                          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-full hover:bg-white">
                          <X className="h-5 w-5 text-soft-black" />
                        </button>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1">
                          <p className="text-soft-black font-medium truncate">
                            {videoFile.name}
                          </p>
                          <p className="text-grey text-sm">
                            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sélection de langue */}
                  <div className="bg-blue/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Languages className="h-5 w-5 text-blue" />
                      <h3 className="font-medium text-soft-black">
                        Langue cible
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setSelectedLanguage(lang.code)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            selectedLanguage === lang.code
                              ? "bg-blue text-white"
                              : "bg-white/70 text-grey hover:bg-blue/10 hover:text-blue"
                          }`}>
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isLoadingVideo && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-grey">
                          Traduction en cours...
                        </span>
                        <span className="text-blue font-medium">
                          {progress}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  {showSuccess && !isLoadingVideo && (
                    <div className="bg-green/10 text-green rounded-lg p-4 flex items-center gap-3">
                      <div className="bg-green/20 rounded-full p-1">
                        <Check className="h-5 w-5" />
                      </div>
                      <p className="font-medium">
                        Traduction terminée avec succès !
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={onVideoSubmit}
                    disabled={isLoadingVideo || !videoFile}
                    className="w-full h-12 bg-blue hover:bg-blue/90 text-white font-medium transition-all disabled:opacity-50">
                    {isLoadingVideo ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Traduction en cours...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Languages className="h-5 w-5 mr-2" />
                        Traduire la Vidéo
                      </span>
                    )}
                  </Button>
                </div>
              )}

              {activeTab === "pdf" && (
                <div className="space-y-6">
                  {!pdfFile ? (
                    <div
                      onClick={triggerPdfFileInput}
                      className="border-2 border-dashed border-soft-grey/30 rounded-xl p-8 text-center cursor-pointer hover:bg-violet/5 transition-colors">
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        className="hidden"
                        disabled={isLoadingPdf}
                      />
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-violet/10 rounded-full flex items-center justify-center mb-4">
                          <Upload className="h-8 w-8 text-violet" />
                        </div>
                        <h3 className="text-lg font-medium text-soft-black mb-2">
                          Déposez votre PDF ici
                        </h3>
                        <p className="text-grey text-sm mb-4">
                          ou cliquez pour parcourir vos fichiers
                        </p>
                        <p className="text-xs text-grey">
                          Format supporté: PDF (max 100MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-violet/10 rounded-xl p-4 flex items-center gap-4">
                        <div className="bg-violet/20 p-3 rounded-lg">
                          <FileText className="h-8 w-8 text-violet" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-soft-black font-medium truncate">
                            {pdfFile.name}
                          </p>
                          <p className="text-grey text-sm">
                            {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => setPdfFile(null)}
                          className="bg-white/80 backdrop-blur-sm p-1 rounded-full hover:bg-white">
                          <X className="h-5 w-5 text-soft-black" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Options de voix */}
                  <div className="bg-violet/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Mic className="h-5 w-5 text-violet" />
                      <h3 className="font-medium text-soft-black">
                        Options de voix
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/70 rounded-lg p-3 border border-soft-grey/20">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="voice"
                            defaultChecked
                            className="accent-violet"
                          />
                          <span className="text-soft-black">Voix féminine</span>
                        </label>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3 border border-soft-grey/20">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="voice"
                            className="accent-violet"
                          />
                          <span className="text-soft-black">
                            Voix masculine
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {isLoadingPdf && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-grey">
                          Conversion en cours...
                        </span>
                        <span className="text-violet font-medium">
                          {progress}%
                        </span>
                      </div>
                      <Progress
                        value={progress}
                        className="h-2 bg-violet/20 [&>div]:bg-violet"
                      />
                    </div>
                  )}

                  {showSuccess && !isLoadingPdf && (
                    <div className="bg-green/10 text-green rounded-lg p-4 flex items-center gap-3">
                      <div className="bg-green/20 rounded-full p-1">
                        <Check className="h-5 w-5" />
                      </div>
                      <p className="font-medium">
                        Conversion terminée avec succès !
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={onPdfSubmit}
                    disabled={isLoadingPdf || !pdfFile}
                    className="w-full h-12 bg-violet hover:bg-violet/90 text-white font-medium transition-all disabled:opacity-50">
                    {isLoadingPdf ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Conversion en cours...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Volume2 className="h-5 w-5 mr-2" />
                        Convertir en Parole
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Panneau d'information - 1 colonne */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-6 border border-soft-grey/20">
              <h2 className="text-lg font-medium text-soft-black mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue" />
                Comment ça marche
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue/10 rounded-full flex items-center justify-center text-blue text-sm flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-grey text-sm">
                    {activeTab === "video"
                      ? "Téléchargez votre vidéo dans n'importe quel format courant"
                      : "Téléchargez votre document PDF contenant du texte"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue/10 rounded-full flex items-center justify-center text-blue text-sm flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-grey text-sm">
                    {activeTab === "video"
                      ? "Sélectionnez la langue cible pour la traduction"
                      : "Choisissez les options de voix pour la conversion"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue/10 rounded-full flex items-center justify-center text-blue text-sm flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-grey text-sm">
                    {activeTab === "video"
                      ? "Notre IA traduit automatiquement l'audio de votre vidéo"
                      : "Notre IA convertit le texte en parole naturelle"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue/10 rounded-full flex items-center justify-center text-blue text-sm flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <p className="text-grey text-sm">
                    {activeTab === "video"
                      ? "Téléchargez votre vidéo traduite avec sous-titres"
                      : "Téléchargez le fichier audio généré"}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`bg-${
                activeTab === "video" ? "blue" : "violet"
              }/10 backdrop-blur-md rounded-xl shadow-md p-6 border border-${
                activeTab === "video" ? "blue" : "violet"
              }/20`}>
              <h2 className="text-lg font-medium text-soft-black mb-4 flex items-center gap-2">
                {activeTab === "video" ? (
                  <Video className="h-5 w-5 text-blue" />
                ) : (
                  <Headphones className="h-5 w-5 text-violet" />
                )}
                {activeTab === "video" ? "Traduction vidéo" : "PDF vers parole"}
              </h2>
              <p className="text-grey text-sm mb-4">
                {activeTab === "video"
                  ? "Notre technologie d'IA avancée traduit l'audio de vos vidéos tout en conservant la voix originale et l'intonation."
                  : "Convertissez n'importe quel document PDF en audio naturel pour l'écouter en déplacement ou améliorer l'accessibilité."}
              </p>
              <div className="bg-white/50 rounded-lg p-3 border border-soft-grey/20">
                <p className="text-xs text-grey">
                  {activeTab === "video"
                    ? "Supporte plus de 30 langues avec une précision de traduction de 95%"
                    : "Voix naturelles disponibles dans 20 langues différentes"}
                </p>
              </div>
            </div>

            <div className="bg-green/10 backdrop-blur-md rounded-xl shadow-md p-6 border border-green/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green/20 rounded-full p-2">
                  <Check className="h-5 w-5 text-green" />
                </div>
                <h3 className="font-medium text-soft-black">Avantages</h3>
              </div>
              <ul className="space-y-2 text-grey text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green mt-0.5 flex-shrink-0" />
                  <span>Traitement rapide et sécurisé</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green mt-0.5 flex-shrink-0" />
                  <span>Haute qualité de traduction et de synthèse vocale</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green mt-0.5 flex-shrink-0" />
                  <span>Téléchargement facile des résultats</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
