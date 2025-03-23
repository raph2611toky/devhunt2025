"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  HelpCircle,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function CoursePage({ params }: { params: { id: string } }) {
  const course = {
    id: params.id,
    title: "Utiliser un ordinateur - Niveau débutant",
    description:
      "Apprenez les bases de l'utilisation d'un ordinateur, de la souris et du clavier. Ce cours est adapté pour les débutants complets.",
    image: "/placeholder.svg?height=400&width=800",
    level: "Débutant",
    adaptations: ["Visuel", "Moteur"],
    modules: [
      {
        title: "Découvrir l'ordinateur",
        lessons: [
          {
            title: "Allumer et éteindre l'ordinateur",
            duration: "10 min",
            completed: true,
          },
          { title: "Utiliser la souris", duration: "15 min", completed: true },
          {
            title: "Utiliser le clavier",
            duration: "15 min",
            completed: false,
          },
        ],
      },
      {
        title: "Utiliser les programmes de base",
        lessons: [
          {
            title: "Ouvrir et fermer un programme",
            duration: "10 min",
            completed: false,
          },
          {
            title: "Écrire un texte simple",
            duration: "20 min",
            completed: false,
          },
          {
            title: "Enregistrer un document",
            duration: "10 min",
            completed: false,
          },
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
          <Link href="/courses">
            <Button className="inline-flex items-center bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black mb-6 hover:-translate-y-1 transition-transform">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retour aux cours
            </Button>
          </Link>
          <h1 className="text-4xl font-extrabold text-black mb-3">
            {course.title}
          </h1>
          <div className="flex flex-wrap gap-3">
            <span className="bg-yellow text-black px-4 py-1 font-bold border-2 border-black">
              Niveau: {course.level}
            </span>
            {course.adaptations.map((adaptation, i) => (
              <span
                key={i}
                className="bg-black text-yellow px-4 py-1 font-bold border-2 border-yellow">
                {adaptation}
              </span>
            ))}
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Image du cours */}
          <div className="md:col-span-2 bg-gray-200 border-2 border-black">
            <div className="relative">
              <img
                src={course.image || "/placeholder.svg"}
                alt={`Image du cours: ${course.title}`}
                className="w-full h-auto object-cover border-b-2 border-black"
              />
            </div>
          </div>

          {/* Progression */}
          <div className="bg-yellow border-2 border-black p-6">
            <h2 className="text-xl font-extrabold text-black mb-4">
              VOTRE PROGRESSION
            </h2>
            <div className="flex items-center gap-4 mb-3">
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
            <p className="text-black font-bold text-center mb-6">
              {completedLessons}/{totalLessons} leçons terminées
            </p>
            <Link href={`/courses/${params.id}/roadmap`}>
              <Button className="w-full bg-black hover:bg-gray-800 text-yellow font-bold border-2 border-yellow hover:-translate-y-1 transition-transform">
                <MapPin className="h-5 w-5 mr-2" />
                Ma roadmap
              </Button>
            </Link>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-200 border-2 border-black p-6 mb-8">
          <h2 className="text-2xl font-extrabold text-black mb-4">
            À PROPOS DE CE COURS
          </h2>
          <p className="text-black font-bold text-lg">{course.description}</p>
          <div className="mt-6 bg-yellow border-2 border-black p-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-6 w-6 text-black mt-1" />
              <div>
                <p className="font-extrabold text-black">
                  Comment suivre ce cours ?
                </p>
                <p className="text-black font-bold">
                  Cliquez sur "Commencer" pour chaque leçon et progressez à
                  votre rythme.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu du cours */}
        <h2 className="text-2xl font-extrabold text-black mb-6">
          CONTENU DU COURS
        </h2>
        <div className="space-y-6">
          {course.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="bg-white border-2 border-black">
              <div className="bg-black p-6 border-b-2 border-yellow">
                <h3 className="text-xl font-extrabold text-yellow">
                  Module {moduleIndex + 1} : {module.title}
                </h3>
              </div>
              <div className="divide-y divide-black">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="p-6 flex items-center justify-between hover:bg-yellow/20 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-black ${
                          lesson.completed
                            ? "bg-yellow text-black"
                            : "bg-white text-black"
                        }`}>
                        {lesson.completed ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <p className="font-extrabold text-lg text-black">
                          Leçon {moduleIndex + 1}.{lessonIndex + 1} :{" "}
                          {lesson.title}
                        </p>
                        <p className="text-black font-bold">
                          {lesson.duration}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className={
                        lesson.completed
                          ? "bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform"
                          : "bg-black hover:bg-gray-800 text-yellow font-bold border-2 border-yellow hover:-translate-y-1 transition-transform"
                      }>
                      {lesson.completed ? "Revoir" : "Commencer"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Section d’aide */}
        <div className="mt-10 bg-black border-2 border-yellow p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-yellow" />
            <h3 className="text-2xl font-extrabold text-yellow">
              BESOIN D’AIDE ?
            </h3>
          </div>
          <p className="text-yellow font-bold text-lg mb-6">
            Nos formateurs sont là pour vous accompagner à chaque étape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform">
              Contacter un formateur
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-black border-2 border-yellow text-yellow hover:bg-yellow hover:text-black font-bold transition-transform hover:-translate-y-1">
              FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
