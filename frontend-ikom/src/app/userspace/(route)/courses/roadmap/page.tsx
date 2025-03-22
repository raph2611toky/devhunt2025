"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  Play,
  Lock,
  Award,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CourseRoadmap({ params }: { params: { id: string } }) {
  const router = useRouter();
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
    <div className="min-h-screen bg-gradient-to-b from-light-grey to-blue/20 text-soft-black">
      {/* En-tête */}
      <header className="py-8  mb-6">
        <div className="container px-4 mx-auto max-w-5xl">
          <Button
            onClick={() => router.back()}
            className="inline-flex items-center text-blue hover:text-yellow mb-6 transition-all duration-300 hover:scale-105 bg-white px-4 py-2 rounded-xl border border-blue">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour aux cours
          </Button>

          <div className="bg-white rounded-3xl p-6 border border-soft-grey">
            <h1 className="text-3xl md:text-4xl font-extrabold text-soft-black mb-2">
              {course.title}
            </h1>
            <p className="text-grey text-lg">Votre parcours d'apprentissage</p>
          </div>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="container mx-auto max-w-5xl px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Progression */}
          <div className="md:col-span-2 bg-green/20 rounded-3xl p-6 border-2 border-green">
            <h2 className="text-xl font-bold text-soft-black mb-4">
              Votre progression
            </h2>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-grow h-4 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue to-green rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="font-extrabold text-2xl text-soft-black">
                {progressPercentage}%
              </span>
            </div>
            <p className="mt-2 text-center text-grey">
              {completedLessons} leçons terminées sur {totalLessons}
            </p>
          </div>

          {/* Aide */}
          <div className="bg-yellow/20 rounded-3xl p-6 border-2 border-yellow">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-2 bg-white border-yellow text-yellow hover:bg-yellow/10 font-bold"
              onClick={() => setShowHelp(!showHelp)}>
              <HelpCircle className="h-5 w-5" />
              <span>Comment utiliser la roadmap ?</span>
            </Button>

            {showHelp && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-yellow">
                <h3 className="font-bold mb-2 text-soft-black">
                  Comment utiliser la roadmap :
                </h3>
                <ul className="space-y-2 text-grey pl-5">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green flex-shrink-0" />
                    <span>Modules terminés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-blue flex-shrink-0" />
                    <span>Modules en cours</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-grey flex-shrink-0" />
                    <span>Modules verrouillés</span>
                  </li>
                </ul>
                <Button
                  className="mt-4 bg-yellow hover:bg-yellow/90 text-soft-black font-bold"
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
            <div
              key={moduleIndex}
              className={`rounded-3xl overflow-hidden border-2 ${
                module.completed
                  ? "bg-green/20 border-green"
                  : module.locked
                  ? "bg-soft-grey/20 border-soft-grey"
                  : "bg-blue/20 border-blue"
              }`}>
              <div className="p-6 flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    module.completed
                      ? "bg-green/30 text-green"
                      : module.locked
                      ? "bg-soft-grey/30 text-grey"
                      : "bg-blue/30 text-blue"
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
                  <h3 className="text-xl font-bold text-soft-black">
                    Module {moduleIndex + 1}: {module.title}
                  </h3>
                  <p className="text-grey">
                    {module.lessons.filter((l) => l.completed).length} /{" "}
                    {module.lessons.length} leçons terminées
                  </p>
                </div>

                {!module.locked && (
                  <Button
                    size="lg"
                    className={`text-lg ${
                      module.completed
                        ? "bg-green hover:bg-green/90 text-white border border-green"
                        : "bg-blue hover:bg-blue/90 text-white border border-blue"
                    }`}
                    disabled={module.locked}>
                    {module.completed ? "Revoir" : "Continuer"}
                  </Button>
                )}
              </div>

              {!module.locked && (
                <div className="bg-white p-6 border-t border-soft-grey">
                  <ul className="space-y-4">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lessonIndex} className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            lesson.completed
                              ? "bg-green/20 text-green"
                              : "bg-blue/20 text-blue"
                          }`}>
                          {lesson.completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </div>
                        <span className="text-lg text-soft-black">
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
        <div className="mt-10 bg-yellow/20 rounded-3xl p-8 border border-yellow text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="h-10 w-10 text-yellow" />
            <h3 className="text-2xl font-extrabold text-soft-black">
              Certificat de réussite
            </h3>
          </div>
          <p className="text-lg mb-6 text-grey">
            Terminez tous les modules pour obtenir votre certificat !
          </p>
          <div className="w-full bg-white h-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow to-yellow/70 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-lg text-soft-black">
            {progressPercentage}% complété
          </p>
          <Button
            size="lg"
            className="mt-6 text-lg px-8 py-6 bg-yellow hover:bg-yellow/90 text-soft-black font-bold border border-yellow"
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
