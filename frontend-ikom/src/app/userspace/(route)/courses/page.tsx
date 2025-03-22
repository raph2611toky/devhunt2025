"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Search,
  Filter,
  SlidersHorizontal,
  BookOpen,
  Clock,
  Users,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CourseListPage() {
  const router = useRouter();
  const courses = [
    {
      id: 1,
      title: "Utiliser un ordinateur - Niveau débutant",
      description:
        "Apprenez les bases de l'utilisation d'un ordinateur, de la souris et du clavier.",
      image: "/assets/images/img.png",
      adaptations: ["Visuel", "Moteur"],
      level: "Débutant",
      category: "Informatique",
      duration: "4 semaines",
      students: 128,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Apprendre à lire et écrire",
      description:
        "Méthode simplifiée pour apprendre à lire et écrire le français.",
      image: "/assets/images/img.png",
      adaptations: ["Cognitif", "Auditif"],
      level: "Débutant",
      category: "Langues",
      duration: "8 semaines",
      students: 95,
      rating: 4.6,
    },
    {
      id: 3,
      title: "Bases du français",
      description:
        "Maîtrisez les fondamentaux de la langue française avec des exercices adaptés.",
      image: "/assets/images/img.png",
      adaptations: ["Visuel", "Cognitif"],
      level: "Débutant",
      category: "Langues",
      duration: "6 semaines",
      students: 112,
      rating: 4.7,
    },
    {
      id: 4,
      title: "Préparer un entretien d'embauche",
      description:
        "Techniques et conseils pour réussir vos entretiens d'embauche.",
      image: "/assets/images/img.png",
      adaptations: ["Auditif", "Moteur"],
      level: "Intermédiaire",
      category: "Métiers",
      duration: "3 semaines",
      students: 76,
      rating: 4.9,
    },
    {
      id: 5,
      title: "Initiation à la musique",
      description:
        "Découvrez les bases de la musique et apprenez à jouer des instruments adaptés.",
      image: "/assets/images/img.png",
      adaptations: ["Auditif", "Moteur"],
      level: "Débutant",
      category: "Loisirs",
      duration: "5 semaines",
      students: 64,
      rating: 4.5,
    },
    {
      id: 6,
      title: "Apprendre à dessiner",
      description:
        "Techniques de dessin adaptées pour tous les types de handicap.",
      image: "/assets/images/img.png",
      adaptations: ["Visuel", "Moteur"],
      level: "Débutant",
      category: "Loisirs",
      duration: "4 semaines",
      students: 89,
      rating: 4.7,
    },
    {
      id: 7,
      title: "Programmation web accessible",
      description:
        "Créez des sites web en respectant les normes d'accessibilité WCAG.",
      image: "/assets/images/img.png",
      adaptations: ["Visuel", "Moteur"],
      level: "Avancé",
      category: "Informatique",
      duration: "10 semaines",
      students: 42,
      rating: 4.9,
    },
    {
      id: 8,
      title: "Gestion financière personnelle",
      description:
        "Apprenez à gérer votre budget et vos finances au quotidien.",
      image: "/assets/images/img.png",
      adaptations: ["Cognitif", "Visuel"],
      level: "Intermédiaire",
      category: "Métiers",
      duration: "4 semaines",
      students: 58,
      rating: 4.6,
    },
  ];

  const categories = [
    { name: "Informatique", count: 2 },
    { name: "Langues", count: 2 },
    { name: "Métiers", count: 2 },
    { name: "Loisirs", count: 2 },
  ];

  const levels = [
    { name: "Débutant", count: 5 },
    { name: "Intermédiaire", count: 2 },
    { name: "Avancé", count: 1 },
  ];

  const adaptations = [
    { name: "Visuel", count: 4 },
    { name: "Moteur", count: 5 },
    { name: "Auditif", count: 3 },
    { name: "Cognitif", count: 3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-grey to-rose/20 text-soft-black">
      {/* En-tête */}
      <header className="pt-10 pb-5 mb-8">
        <div className="container px-4 mx-auto max-w-6xl">
          <Button
            onClick={() => router.back()}
            className="inline-flex items-center text-blue hover:text-yellow mb-6 transition-all duration-300 hover:scale-105 bg-white px-4 py-2 rounded-xl border">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour aux cours
          </Button>

          <div className="bg-white rounded-3xl p-8 border-2 border-black transition-all duration-300">
            <h1 className="text-4xl md:text-5xl font-extrabold text-soft-black mb-3 tracking-tight">
              Explorez Nos Cours
            </h1>
            <p className="text-grey text-xl font-semibold">
              Des formations adaptées pour booster vos compétences !
            </p>
          </div>
        </div>
      </header>

      {/* Barre de recherche */}
      <div className="container mx-auto max-w-6xl px-4 mb-10"></div>

      {/* Contenu principal en bento grid */}
      <div className="container mx-auto max-w-6xl px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filtres - 1 colonne */}
          <div className="bg-yellow/10 rounded-3xl p-6 border-2 border-yellow h-fit">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Filter className="h-6 w-6 text-yellow" />
                <h2 className="text-2xl font-extrabold text-soft-black tracking-tight">
                  Filtres
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue hover:text-yellow hover:bg-yellow/20 rounded-xl transition-all duration-300 text-lg font-semibold">
                Réinitialiser
              </Button>
            </div>

            {/* Catégories */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-soft-black mb-3">
                Catégories
              </h3>
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <label
                    key={index}
                    className="flex items-center justify-between cursor-pointer p-3 bg-white rounded-lg hover:bg-yellow/20 transition-all duration-200 border border-yellow">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-yellow rounded-md"
                      />
                      <span className="text-soft-black text-lg font-medium">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm text-soft-black bg-yellow/30 px-2 py-1 rounded-xl font-semibold">
                      {category.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Niveaux */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-soft-black mb-3">
                Niveau
              </h3>
              <div className="space-y-3">
                {levels.map((level, index) => (
                  <label
                    key={index}
                    className="flex items-center justify-between cursor-pointer p-3 bg-white rounded-lg hover:bg-yellow/20 transition-all duration-200 border border-yellow">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-yellow rounded-md"
                      />
                      <span className="text-soft-black text-lg font-medium">
                        {level.name}
                      </span>
                    </div>
                    <span className="text-sm text-soft-black bg-yellow/30 px-2 py-1 rounded-xl font-semibold">
                      {level.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Adaptations */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-soft-black mb-3">
                Adaptations
              </h3>
              <div className="space-y-3">
                {adaptations.map((adaptation, index) => (
                  <label
                    key={index}
                    className="flex items-center justify-between cursor-pointer p-3 bg-white rounded-lg hover:bg-yellow/20 transition-all duration-200 border border-yellow">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-yellow rounded-md"
                      />
                      <span className="text-soft-black text-lg font-medium">
                        {adaptation.name}
                      </span>
                    </div>
                    <span className="text-sm text-soft-black bg-yellow/30 px-2 py-1 rounded-full font-semibold">
                      {adaptation.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Button className="w-full bg-yellow hover:bg-yellow/80 text-soft-black font-bold py-3 rounded-xl border border-yellow transition-all duration-300 text-lg">
              Appliquer les filtres
            </Button>
          </div>

          {/* Liste des cours - 3 colonnes */}
          <div className="md:col-span-3">
            {/* Options de tri */}
            <div className="bg-white rounded-2xl p-4 mb-6 flex items-center justify-between border">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-6 w-6 text-blue" />
                <span className="text-soft-black font-semibold text-xl">
                  Trier par :
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue/20 border-black text-blue hover:bg-blue/30 rounded-xl transition-all duration-300 text-sm font-semibold">
                  Popularité
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-black text-soft-black hover:bg-blue/10 rounded-xl transition-all duration-300 text-sm font-semibold">
                  Récent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-black text-soft-black hover:bg-blue/10 rounded-xl transition-all duration-300 text-sm font-semibold">
                  Alphabétique
                </Button>
              </div>
            </div>

            {/* Grille de cours en bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course, index) => (
                <Link
                  href={`/userspace/courses/${course.id}`}
                  key={course.id}
                  className="block">
                  <div
                    className={`bg-white rounded-3xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 border border-black ${
                      index % 5 === 0 ? "md:col-span-2" : ""
                    }`}>
                    <div className="relative">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={`Image du cours: ${course.title}`}
                        className="w-full h-48 object-cover rounded-t-3xl"
                      />
                      <div className="absolute inset-0 bg-soft-black/40"></div>
                      <div className="absolute bottom-0 left-0 p-4">
                        <span className="bg-yellow text-soft-black px-3 py-1 rounded-full text-base font-bold border border-yellow">
                          {course.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1 bg-violet px-3 py-1 rounded-full border border-violet">
                          <Star className="h-5 w-5 text-yellow fill-yellow" />
                          <span className="text-white text-base font-semibold">
                            {course.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue/20 text-blue px-3 py-1 rounded-xl text-base font-semibold border border-black">
                          {course.level}
                        </span>
                        {course.adaptations.map((adaptation, i) => (
                          <span
                            key={i}
                            className="bg-violet/20 text-violet px-3 py-1 rounded-xl text-base font-semibold border border-violet">
                            {adaptation}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-2xl font-extrabold mb-2 text-soft-black tracking-tight">
                        {course.title}
                      </h3>
                      <p className="text-soft-black mb-4 line-clamp-2 text-lg font-medium">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-soft-black">
                          <Clock className="h-5 w-5 text-blue" />
                          <span className="text-base font-semibold">
                            {course.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-soft-black">
                          <Users className="h-5 w-5 text-blue" />
                          <span className="text-base font-semibold">
                            {course.students} étudiants
                          </span>
                        </div>
                      </div>

                      <Button
                        size="lg"
                        className="w-full bg-yellow border-2 border-black hover:bg-yellow/80 text-soft-black font-bold py-3 rounded-xl transition-all duration-300 text-lg">
                        Découvrir ce cours
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-3">
              <Button
                variant="outline"
                size="lg"
                className="px-6 bg-white border text-soft-black hover:bg-blue/10 rounded-xl transition-all duration-300 text-lg font-semibold"
                disabled>
                Précédent
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6 bg-yellow text-soft-black border-yellow hover:bg-yellow/80 rounded-xl transition-all duration-300 text-lg font-semibold">
                1
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6 bg-white border-black text-soft-black hover:bg-blue/10 rounded-xl transition-all duration-300 text-lg font-semibold">
                2
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6 bg-white border-black text-soft-black hover:bg-blue/10 rounded-xl transition-all duration-300 text-lg font-semibold">
                3
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6 bg-white border-black text-soft-black hover:bg-blue/10 rounded-xl transition-all duration-300 text-lg font-semibold">
                Suivant
              </Button>
            </div>
          </div>
        </div>

        {/* Aide */}
        <div className="mt-12 bg-green/20 rounded-3xl p-8 border border-green text-center transition-all duration-300">
          <div className="flex items-center justify-center gap-4 mb-4">
            <BookOpen className="h-10 w-10 text-green" />
            <h3 className="text-3xl font-extrabold text-soft-black tracking-tight">
              Besoin d’un coup de pouce ?
            </h3>
          </div>
          <p className="text-xl mb-6 text-soft-black font-semibold">
            Laissez-nous vous guider vers le cours parfait pour vous !
          </p>
          <Button
            size="lg"
            className="px-10 py-6 bg-green hover:bg-green/80 text-white font-bold rounded-xl border border-green transition-all duration-300 text-lg">
            Parler à un conseiller
          </Button>
        </div>
      </div>
    </div>
  );
}
