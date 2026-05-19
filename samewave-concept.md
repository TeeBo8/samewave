# SameWave — Business Concept

## Vision

Application de rencontre communautaire **gratuite**, dédiée aux riders (surf, skate, snowboard, wakeboard, kitesurf, longboard...). L'objectif n'est pas le match romantique classique, mais de **trouver des riders avec qui partager des sessions** — et si l'amour se pointe, tant mieux.

Pas de paywall. Pas de tchat obligatoire. On ride ensemble, on se rencontre IRL.

---

## Problème résolu

Les riders ont du mal à trouver des partenaires de session qui matchent leur niveau, leur spot et leur discipline. Les apps de rencontre classiques sont trop généralistes. Les groupes Facebook/WhatsApp sont trop désorganisés.

---

## Cible

**Marché principal :** France entière (validation MVP — pas seulement la côte atlantique)
**Secondaire :** Europe francophone, puis international si financement

**Personas :**
- Surfeur 18-35 ans, côte atlantique / côte méditerranéenne, cherche crew ou partenaire de session
- Skateu urbain 16-28 ans (Paris, Lyon, Marseille, Bordeaux...), cherche quelqu'un à emmener au skatepark
- Snowboarder 20-35 ans, Alpes / Pyrénées, cherche partner pour semaine en station
- Wakeboarder / kitesurfeur, lacs et plans d'eau intérieurs, cherche partner pour session
- Tous niveaux : débutants (rassurant de ne pas rider seul) → confirmés (trouver quelqu'un à son niveau)

---

## Concept Core : La Session

> Le point de rencontre, c'est la session — pas le tchat.

Au lieu d'une messagerie classique, le cœur de l'app c'est **proposer ou rejoindre une session** :

- Discipline (surf / skate / snow / wake / kite...)
- Spot (géolocalisation ou nom du spot)
- Date & heure
- Niveau (débutant / intermédiaire / confirmé)
- Ambiance (chill / progresser / compétitif)
- Nombre de riders recherchés

Les autres riders voient les sessions ouvertes et peuvent **demander à rejoindre**. Le créateur accepte ou non. Simple.

---

## Features MVP

### Obligatoires
- Inscription via email ou Google OAuth
- Profil rider : photo, disciplines pratiquées, niveau, spots favoris, bio courte
- Création d'une session (formulaire simple)
- Feed des sessions proches (géoloc) — liste + **carte interactive** (vue carte obligatoire : un rider veut voir *où* sont les sessions, pas juste une liste)
- Demande de participation + acceptation par le créateur
- Notifications push (session acceptée, nouvelle demande)
- Système de "vibe" post-session (évaluation simple 👍/👎 pour la sécurité)

### Post-MVP (v2)
- Messagerie légère entre participants d'une session confirmée
- Profils vérifiés (photos récentes obligatoires)
- Badges discipline / niveau communautaire
- Events organisés (contests locaux, sorties collectives)

---

## Modèle de Revenus (app 100% gratuite pour les users)

| Source | Description |
|---|---|
| Partenariats marques | Rip Curl, Quiksilver, Dakine... visibilité ciblée |
| Spots & écoles | Écoles de surf/skate paient pour être référencées |
| Events | Commission sur billets d'événements riders |
| Merchandise | Collab produits SameWave (long terme) |

---

## Stack Technique

```
Frontend  : Next.js 16 + TypeScript + Tailwind CSS + Shadcn/ui
Backend   : tRPC + Drizzle ORM
Base de données : NEON PostgreSQL
Auth      : Better Auth
Notifications : Resend (email) + Web Push API
Maps/Géoloc : Mapbox GL JS ou Leaflet
Déploiement : Vercel
Package manager : PNPM uniquement
```

---

## Structure des pages (Next.js App Router)

```
/                          → Landing page (valeur + CTA inscription)
/onboarding                → Setup profil rider (disciplines, niveau, spots)
/feed                      → Feed des sessions proches
/session/create            → Créer une session
/session/[id]              → Détail session + demande de participation
/profile/[id]              → Profil public d'un rider
/profile/me                → Mon profil + mes sessions
/notifications             → Centre de notifications
```

---

## Schéma Base de Données (simplifié)

```
users
  id, email, name, avatar, bio, created_at

rider_profiles
  id, user_id, disciplines[], level, favorite_spots[], location_city

sessions
  id, creator_id, discipline, spot_name, lat, lng, date, level, vibe, max_riders, status

session_participants
  id, session_id, user_id, status (pending/accepted/rejected)

vibes (post-session feedback)
  id, session_id, from_user_id, to_user_id, positive (boolean)
```

---

## Philosophie Produit

- **Gratuit pour toujours** côté users — c'est non-négociable, ça fait partie de l'ADN rider
- **Pas de dark patterns** (faux likes, notifications artificielles)
- **IRL first** — l'app est un tremplin vers une vraie rencontre physique
- **Safe by design** — le système de vibe post-session filtre naturellement les comportements toxiques
- **Mobile first** — PWA pour le MVP. Les notifs push iOS (PWA) ont des limitations réelles (pas de badge, délai variable). Acceptable pour un MVP, mais migration vers Capacitor (wrapper natif iOS/Android sur la même codebase Next.js) prévue si l'engagement notifs devient un levier critique post-lancement.

---

## Go-to-Market France

**Stratégie nationale dès le départ** — l'app couvre toute la France, pas seulement la côte atlantique.

### Cold start : comment seed le contenu avant l'ouverture grand public

Le problème d'une app géo-basée : 0 sessions dans une ville = app inutile = 0 utilisateurs. Solution en 3 temps :

1. **Ambassadeurs locaux** : recruter 2-3 riders influents dans chaque zone clé (Biarritz, Paris, Lyon, Marseille, Chamonix, Montpellier...) avant le lancement. Ils créent des sessions réelles et invitent leur crew.
2. **Beta fermée par zone** : ouvrir ville par ville, attendre une masse critique de sessions actives avant d'ouvrir la suivante.
3. **Partenariats shops / écoles dès le jour 1** : écoles de surf, skateparks associatifs, moniteurs indépendants — ils ont déjà une communauté captive et postent leurs sessions sur l'app (ça crée du contenu immédiatement).

### Zones de lancement prioritaires (simultané)
- **Surf / kite / wake :** Biarritz, Hossegor, Lacanau, Montpellier, Gruissan
- **Skate / longboard :** Paris, Lyon, Marseille, Bordeaux, Nantes
- **Snow :** Chamonix, Les Deux Alpes, La Plagne (timing hiver)

### Croissance organique
- Contenu UGC : chaque session postée = contenu partageable sur les réseaux
- Partenariats shops locaux pour acquisition offline
- SEO : pages spots (ex: "sessions surf Biarritz") — trafic long terme
