# Charte — Compagnons IA

## 1. La marque en cinq lignes ★

**Nom :** Compagnons IA (nom provisoire)
**Ce que c'est :** une PWA de conversation avec des personas IA — une app de rencontre sérieuse, chaleureuse, avec une pointe de séduction élégante.
**Pour qui :** hommes francophones 45-65 ans, plusieurs fois par jour, sur téléphone.
**Trois adjectifs :** chaleureux · épuré · rassurant — contre kitsch · criard · froid.
**Ce qu'on refuse :** kitsch, érotique/nightclub, criard, gen-Z friendly.

**La règle qui décide :**
> « à élégance égale, on choisit toujours le plus chaleureux. »

## 2. Support et contexte

**Où ça vit :** PWA mobile-first (installable), web.
**Thème principal :** clair. Le sombre est livré à parité et garde la chaleur du clair — bruns-charbon, jamais nightclub.
**Densité :** confortable — texte généreux, contrastes forts, cibles tactiles larges (le rail 44 px du socle est conservé).
**Écran de référence :** mobile 390 px ; le desktop est secondaire.

## 3. Couleur → `src/styles/brand-compagnons-ia.css` ★

### Surfaces

| Jeton | Clair | Sombre | Rôle |
|---|---|---|---|
| `--background` | `#faf5ec` crème chaud | `#171210` brun-charbon | fond de page |
| `--card` | `#ffffff` | `#251e1a` | la carte se détache (1,09 / 1,07 mesurés) |
| `--secondary` | `#fdf8ef` | `#372c24` | contrôles posés sur la page |
| `--accent` | `#f6e3e6` lavis rosé | `#45242c` | plaque de marque, jamais rose bonbon |
| `--surface-alt` | `#f7f0e2` | `#2f2620` | un cran de séparation, même écart dans les deux thèmes |
| `--border` · `--input` | `#e8dcc8` · `#dbc9ae` | `#41352c` · `#56463a` | frontières chaudes |

### Texte

| Jeton | Clair | Sombre | Rôle |
|---|---|---|---|
| `--foreground` | `#2b2420` noir chaud | `#f3e9df` | titres et corps |
| `--text-secondary` | `#4a3f37` | `#d7c8bb` | libellés |
| `--text-muted` | `#6b5d51` (6,3:1 sur carte) | `#a8968a` (5,8:1) | méta |
| `--text-inverted` | `#faf5ec` | `#171210` | sur surface sombre |

### Marque ★

| Jeton | Clair | Sombre | Rôle |
|---|---|---|---|
| `--primary` | grenat clair `#a03b58` | grenat éclairci `#b95370` | LA couleur d'action, remplissage seulement |
| `--primary-readable` | bordeaux `#8f2d42` | rose `#e79db2` | liens, icônes, libellés actifs — ≥4,5:1 sur les six surfaces |
| `--destructive` / `--destructive-readable` | `#c2452a` / `#9d3417` | `#c34e31` / `#f0a08b` | rouge-orangé brûlé, jamais confondu avec le grenat |
| `--brand-from/via/to` | `#a03b58 → #98344d → #8f2d42` | `#b95370 → #ac4762 → #9f3b54` | dégradé signature discret, même teinte ; s'il tire vers le kitsch → aplat (même valeur ×3) |

**Où l'accent a le droit d'apparaître** — liste FERMÉE :

1. le logo
2. un mot par titre
3. le sur-titre
4. le CTA primaire, un seul par vue
5. le halo

**Où il n'a jamais le droit :** un fond de page, un grand aplat, une bordure de carte, un fond de bulle de conversation entière.

**Vérification :** `TOKENS=src/styles/brand-compagnons-ia.css node check-contrast.mjs` — les écarts assumés (contours doux) sont déclarés dans le fichier de marque avec leur raison.

## 4. Typographie → fichier de marque

| Jeton | Valeur |
|---|---|
| `--font-display` | Nunito Sans |
| `--font-body` | Nunito Sans |
| `--font-mono` | DM Mono |
| `--heading-transform` | `none` |
| `--heading-weight` | `var(--weight-bold)` |

Grotesque humaniste, ronde et chaleureuse → casse d'origine + gras. Une seule famille display/body : l'épure passe par la hiérarchie de graisse, pas par un contraste de faces.

