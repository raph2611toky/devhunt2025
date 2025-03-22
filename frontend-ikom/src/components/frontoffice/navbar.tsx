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
    <div className="bg-deep-navy/80 backdrop-blur-md border-b border-white/10 py-2 sticky top-0 z-50 shadow-lg">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full text-white hover:bg-white/10"></Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={activateVoiceReader}
              aria-label="Activer le lecteur vocal"
              className="h-10 w-10 rounded-full text-white hover:bg-white/10">
              <Volume2 className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              aria-label="Aide"
              className="flex items-center gap-1 ml-2 rounded-full px-4 bg-yellow/20 border-yellow/30 text-white hover:bg-yellow/40">
              <HelpCircle className="h-4 w-4" />
              <span>Aide</span>
            </Button>
          </div>

          {/* Section Profil */}
          <div className="flex items-center gap-3">
            <span className="text-white text-sm hidden md:block">
              Jean Dupont
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0 hover:bg-white/10">
                  <Avatar className="h-9 w-9 border-2 border-yellow/30">
                    <AvatarImage
                      src="/placeholder.svg?height=36&width=36"
                      alt="Photo de profil"
                    />
                    <AvatarFallback className="bg-yellow/20 text-white">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Jean Dupont
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      jean.dupont@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mon profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {showHelp && (
          <div className="mt-2 p-4 bg-yellow/10 backdrop-blur-md rounded-lg border border-yellow/30">
            <h3 className="font-bold mb-2 text-white">
              Comment utiliser cette page :
            </h3>
            <ul className="space-y-2 text-blue/90 pl-5">
              <li className="flex items-center gap-2">
                <ZoomIn className="inline h-4 w-4 text-yellow flex-shrink-0" />
                <ZoomOut className="inline h-4 w-4 text-yellow flex-shrink-0 ml-1" />
                <span>Changer la taille du texte</span>
              </li>
              <li className="flex items-center gap-2">
                <Moon className="inline h-4 w-4 text-yellow flex-shrink-0" />
                <Sun className="inline h-4 w-4 text-yellow flex-shrink-0 ml-1" />
                <span>Changer entre le mode clair et sombre</span>
              </li>
              <li className="flex items-center gap-2">
                <Volume2 className="inline h-4 w-4 text-yellow flex-shrink-0" />
                <span>Activer la lecture vocale du contenu</span>
              </li>
            </ul>
            <p className="mt-2 text-white">
              Pour obtenir de l'aide, appelez le 01 23 45 67 89
            </p>
            <Button
              className="mt-4 bg-yellow hover:bg-yellow/80 text-deep-navy font-bold"
              onClick={() => setShowHelp(false)}>
              Fermer l'aide
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
