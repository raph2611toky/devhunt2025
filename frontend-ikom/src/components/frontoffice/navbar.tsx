"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Volume2,
  HelpCircle,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [showHelp, setShowHelp] = useState(false);

  const activateVoiceReader = () => {
    alert(
      "Lecteur vocal activé. Cette fonctionnalité serait implémentée avec une vraie API de synthèse vocale."
    );
  };

  return (
    <div className="bg-white border-b-[.15rem] border-black py-4 sticky top-0 z-50">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Section gauche : Boutons de contrôle */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={activateVoiceReader}
              aria-label="Activer le lecteur vocal"
              className="h-12 w-12 bg-yellow border-2 border-black text-black hover:bg-yellow/80 hover:-translate-y-1 transition-transform">
              <Volume2 className="h-6 w-6" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              aria-label="Aide"
              className="h-12 flex items-center gap-2 px-6 py-3 bg-yellow border-2 border-black text-black font-bold hover:bg-yellow/80 hover:-translate-y-1 transition-transform">
              <HelpCircle className="h-5 w-5" />
              <span>AIDE</span>
            </Button>
          </div>

          {/* Section droite : Profil */}
          <div className="flex items-center gap-4">
            <span className="text-black text-lg font-bold hidden md:block">
              JEAN DUPONT
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-12 w-12 p-4 bg-yellow border border-black text-black hover:bg-yellow/80 hover:-translate-y-1 transition-transform">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="Photo de profil"
                    />
                    <AvatarFallback className=" text-black bg-yellow font-bold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border-[.15rem] border-black text-black">
                <DropdownMenuLabel className="font-bold">
                  <div className="flex flex-col space-y-1">
                    <p className="text-lg font-extrabold">Jean Dupont</p>
                    <p className="text-sm text-gray-600">
                      jean.dupont@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-yellow h-1" />
                <DropdownMenuItem className="text-lg font-bold hover:bg-yellow hover:text-black hover:-translate-y-1 transition-transform">
                  <User className="mr-2 h-5 w-5" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-lg font-bold hover:bg-yellow hover:text-black hover:-translate-y-1 transition-transform">
                  <Settings className="mr-2 h-5 w-5" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-yellow h-1" />
                <DropdownMenuItem className="text-lg font-bold hover:bg-yellow hover:text-black hover:-translate-y-1 transition-transform">
                  <LogOut className="mr-2 h-5 w-5" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Section Aide */}
        {showHelp && (
          <div className="mt-4 p-6 bg-yellow border-[.15rem] border-black rounded-none">
            <h3 className="font-extrabold text-2xl mb-4 text-black">
              COMMENT UTILISER CETTE PAGE :
            </h3>
            <ul className="space-y-3 text-black font-bold text-lg pl-5">
              <li className="flex items-center gap-3">
                <ZoomIn className="h-6 w-6 text-black" />
                <ZoomOut className="h-6 w-6 text-black ml-1" />
                <span>CHANGER LA TAILLE DU TEXTE</span>
              </li>
              <li className="flex items-center gap-3">
                <Moon className="h-6 w-6 text-black" />
                <Sun className="h-6 w-6 text-black ml-1" />
                <span>CLAIR / SOMBRE</span>
              </li>
              <li className="flex items-center gap-3">
                <Volume2 className="h-6 w-6 text-black" />
                <span>LECTURE VOCALE</span>
              </li>
            </ul>
            <p className="mt-4 text-black font-bold text-lg">
              AIDE : 01 23 45 67 89
            </p>
            <Button
              className="mt-6 bg-black hover:bg-gray-800 text-yellow font-extrabold text-lg border-4 border-yellow hover:-translate-y-1 transition-transform"
              onClick={() => setShowHelp(false)}>
              FERMER
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
