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
import { useRouter } from "next/navigation";

export default function CoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const course = {
    id: params.id,
    title: "Utiliser un ordinateur - Niveau débutant",
    description:
      "Apprenez les bases de l'utilisation d'un ordinateur, de la souris et du clavier. Ce cours est adapté pour les débutants complets.",
    image: "/assets/images/img.png",
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
    <div className="min-h-screen bg-gradient-to-b from-light-grey to-rose/20 text-soft-black">
      {/* En-tête */}
      <header className="container py-8">
        <div className="mx-auto px-4 max-w-5xl">
          <Button
            onClick={() => router.back()}
            className="inline-flex items-center text-blue hover:text-yellow mb-6 transition-all duration-300 hover:scale-105 bg-white px-4 py-2 rounded-xl">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour aux cours
          </Button>

          <div className="bg-white rounded-3xl p-6 border border-black">
            <h1 className="text-3xl md:text-4xl font-extrabold text-soft-black mb-3 tracking-tight">
              {course.title}
            </h1>
            <div className="flex flex-wrap gap-3">
              <span className="bg-blue/20 text-blue px-4 py-1 rounded-full font-medium border border-black">
                Niveau: {course.level}
              </span>
              {course.adaptations.map((adaptation, i) => (
                <span
                  key={i}
                  className="bg-green/20 text-green px-4 py-1 rounded-full font-medium border border-green">
                  {adaptation}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="container mx-auto max-w-5xl px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Image du cours */}
          <div className="md:col-span-2 bg-yellow/20 rounded-3xl overflow-hidden border-2 border-yellow">
            <div className="relative">
              <img
                src={course.image || "/placeholder.svg"}
                alt={`Image du cours: ${course.title}`}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-soft-black/40"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-white text-xl font-semibold">
                  Plongez dans l’apprentissage dès maintenant !
                </p>
              </div>
            </div>
          </div>

          {/* Progression */}
          <div className="bg-green/20 rounded-3xl p-6 border-2 h-fit border-green">
            <h2 className="text-xl font-bold text-soft-black mb-4">
              Votre progression
            </h2>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-grow h-4 bg-white rounded-full overflow-hidden border ">
                <div
                  className="h-full bg-blue rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="font-extrabold text-2xl text-soft-black">
                {progressPercentage}%
              </span>
            </div>
            <p className="text-soft-black text-center mb-6 font-medium">
              {completedLessons}/{totalLessons} leçons terminées
            </p>
            <Link href={`/courses/${params.id}/roadmap`}>
              <Button
                size="lg"
                className="w-full bg-yellow hover:bg-yellow/80 text-soft-black font-bold border border-yellow transition-all duration-300">
                <MapPin className="h-5 w-5 mr-2" />
                Ma roadmap
              </Button>
            </Link>
          </div>
        </div>

        {/* Description */}
        <div className="bg-violet/20 rounded-3xl p-6 border-2 border-violet mb-8">
          <h2 className="text-2xl font-bold text-soft-black mb-4">
            À propos de ce cours
          </h2>
          <p className="text-soft-black text-lg font-medium">
            {course.description}
          </p>
          <div className="mt-6 bg-blue/10 p-4 rounded-xl border border-black">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-6 w-6 text-blue mt-1" />
              <div>
                <p className="font-semibold text-soft-black">
                  Comment suivre ce cours ?
                </p>
                <p className="text-soft-black font-medium">
                  Cliquez sur "Commencer" pour chaque leçon et progressez à
                  votre rythme.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu du cours */}
        <h2 className="text-2xl font-extrabold text-soft-black mb-6">
          Contenu du cours
        </h2>
        <div className="space-y-6">
          {course.modules.map((module, moduleIndex) => (
            <div
              key={moduleIndex}
              className="bg-white rounded-3xl border border-black overflow-hidden">
              <div className="bg-blue/10 p-6 border-b border-black">
                <h3 className="text-xl font-bold text-soft-black">
                  Module {moduleIndex + 1} : {module.title}
                </h3>
              </div>
              <div className="divide-y divide-blue">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="p-6 flex items-center justify-between hover:bg-blue/5 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                          lesson.completed
                            ? "bg-green/20 text-green border-green"
                            : "bg-blue/20 text-blue border-black"
                        }`}>
                        {lesson.completed ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-lg text-soft-black">
                          Leçon {moduleIndex + 1}.{lessonIndex + 1} :{" "}
                          {lesson.title}
                        </p>
                        <p className="text-soft-black font-medium">
                          {lesson.duration}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className={
                        lesson.completed
                          ? "bg-green/20 hover:bg-green/30 text-green border border-green"
                          : "bg-yellow hover:bg-yellow/80 text-soft-black font-bold border border-yellow"
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
        <div className="mt-10 bg-rose/20 rounded-3xl p-8 border-2 border-rose text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-rose" />
            <h3 className="text-2xl font-extrabold text-soft-black">
              Besoin d’aide ?
            </h3>
          </div>
          <p className="text-soft-black text-lg mb-6 font-medium">
            Nos formateurs sont là pour vous accompagner à chaque étape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green hover:bg-green/80 text-white font-bold border border-green transition-all duration-300">
              Contacter un formateur
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white border-rose text-rose hover:bg-rose/10 font-bold">
              FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
