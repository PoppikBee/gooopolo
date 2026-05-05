# gooo.polo

Site portfolio personnel — **Paul-Henri**, photographe & vidéaste.
[gooopolo.com](https://gooopolo.com)

## À propos

Site one-pager statique, sombre & cinématique :

- **Hero** split-screen avec parallaxe
- **Travail** — galerie photo pleine largeur (mode Galerie ↔ Story)
- **Showreel** — vidéo principale + 3 projets
- **À propos** — bio + portrait
- **Contact** — formulaire + réseaux

## Stack

100 % statique, aucune dépendance à compiler :

- HTML / CSS pur
- React 18 + JSX (transformés à la volée par Babel Standalone)
- Polices Google Fonts : Cormorant Garamond + Inter

## Lancer en local

Aucun build nécessaire. Servez le dossier avec n'importe quel serveur statique :

```bash
# avec Python
python3 -m http.server 8000

# ou avec Node (npx serve)
npx serve
```

Puis ouvrez http://localhost:8000/

## Déploiement — GitHub Pages

1. **Settings → Pages**
2. **Source** : `Deploy from a branch`
3. **Branch** : `main` / `/ (root)`
4. **Save**

Au bout d'une minute, le site est en ligne sur :
`https://capaure385.github.io/gooopolo/`

### Domaine personnalisé (gooopolo.com)

1. Achetez `gooopolo.com` (Namecheap, OVH, ~12 €/an)
2. Dans le DNS du domaine, ajoutez :
   - 4 enregistrements `A` vers les IP de GitHub Pages
   - Un `CNAME` `www` → `capaure385.github.io`
3. Dans le repo, créez un fichier `CNAME` à la racine contenant `gooopolo.com`
4. Settings → Pages → Custom domain → `gooopolo.com` → Save → cochez « Enforce HTTPS »

## Structure

```
.
├── gooopolo.html       ← page d'entrée
├── styles.css          ← tous les styles
├── app.jsx             ← composants React (sections + tweaks)
├── tweaks-panel.jsx    ← panneau de tweaks (mode galerie/story)
└── assets/
    └── photos/
        ├── sunset-bretagne.jpg
        └── volant-vintage.jpg
```

## Remplacer les photos placeholder

Dans `app.jsx`, le tableau `PHOTOS` contient les images de la galerie. Les deux premières sont les photos perso ; les autres sont des placeholders Unsplash à remplacer.

Pour ajouter une nouvelle photo :
1. Posez le fichier dans `assets/photos/`
2. Modifiez l'entrée correspondante : `url: "assets/photos/votre-photo.jpg"`
3. Commit + push → Pages se met à jour tout seul en ~30 s

## Tweaks live

Une fois le site ouvert, le panneau « Tweaks » (en bas à droite) permet de :
- Switcher entre mode **Galerie** (scroll libre) et **Story** (auto-avance)
- Régler la durée par photo en mode Story
- Activer/couper le grain photo

## Crédits

Conception : Paul-Henri.
Année : 2025–2026.
