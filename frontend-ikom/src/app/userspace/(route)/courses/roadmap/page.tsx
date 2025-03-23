"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  Play,
  Lock,
  Award,
  HelpCircle,
} from "lucide-react";

export default function CourseRoadmap({ params }: { params: { id: string } }) {
  const [showHelp, setShowHelp] = useState(false);

  const course = {
    id: params.id,
    title: "Utiliser un ordinateur - Niveau débutant",
    modules: [
      {
        title: "Découvrir l'ordinateur",
        completed: true,
        lessons: [
          { title: "Allumer et éteindre l'ordinateur", completed: true },
          { title: "Utiliser la souris", completed: true },
          { title: "Utiliser le clavier", completed: true },
        ],
      },
      {
        title: "Utiliser les programmes de base",
        completed: false,
        lessons: [
          { title: "Ouvrir et fermer un programme", completed: true },
          { title: "Écrire un texte simple", completed: false },
          { title: "Enregistrer un document", completed: false },
        ],
      },
      {
        title: "Naviguer sur internet",
        completed: false,
        locked: true,
        lessons: [
          { title: "Ouvrir un navigateur", completed: false },
          { title: "Visiter un site web", completed: false },
          { title: "Faire une recherche", completed: false },
        ],
      },
      {
        title: "Communiquer en ligne",
        completed: false,
        locked: true,
        lessons: [
          { title: "Créer une adresse email", completed: false },
          { title: "Envoyer un email", completed: false },
          { title: "Participer à un appel vidéo", completed: false },
        ],
      },
    ],
  };

  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  const completedLessons = course.modules.reduce(
    (acc, module) =>
      acc + module.lessons.filter((lesson) => lesson.completed).length,
    0
  );
  const progressPercentage = Math.round(
    (completedLessons / totalLessons) * 100
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-gray-100 border-[.15rem] border-black p-6">
        {/* En-tête */}
        <header className="mb-6">
          <Link href={`/courses/${params.id}`}>
            <Button className="inline-flex items-center bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black mb-6 hover:-translate-y-1 transition-transform">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retour au cours
            </Button>
          </Link>
          <h1 className="text-4xl font-extrabold text-black mb-2">
            {course.title}
          </h1>
          <p className="text-xl font-bold text-black">
            VOTRE PARCOURS D'APPRENTISSAGE
          </p>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Progression */}
          <div className="md:col-span-2 bg-yellow border-2 border-black p-6">
            <h2 className="text-xl font-extrabold text-black mb-4">
              VOTRE PROGRESSION
            </h2>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-grow h-4 bg-white border-2 border-black overflow-hidden">
                <div
                  className="h-full bg-black"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="font-extrabold text-2xl text-black">
                {progressPercentage}%
              </span>
            </div>
            <p className="mt-2 text-center text-black font-bold">
              {completedLessons} leçons terminées sur {totalLessons}
            </p>
          </div>

          {/* Aide */}
          <div className="bg-gray-200 border-2 border-black p-6">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-black text-black hover:bg-yellow font-bold hover:-translate-y-1 transition-transform"
              onClick={() => setShowHelp(!showHelp)}>
              <HelpCircle className="h-5 w-5" />
              <span>COMMENT UTILISER LA ROADMAP ?</span>
            </Button>

            {showHelp && (
              <div className="mt-4 p-4 bg-white border-2 border-black">
                <h3 className="font-extrabold text-black mb-2">
                  COMMENT UTILISER LA ROADMAP :
                </h3>
                <ul className="space-y-2 text-black font-bold pl-5">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-black flex-shrink-0" />
                    <span>Modules terminés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-black flex-shrink-0" />
                    <span>Modules en cours</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-black flex-shrink-0" />
                    <span>Modules verrouillés</span>
                  </li>
                </ul>
                <Button
                  className="mt-4 bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform"
                  onClick={() => setShowHelp(false)}>
                  Fermer l'aide
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Roadmap visuelle */}
        <div className="space-y-6">
          {course.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className={`bg-white border-2 border-black`}>
              <div
                className={`p-6 flex items-center gap-4 ${
                  module.completed
                    ? "bg-yellow border-b-2 border-black"
                    : module.locked
                    ? "bg-gray-200 border-b-2 border-black"
                    : "bg-black border-b-2 border-yellow"
                }`}>
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-black ${
                    module.completed
                      ? "bg-white text-black"
                      : module.locked
                      ? "bg-gray-300 text-black"
                      : "bg-yellow text-black"
                  }`}>
                  {module.completed ? (
                    <CheckCircle className="h-7 w-7" />
                  ) : module.locked ? (
                    <Lock className="h-7 w-7" />
                  ) : (
                    <Play className="h-7 w-7" />
                  )}
                </div>

                <div className="flex-grow">
                  <h3
                    className={`text-xl font-extrabold ${
                      module.completed || module.locked
                        ? "text-black"
                        : "text-yellow"
                    }`}>
                    Module {moduleIndex + 1}: {module.title}
                  </h3>
                  <p
                    className={`${
                      module.completed || module.locked
                        ? "text-black"
                        : "text-yellow"
                    } font-bold`}>
                    {module.lessons.filter((l) => l.completed).length} /{" "}
                    {module.lessons.length} leçons terminées
                  </p>
                </div>

                {!module.locked && (
                  <Button
                    size="lg"
                    className={`text-lg ${
                      module.completed
                        ? "bg-yellow hover:bg-yellow/80 text-black border-2 border-black hover:-translate-y-1 transition-transform"
                        : "bg-black hover:bg-gray-800 text-yellow border-2 border-yellow hover:-translate-y-1 transition-transform"
                    }`}
                    disabled={module.locked}>
                    {module.completed ? "Revoir" : "Continuer"}
                  </Button>
                )}
              </div>

              {!module.locked && (
                <div className="bg-white p-6">
                  <ul className="space-y-4">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lessonIndex} className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-black ${
                            lesson.completed
                              ? "bg-yellow text-black"
                              : "bg-white text-black"
                          }`}>
                          {lesson.completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </div>
                        <span className="text-lg font-bold text-black">
                          {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Certification */}
        <div className="mt-10 bg-black border-2 border-yellow p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="h-10 w-10 text-yellow" />
            <h3 className="text-2xl font-extrabold text-yellow">
              CERTIFICAT DE RÉUSSITE
            </h3>
          </div>
          <p className="text-lg font-bold text-yellow mb-6">
            Terminez tous les modules pour obtenir votre certificat !
          </p>
          <div className="w-full bg-white h-4 border-2 border-black overflow-hidden">
            <div
              className="h-full bg-yellow"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-lg font-bold text-yellow">
            {progressPercentage}% complété
          </p>
          <Button
            size="lg"
            className={`mt-6 text-lg px-8 py-6 ${
              progressPercentage < 100
                ? "bg-gray-200 text-black border-2 border-black cursor-not-allowed"
                : "bg-yellow hover:bg-yellow/80 text-black border-2 border-black hover:-translate-y-1 transition-transform"
            }`}
            disabled={progressPercentage < 100}>
            {progressPercentage < 100
              ? "Certificat non disponible"
              : "Obtenir mon certificat"}
          </Button>
        </div>
      </div>
    </div>
  );
}
