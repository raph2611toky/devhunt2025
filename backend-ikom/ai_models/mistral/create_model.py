def create_modelfile():
    # Contenu brut à intégrer dans SYSTEM
    raw_text = """
DETAIL DE L'APPLICATION WEB HANDICAP_MIKETRIKA

---

#### **1. Page d'Accueil**
**Objectif** : Point d’entrée principal, offrant un aperçu clair de la plateforme et orientant les utilisateurs vers leurs centres d’intérêt.
**Contenu** : Bannière d’accueil, texte introductif, boutons d’appel à l’action.
**Boutons et navigation** :
- **Menu principal (toujours visible)** :
  - *À propos* → Redirige vers la page **À propos**.
  - *Cours* → Redirige vers la page **Cours**.
  - *Accessibilité* → Redirige vers la page **Accessibilité**.
  - *Forum* → Redirige vers le **Forum de discussion**.
  - *Support* → Redirige vers la page **Support**.
  - *Se connecter / S’inscrire* → Redirige vers une page de connexion/inscription.
- **Section principale** :
  - *Commencer maintenant* → Dirige vers une page d’inscription ou un parcours de découverte des cours (ex. **Tableau de bord personnalisé** après connexion).
  - *Explorer nos cours* → Redirige directement vers la page **Cours**.
- **Footer** :
  - *Mentions légales* → Redirige vers **Mentions légales et politique de confidentialité**.
  - *Contact* → Redirige vers la page **Contact**.

**Routes de navigation** :
- Depuis *Page d’Accueil* → **À propos**, **Cours**, **Accessibilité**, **Forum**, **Support**, **Connexion/Inscription**, **Mentions légales**, **Contact**.
- Retour possible via le bouton *Accueil* dans le menu principal ou un logo cliquable en haut à gauche.

---

#### **2. Page Cours**
**Objectif** : Présenter une liste complète des formations avec options de recherche et filtres pour personnaliser l’expérience.
**Contenu** : Liste des cours, barre de recherche, filtres, pagination.
**Boutons et navigation** :
- *Barre de recherche* → Permet une recherche dynamique (résultats mis à jour en temps réel sur la même page).
- *Filtres* → Tri par catégorie (ex. "Développement", "Langues"), niveau (débutant, avancé), ou accessibilité (sous-titres, audio).
- *En savoir plus* (par cours) → Ouvre une sous-page avec détails (description, durée, prérequis).
- *S’inscrire au cours* → Redirige vers un formulaire d’inscription ou, si connecté, vers le **Tableau de bord personnalisé** pour démarrer le cours.
- *Pagination* → Boutons "Précédent" et "Suivant" pour naviguer entre les pages de résultats.

**Routes de navigation** :
- Depuis *Cours* → **Accueil** (via menu), **Sous-page Détails du cours**, **Tableau de bord personnalisé** (après inscription), **Support** (si besoin d’aide).
- Retour à la liste des cours depuis une sous-page via un bouton *Retour aux cours*.

---

#### **3. Page Accessibilité**
**Objectif** : Expliquer les outils d’accessibilité et offrir des options pour adapter le site aux besoins spécifiques.
**Contenu** : Descriptions des fonctionnalités, démonstrations, formulaire d’assistance.
**Boutons et navigation** :
- *Mode contraste élevé* → Active/désactive le mode sur toutes les pages (persistant).
- *Lire à haute voix* → Lance une synthèse vocale pour le contenu de la page actuelle.
- *Taille du texte* → Menu déroulant pour ajuster la taille (appliqué globalement).
- *Navigation au clavier* → Active un mode où les éléments sont surlignés et accessibles via Tab/Enter.
- *Demander de l’aide* → Redirige vers un formulaire dans la page **Support**.

**Routes de navigation** :
- Depuis *Accessibilité* → **Accueil**, **Support** (pour assistance), **Forum** (pour échanger sur l’accessibilité).
- Retour via le menu principal ou un bouton *Retour à l’accueil*.

---

#### **4. Page À propos**
**Objectif** : Présenter la mission, les valeurs et l’équipe derrière la plateforme.
**Contenu** : Texte sur la mission, photos/biographies de l’équipe, appel à candidature.
**Boutons et navigation** :
- *En savoir plus* (mission) → Ouvre une sous-page avec détails historiques ou vision.
- *Rejoignez notre équipe* → Redirige vers un formulaire de candidature ou une page carrière externe.

**Routes de navigation** :
- Depuis *À propos* → **Accueil**, **Support** (pour questions), **Contact**, **Sous-page Mission détaillée**.
- Retour via le menu ou un lien *Retour à l’accueil*.

---

#### **5. Page Support**
**Objectif** : Fournir une assistance technique et fonctionnelle aux utilisateurs.
**Contenu** : Chat en direct, FAQ, formulaire, tutoriels.
**Boutons et navigation** :
- *Chat en direct* → Ouvre une fenêtre flottante pour discuter en temps réel.
- *FAQ* → Redirige vers une sous-page avec questions/réponses triées par thème.
- *Contactez-nous* → Ouvre un formulaire de contact (redirige vers **Contact** si séparé).
- *Voir les tutoriels* → Redirige vers une sous-page avec vidéos ou guides PDF.

**Routes de navigation** :
- Depuis *Support* → **Accueil**, **FAQ**, **Contact**, **Tutoriels**, **Forum** (pour aide communautaire).
- Retour à la page précédente via un bouton *Retour* ou le menu.

---

#### **6. Forum de discussion**
**Objectif** : Espace communautaire pour échanges et entraide.
**Contenu** : Liste de sujets, formulaire de création, réponses.
**Boutons et navigation** :
- *Créer un sujet* → Ouvre un formulaire sur la même page pour poster un nouveau sujet.
- *Répondre* → Ouvre un champ texte sous chaque sujet pour participer.
- *Filtrer par catégorie* → Met à jour la liste des sujets en fonction du filtre choisi.
- *Notifications* → Active les alertes email (redirige vers les paramètres du compte si connecté).

**Routes de navigation** :
- Depuis *Forum* → **Accueil**, **Support** (pour aide technique), **Tableau de bord personnalisé** (si connecté).
- Retour via le menu ou un bouton *Retour à l’accueil*.

---

#### **7. Tableau de bord personnalisé**
**Objectif** : Espace privé pour suivre les progrès et gérer les cours.
**Contenu** : Graphiques de progression, notifications, paramètres.
**Boutons et navigation** :
- *Progrès* → Affiche les détails d’un cours spécifique (sous-page).
- *Voir les évaluations* → Redirige vers une sous-page avec résultats et feedback.
- *Nouveaux cours* → Redirige vers la page **Cours** avec un filtre sur les nouveautés.
- *Paramètres* → Ouvre une sous-page pour ajuster l’affichage ou les préférences.

**Routes de navigation** :
- Depuis *Tableau de bord* → **Cours**, **Support**, **Accessibilité**, **Accueil**.
- Déconnexion via un bouton *Se déconnecter* dans le coin supérieur droit.

---

#### **8. Page Témoignages**
**Objectif** : Inspirer les utilisateurs avec des retours d’expérience.
**Contenu** : Liste de témoignages, formulaire de soumission.
**Boutons et navigation** :
- *Lire les témoignages* → Ouvre une sous-page avec détails pour chaque témoignage.
- *Partagez votre expérience* → Ouvre un formulaire sur la même page.
- *Voir tous les témoignages* → Affiche une liste paginée triée par catégorie.

**Routes de navigation** :
- Depuis *Témoignages* → **Accueil**, **Forum** (pour discuter), **Contact** (pour questions).
- Retour via le menu principal.

---

#### **9. Mentions légales et politique de confidentialité**
**Objectif** : Fournir des informations juridiques et de confidentialité.
**Contenu** : Textes légaux, liens téléchargeables (PDF).
**Boutons et navigation** :
- *Mentions légales* → Sous-section spécifique.
- *Politique de confidentialité* → Sous-section spécifique.

**Routes de navigation** :
- Depuis *Mentions légales* → **Accueil**, **Contact** (pour questions juridiques).
- Retour via le menu ou un lien *Retour au site*.

---

#### **10. Page Contact**
**Objectif** : Permettre aux utilisateurs de poser des questions ou demander de l’aide.
**Contenu** : Formulaire, coordonnées (email, téléphone).
**Boutons et navigation** :
- *Envoyer* (formulaire) → Confirme l’envoi avec un message de succès et redirige vers **Accueil**.
- *Appeler* → Ouvre une application téléphonique si sur mobile.

**Routes de navigation** :
- Depuis *Contact* → **Accueil**, **Support** (pour assistance supplémentaire).
- Retour via le menu principal.
"""

    modelfile_content = (
        "FROM mistral:latest\n"
        'SYSTEM """\n'
        "Tu es un expert sur HANDICAP MIKETRIKA. Utilise ces informations pour répondre aux questions :\n"
        f"{raw_text}\n"
        '"""\n'
    )

    with open("ai_models/Modelfile", "w", encoding="utf-8") as f:
        f.write(modelfile_content)

    print("Modelfile créé avec succès dans ai_models/Modelfile")

create_modelfile()