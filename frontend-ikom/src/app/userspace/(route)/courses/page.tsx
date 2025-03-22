"use client";

import { useRouter } from "next/navigation";
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
import Link from "next/link";

export default function CourseListPage() {
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

  const router = useRouter();

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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-gray-100 border-[.15rem] border-black ">
        {/* En-tête */}
        <header className="mb-6">
          <Button
            onClick={() => router.back()}
            className="inline-flex items-center bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black mb-6 hover:-translate-y-1 transition-transform">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour aux cours
          </Button>
          <h1 className="text-4xl font-extrabold text-black">
            EXPLOREZ NOS COURS
          </h1>
          <p className="text-xl font-bold text-black mt-2">
            Des formations adaptées pour booster vos compétences !
          </p>
        </header>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative bg-gray-200 border-2 border-black p-4">
            <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 h-6 w-6 text-black" />
            <input
              type="text"
              placeholder="Trouvez votre cours idéal..."
              className="w-full pl-16 pr-4 py-4 bg-transparent text-black text-lg font-bold placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filtres */}
          <div className="bg-gray-200 border-2 border-black p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Filter className="h-6 w-6 text-black" />
                <h2 className="text-2xl font-extrabold text-black">FILTRES</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-black hover:bg-yellow hover:text-black font-bold">
                Réinitialiser
              </Button>
            </div>

            {/* Catégories */}
            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-black mb-3">
                CATÉGORIES
              </h3>
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <label
                    key={index}
                    className="flex items-center justify-between bg-white border-2 border-black p-3 hover:bg-yellow transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-black border-2 border-black"
                      />
                      <span className="text-black font-bold text-lg">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm text-black bg-yellow px-2 py-1 font-bold">
                      {category.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Niveaux */}
            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-black mb-3">NIVEAU</h3>
              <div className="space-y-3">
                {levels.map((level, index) => (
                  <label
                    key={index}
                    className="flex items-center justify-between bg-white border-2 border-black p-3 hover:bg-yellow transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-black border-2 border-black"
                      />
                      <span className="text-black font-bold text-lg">
                        {level.name}
                      </span>
                    </div>
                    <span className="text-sm text-black bg-yellow px-2 py-1 font-bold">
                      {level.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Adaptations */}
            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-black mb-3">
                ADAPTATIONS
              </h3>
              <div className="space-y-3">
                {adaptations.map((adaptation, index) => (
                  <label
                    key={index}
                    className="flex items-center justify-between bg-white border-2 border-black p-3 hover:bg-yellow transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-black border-2 border-black"
                      />
                      <span className="text-black font-bold text-lg">
                        {adaptation.name}
                      </span>
                    </div>
                    <span className="text-sm text-black bg-yellow px-2 py-1 font-bold">
                      {adaptation.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Button className="w-full bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform">
              Appliquer les filtres
            </Button>
          </div>

          {/* Liste des cours */}
          <div className="md:col-span-3">
            {/* Options de tri */}
            <div className="bg-gray-200 border-2 border-black p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-6 w-6 text-black" />
                <span className="text-black font-extrabold text-xl">
                  TRIER PAR :
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-yellow border-2 border-black text-black hover:bg-yellow/80 font-bold">
                  Popularité
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-2 border-black text-black hover:bg-yellow font-bold">
                  Récent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-2 border-black text-black hover:bg-yellow font-bold">
                  Alphabétique
                </Button>
              </div>
            </div>

            {/* Grille de cours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course, index) => (
                <Link
                  href={`/userspace/courses/${course.id}`}
                  key={course.id}
                  className="block">
                  <div
                    className={`bg-white border-2 border-black p-4 hover:-translate-y-1 transition-transform ${
                      index % 5 === 0 ? "md:col-span-2" : ""
                    }`}>
                    <div className="relative mb-4">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={`Image du cours: ${course.title}`}
                        className="w-full h-48 object-cover border-2 border-black"
                      />
                      <span className="absolute bottom-2 left-2 bg-yellow text-black px-3 py-1 font-bold border-2 border-black">
                        {course.category}
                      </span>
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black px-3 py-1 border-2 border-yellow">
                        <Star className="h-5 w-5 text-yellow fill-yellow" />
                        <span className="text-yellow font-bold">
                          {course.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-yellow text-black px-3 py-1 font-bold border-2 border-black">
                        {course.level}
                      </span>
                      {course.adaptations.map((adaptation, i) => (
                        <span
                          key={i}
                          className="bg-black text-yellow px-3 py-1 font-bold border-2 border-yellow">
                          {adaptation}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-extrabold text-black mb-2">
                      {course.title}
                    </h3>
                    <p className="text-black font-bold mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-black" />
                        <span className="text-black font-bold">
                          {course.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-black" />
                        <span className="text-black font-bold">
                          {course.students} étudiants
                        </span>
                      </div>
                    </div>
                    <Button className="w-full bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform">
                      Découvrir ce cours
                    </Button>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-3">
              <Button
                variant="outline"
                size="lg"
                className="bg-white border-2 border-black text-black hover:bg-yellow font-bold"
                disabled>
                Précédent
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-yellow border-2 border-black text-black hover:bg-yellow/80 font-bold">
                1
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white border-2 border-black text-black hover:bg-yellow font-bold">
                2
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white border-2 border-black text-black hover:bg-yellow font-bold">
                3
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white border-2 border-black text-black hover:bg-yellow font-bold">
                Suivant
              </Button>
            </div>
          </div>
        </div>

        {/* Aide */}
        <div className="mt-12 bg-black border-2 border-yellow p-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <BookOpen className="h-10 w-10 text-yellow" />
            <h3 className="text-3xl font-extrabold text-yellow">
              BESOIN D’UN COUP DE POUCE ?
            </h3>
          </div>
          <p className="text-xl font-bold text-yellow mb-6">
            Laissez-nous vous guider vers le cours parfait pour vous !
          </p>
          <Button
            size="lg"
            className="bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform">
            Parler à un conseiller
          </Button>
        </div>
      </div>
    </div>
  );
}