**Graisses à charger :** 400 · 500 · 600 · 700 (rien d'autre). ⚠ Import Google Fonts PROVISOIRE — déposer les .woff2 dans `src/styles/assets/fonts/` et basculer sur les `@font-face` commentés en tête du fichier de marque.

## 5. Espacement, rayons, rail

**Rayons :** tels quels — le socle rend déjà les gros rayons voulus (cartes 20, panneaux 24, modales 28). Aucune redéclaration.
**Boutons pill :** autre RÈGLE, pas autre valeur → `patterns.css` (`.ds-btn` / `.ds-icon-btn` → `var(--radius-pill)`). Champs, selects, barres d'onglets restent sur le rayon du socle : seul ce qui se presse est pill.
**Densité :** rail du socle conservé (48 px, 44 px sous 64rem) — la cible l'exige.

## 6. Motifs signature

**Le halo :** radial grenat très léger, ancré en bas, jamais plein écran.
**Le dégradé :** CTA + un mot de titre + sur-titre. Grenat → bordeaux, même teinte : il se lit comme une profondeur, pas comme un arc-en-ciel.
**La lueur :** `--shadow-glow*` grenat très douce, CTA uniquement.
**L'ombre :** trois niveaux teintés de `--tone-dark` (noir chaud), jamais du noir pur.

**Un motif qu'on refuse :** aucun aplat grenat plein écran, aucun rose bonbon, aucun néon/nightclub en sombre.

## 7. Logo → `src/brand.ts` + `.ds-logo`

À lancer : `npm run rebrand -- "@compagnons-ia/ds" "Compagnons IA"` (monogramme suggéré : `--monogram CI`).

**Mark en CSS ou en SVG :** CSS (mot-marque Nunito Sans bold + point carré arrondi en dégradé grenat).
**La pastille :** le carré en dégradé par défaut.
**Casse du mot-marque :** casse mixte, suit `--heading-transform:none` — rien à surcharger.
**Contenu vitrine :** `demo/src/identity.ts` — prénom d'exemple « Bernard », lieu « Lyon · France ».

## 8. Périmètre du design system

**Ce qui entre :** les 37 composants du socle, sans ajout ni retrait au portage.
**Ce qui n'entre pas :** tout ce qui connaît le métier (carte persona, bulle de conversation, paywall) — ça vit dans l'app.
**Extension métier :** `brand-content.css` NON importé, ses trois jetons non déclarés.

## 9. Interdits — la liste courte ★

1. Aucune valeur littérale hors des fichiers de jetons et de marque.
2. Toute dimension en `rem`, sauf la liste d'exceptions de `scales.css`.
3. `--primary` et `--destructive` ne sont jamais une `color:` — le contenu prend les jumeaux lisibles.
4. Le rayon pill appartient aux BOUTONS (traitement de marque) et aux badges — jamais aux champs ni aux barres d'onglets.
5. Jamais la couleur seule pour porter un sens — toujours + icône + texte.
6. `house` pour l'accueil ; `layout-dashboard` réservé à un vrai tableau de bord de widgets.
7. Jamais un utilitaire de couleur, de fond, de `background-clip` ou de dimension sur le nœud qui porte `.accent` ou `.eyebrow`.
8. Jamais un défaut de design en style inline.
9. Le grenat n'est jamais un fond de page ni un grand aplat ; le destructif n'est jamais grenat.
10. Jamais de gris froids — tout neutre est chaud (beige, brun).

## 10. Journal des décisions

| Date | Décision | Pourquoi |
|---|---|---|
| 2026-09-01 | Carte = blanc pur, contrôles de page à `#fdf8ef` sous elle | maquettes validées carte blanche ; l'échelle mesurée exige card ≠ popover/secondary |
| 2026-09-01 | Boutons pill via `patterns.css`, pas via `--radius-md` | pill sur `--radius-md` aurait emporté champs et selects ; seul ce qui se presse est pill |
| 2026-09-01 | Destructif rouge-orangé brûlé `#c2452a` | ne jamais confondre danger et marque (grenat) |
| 2026-09-01 | Une seule famille (Nunito Sans) display + body | épuré ; la hiérarchie passe par la graisse |
| 2026-09-01 | Sombre : bruns-charbon, grenat éclairci, label CTA blanc conservé | garder la chaleur, éviter nightclub ; 4,6:1 mesuré sur l'arrêt le plus clair |
| 2026-09-01 | Import Google Fonts provisoire | .woff2 à déposer dans `src/styles/assets/fonts/`, @font-face prêts en commentaire |
