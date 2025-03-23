"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Book,
  LogOut,
  Settings,
  ChevronDown,
  Clock,
  Award,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "Marie Dubois",
    email: "marie.dubois@example.com",
    joinDate: "15 Janvier 2023",
    coursesCompleted: 5,
    totalCourses: 10,
    totalHours: 42,
    averageQuizScore: 87,
    currentCourses: [
      {
        id: 1,
        title: "Introduction à JavaScript",
        progress: 75,
        completed: false,
      },
      { id: 2, title: "React pour débutants", progress: 100, completed: true },
      { id: 3, title: "CSS Avancé", progress: 30, completed: false },
    ],
    certifications: [
      { id: 1, title: "Fondamentaux de JavaScript", date: "10 Mars 2023" },
      { id: 2, title: "React Développeur", date: "20 Juin 2023" },
    ],
  });

  useEffect(() => {
    // Simulation d'une récupération de données via une API
    // Remplacez ceci par un vrai appel API si nécessaire
    const fetchUserData = async () => {
      // Exemple : const response = await fetch("/api/user");
      // const data = await response.json();
      // setUser(data);
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    console.log("Déconnexion...");
    router.push("/login");
  };

  const progressPercentage = (user.coursesCompleted / user.totalCourses) * 100;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-gray-100 border-[.15rem] border-black p-6">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-extrabold text-black">MON PROFIL</h1>
        </div>

        {/* Section Informations personnelles */}
        <div className="flex items-center gap-6 mb-6">
          <Avatar className="h-20 w-20 border-4 border-black">
            <AvatarImage
              src="/placeholder.svg?height=80&width=80"
              alt="Photo de profil"
            />
            <AvatarFallback className="bg-yellow text-black font-bold text-2xl">
              MD
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-black" />
              <p className="text-xl font-bold text-black">{user.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-black" />
              <p className="text-lg font-bold text-black">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-black" />
              <p className="text-lg font-bold text-black">
                Inscrit le : {user.joinDate}
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-black mb-4">
            STATISTIQUES
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow border-2 border-black p-4">
              <p className="text-lg font-bold text-black">Cours terminés</p>
              <p className="text-2xl font-extrabold text-black">
                {user.coursesCompleted} / {user.totalCourses}
              </p>
            </div>
            <div className="bg-yellow border-2 border-black p-4">
              <p className="text-lg font-bold text-black">
                Heures d’apprentissage
              </p>
              <p className="text-2xl font-extrabold text-black">
                {user.totalHours}h
              </p>
            </div>
            <div className="bg-yellow border-2 border-black p-4">
              <p className="text-lg font-bold text-black">
                Score moyen des quiz
              </p>
              <p className="text-2xl font-extrabold text-black">
                {user.averageQuizScore}%
              </p>
            </div>
            <div className="bg-yellow border-2 border-black p-4">
              <p className="text-lg font-bold text-black">Progrès global</p>
              <div className="h-4 w-full bg-gray-300 border-2 border-black mt-2 overflow-hidden">
                <div
                  className="h-full bg-black"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-sm text-black mt-1">
                {progressPercentage.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* Liste des cours suivis */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-black mb-4">
            COURS SUIVIS
          </h2>
          <div className="space-y-4">
            {user.currentCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between bg-gray-200 border-2 border-black p-4">
                <div className="flex items-center gap-3">
                  <Book className="h-6 w-6 text-black" />
                  <p className="text-lg font-bold text-black">{course.title}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-24 bg-gray-300 border-2 border-black overflow-hidden">
                    <div
                      className="h-full bg-yellow"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-sm font-bold text-black">
                    {course.completed ? "Terminé" : `${course.progress}%`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-black mb-4">
            CERTIFICATIONS
          </h2>
          {user.certifications.length > 0 ? (
            <div className="space-y-4">
              {user.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between bg-gray-200 border-2 border-black p-4">
                  <div className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-black" />
                    <p className="text-lg font-bold text-black">{cert.title}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-bold text-black">{cert.date}</p>
                    <Button
                      className="bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform"
                      onClick={() => alert(`Téléchargement de ${cert.title}`)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg font-bold text-black">
              Aucune certification obtenue.
            </p>
          )}
        </div>

        {/* Boutons d’action */}
        <div className="mt-6 space-y-4">
          <Button
            onClick={() => router.push("/courses")}
            className="w-full bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform">
            Voir tous mes cours
          </Button>
          <Button
            onClick={() => router.push("/edit-profile")}
            className="w-full bg-black hover:bg-gray-800 text-yellow font-bold border-2 border-yellow hover:-translate-y-1 transition-transform">
            Modifier le profil
          </Button>
        </div>
      </div>
    </div>
  );
}
