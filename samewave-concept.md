# SameWave — Business Concept

## Vision

**Trouver des riders avec qui rider. Le reste arrive tout seul.**

SameWave est une app communautaire **gratuite** pour riders (surf, skate, snow, wake, kite, longboard…). Le coeur du produit, c'est la session — pas le match, pas le swipe, pas le tchat dans le vide.

L'idée de départ est simple : les vraies connexions — amicales ou amoureuses — naissent dans l'action, pas devant un écran. Deux personnes qui partagent une session ont déjà plus en commun qu'un couple qui a matché sur Tinder. Elles ont la même vision du temps, de la liberté, du risque. Elles ont ridé ensemble.

SameWave crée les conditions pour que ça arrive. Ce qui se passe après la session, c'est leur affaire.

> Pas de paywall. Pas de swipe. On se retrouve au spot.

---

## Problème résolu

Les riders cherchent deux choses que les apps existantes ne donnent pas ensemble :

1. **Des partenaires de session** qui matchent leur niveau, leur spot, leur discipline — sans passer par des groupes WhatsApp chaotiques ou des posts Facebook qui prennent la poussière.
2. **Des connexions authentiques** avec des gens qui vivent vraiment comme eux — pas "j'aime le sport" en profil Tinder, mais quelqu'un qui est au line-up à 6h sous la pluie parce que le swell est parfait.

Les apps de dating ne créent pas de contexte. Les apps communautaires (Meetup, Facebook) ne sont pas pensées pour le rider lifestyle. SameWave est le seul endroit où la rencontre se passe **dans l'action**.

---

## Positionnement

**Ce que SameWave n'est pas :**
- Une app de dating avec profils et swipes
- Un réseau social de plus avec un fil d'actu
- Réservé à un niveau ou une discipline

**Ce que SameWave est :**
- Un coordinateur de sessions IRL
- Un filtre naturel de style de vie (si tu rides, t'es déjà compatible)
- L'endroit où les vraies rencontres — crew, amis, amours — se forment par l'action

**Tagline :** *Same wave. Same life.*

---

## Cible

**Marché principal :** France entière (MVP — pas seulement la côte atlantique)
**Secondaire :** Europe francophone, puis international

**Personas :**
- Surfeur 18-35 ans, côtes atlantique / méditerranéenne, cherche du monde avec qui rider — et potentiellement plus
- Skateu urbain 16-28 ans (Paris, Lyon, Marseille, Bordeaux…), cherche quelqu'un à emmener au park, pas juste un ami de réseau social
- Snowboarder 20-35 ans, Alpes / Pyrénées, cherche un partner de semaine en station — les semaines en station créent des liens forts
- Wakeboarder / kitesurfeur, cherche partenaire pour session en lac ou plan d'eau
- Débutants : rassurant de ne pas rider seul, rencontrer des riders bienveillants
- Confirmés : trouver quelqu'un à son niveau, évoluer ensemble

---

## Concept Core : La Session

> Le point de rencontre, c'est la session — pas le tchat.

La session remplace le premier rendez-vous. Au lieu d'un "on prend un café ?", c'est "je crée une session à la Gravière samedi matin, tu viens ?". Le contexte existe déjà. La pression sociale n'existe pas. Si le courant passe, il passe.

Une session, c'est :
- Discipline (surf / skate / snow / wake / kite…)
- Spot (géolocalisation ou nom du spot)
- Date & heure
- Niveau (débutant / intermédiaire / confirmé)
- Ambiance (chill / progresser / compétitif)
- Nombre de riders recherchés (solo, duo, petit groupe)

Les riders voient les sessions ouvertes près d'eux et demandent à rejoindre. Le créateur accepte ou non. Simple.

---

## Features MVP

### Obligatoires
- Inscription via email ou Google OAuth
- Profil rider : photos (vraies, récentes), disciplines, niveau, spots favoris, bio courte — assez pour donner une idée de qui est la personne
- Création d'une session (formulaire simple)
- Feed des sessions proches (géoloc) — liste + **carte interactive** (un rider veut voir *où* sont les sessions)
- Demande de participation + acceptation par le créateur
- Notifications (session acceptée, nouvelle demande)
- Système de vibe post-session (👍/👎 simple — sécurité et qualité communautaire)

### Post-MVP (v2)
- Messagerie légère entre participants d'une session confirmée (pas avant — ça force le IRL)
- "Rider à nouveau" — retrouver facilement quelqu'un avec qui t'as déjà ridé
- Profils vérifiés (photos récentes obligatoires)
- Badges discipline / niveau validés par la communauté
- Sessions privées (inviter quelqu'un directement depuis son profil)
- Events organisés (contests locaux, sorties collectives)

---

## Modèle de Revenus (app 100% gratuite pour les users)

| Source | Description |
|---|---|
| Partenariats marques | Rip Curl, Quiksilver, Dakine… visibilité ciblée sur une audience qualifiée |
| Spots & écoles | Écoles de surf/skate paient pour être référencées et poster leurs sessions |
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
Maps/Géoloc : MapLibre GL JS
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

- **IRL first** — l'app est un tremplin, pas une destination. La messagerie n'est accessible qu'après une session confirmée : ça force la rencontre physique avant la conversation numérique.
- **Gratuit pour toujours** côté users — non-négociable, c'est dans l'ADN rider
- **Pas de dark patterns** — pas de faux likes, pas de notifications artificielles, pas de "qui a vu ton profil" pour forcer l'engagement
- **Safe by design** — le système de vibe post-session filtre les comportements toxiques naturellement. La réputation se construit dans l'action, pas dans les DMs.
- **Pas un dating app** — ce label crée de la friction à l'inscription (ego, jugement social). L'app se présente comme communautaire. Ce qui se passe entre riders ensuite, c'est la vie.
- **Mobile first** — PWA pour le MVP. Migration vers Capacitor (natif iOS/Android sur la même codebase Next.js) si l'engagement notifs devient critique post-lancement.

---

## Go-to-Market France

**Stratégie nationale dès le départ** — toute la France, pas seulement la côte atlantique.

### Cold start : seeder le contenu avant l'ouverture grand public

Problème classique d'une app géo-basée : 0 sessions dans une ville = app inutile = 0 users. Solution en 3 temps :

1. **Ambassadeurs locaux** : recruter 2-3 riders influents dans chaque zone clé avant le lancement. Ils créent des sessions réelles et invitent leur crew.
2. **Beta fermée par zone** : ouvrir ville par ville, attendre une masse critique de sessions actives avant d'ouvrir la suivante.
3. **Partenariats shops / écoles dès le jour 1** : ils ont une communauté captive et postent leurs sessions sur l'app — ça crée du contenu immédiatement.

### Zones de lancement prioritaires (simultané)
- **Surf / kite / wake :** Biarritz, Hossegor, Lacanau, Montpellier, Gruissan
- **Skate / longboard :** Paris, Lyon, Marseille, Bordeaux, Nantes
- **Snow :** Chamonix, Les Deux Alpes, La Plagne (timing hiver)

### Croissance organique
- UGC : chaque session = contenu partageable sur les réseaux ("on a ridé ensemble ce matin")
- Bouche-à-oreille dans les communautés de spots (le rider lifestyle est très peer-to-peer)
- SEO : pages spots (ex: "sessions surf Biarritz") — trafic long terme passif
- Angle narratif fort pour la presse : "l'app qui remplace Tinder pour les riders" — accrocheur, sans que ce soit le positionnement principal
