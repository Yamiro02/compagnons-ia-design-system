# Charte — Compagnons IA

## 1. La marque en cinq lignes ★

**Nom :** Compagnons IA (nom provisoire)
**Ce que c'est :** une PWA de conversation avec des personas IA — une app de rencontre sérieuse, chaleureuse, avec une pointe de séduction élégante.
**Pour qui :** hommes francophones 45-65 ans, plusieurs fois par jour, sur téléphone.
**Trois adjectifs :** chaleureux · épuré · rassurant — contre kitsch · criard · froid.
**Ce qu'on refuse :** kitsch, érotique/nightclub, criard, gen-Z friendly.

**La règle qui décide :**
> « à élégance égale, on choisit toujours le plus chaleureux. »

**La voix :** tutoiement — chaleureux et posé. Toute la copie tutoie, l'interface comme les personas : « Choisis… », « Claire t'a répondu », « Réessaie », « Ton email », « Reconnecte-toi » ; « Tu m'as manqué hier soir. », « Raconte-moi ta journée. »

**Les emoji :** permis dans le CONTENU des personas — étiquettes de centres d'intérêt, messages de conversation. Toujours interdits dans l'INTERFACE : boutons, titres, navigation, chips, états, erreurs. Le point médian `·` reste le seul caractère décoratif de l'interface.

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
| `--card` | `#ffffff` | `#251e1a` | LA surface portée — carte, navbar, barre latérale, pied, champ, barre d'onglets |
| `--popover` | `#ffffff` | `#2a221e` | flottant (dropdown, modale) — blanc sur blanc en clair, porté par `--shadow-lg` (écart de surface assumé) |
| `--secondary` | `#fdf8ef` | `#372c24` | l'aplat en creux : bouton secondaire, îlot posé sur une carte |
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
| `--destructive` / `--destructive-readable` | `#c53030` / `#9e2222` | `#d04444` / `#f09a94` | rouge franc, jamais confondu avec le grenat ; en sombre le jumeau lisible reste ORANGÉ pour tenir la distance avec le rose `--primary-readable` |
| `--pill-danger-bg` / `--pill-danger-fg` | `rgba(197,48,48,.13)` / `#9e2222` | (fond hérité) / `#f0a08b` | la pilule de danger, accordée au rouge |
| `--brand-from/via/to` | `#a03b58 → #98344d → #8f2d42` | `#b95370 → #ac4762 → #9f3b54` | dégradé signature discret, même teinte ; s'il tire vers le kitsch → aplat (même valeur ×3) |
| `--gradient-portrait` | `#f2e4e8 → #e0c2ca → #c99aa4` | `#3a2526 → #4e2a30 → #602c36` | la vignette d'une personne SANS photo (`.ds-portrait`). 165°, arrêts à 14 / 30 / 48 % des trois arrêts de marque mélangés dans `--card` — jamais dans `--tone-light-alt`, qui ne bascule pas |

**Où l'accent a le droit d'apparaître** — liste FERMÉE :

1. le logo
2. un mot par titre
3. le sur-titre
4. le CTA primaire, un seul par vue — **sauf** CTA répété à l'identique dans une liste de cartes (« Faire connaissance » sur chaque carte de recommandation). La carte mise en avant ne change pas la couleur de son bouton.
5. le halo
6. l'état sélectionné d'un contrôle — la bordure `--primary` d'une option, d'une chip ou d'une carte de choix (la chip y ajoute la plaque `--accent`)
7. la bulle de message de l'utilisateur — fond `--brand-gradient`
8. le compteur de non-lus — pastille pleine `--brand-gradient`

**Où il n'a jamais le droit :** un fond de page ni un grand aplat de fond d'écran, une bordure de carte au repos.

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

**Rayons :** tels quels — le socle rend déjà les gros rayons voulus (cartes 20, panneaux 24, modales 28). Deux redéclarations seulement, en fin de fichier de marque : `--tabs-radius` et `--pagination-radius` → `--radius-pill` (une barre carrée sur des items pill laisse déborder l'item dans ses coins).
**DOCTRINE ARRONDIE — tout ce qui se presse ou se remplit est PILL.** Autre RÈGLE, pas autre valeur → `patterns.css`. Sont pill : boutons et carrés d'icône, champs / selects / déclencheur de date, items d'onglet, de pagination et de barre latérale, croix de toast et de modale, bascule de barre latérale, rail de progression, tuile d'icône de toast, pastilles à TOUTES les tailles.
**Les exceptions, écrites :** textarea `--radius-lg` (un pill courberait sa première et sa dernière ligne) · items de menu, dropdown et action sheet `--radius-sm` (ce sont des lignes de liste) · case à cocher `--choice-box-radius` (le squircle de marque) · tooltip `--radius-md` · squelette `--radius-sm` (il mime du CONTENU). Cartes, panneaux, modales : ce sont des surfaces, elles gardent leurs rayons.
**Densité :** rail du socle conservé (48 px, 44 px sous 64rem) — la cible l'exige.
**Icônes — l'échelle :** `1` · `1.125` · `1.25` · `1.5` rem. `1rem` : contrôle sm, déclencheur de champ, tuile de toast · `1.125rem` : contrôle md (bouton, IconButton) et onglet de TabBar · `1.25rem` : le repli de `.ds-icon`, partout ailleurs · `1.5rem` : pastille de dialogue et de panneau. Hors échelle, dans une tuile de texte : le badge (`0.8125`, dense `0.75`).

## 6. Motifs signature

**Le halo :** radial grenat très léger, ancré en bas, jamais plein écran.
**Le dégradé :** CTA + un mot de titre + sur-titre. Grenat → bordeaux, même teinte : il se lit comme une profondeur, pas comme un arc-en-ciel. En **remplissage**, sans lueur : barre de progression, progression par étapes, case, radio et interrupteur cochés, jour sélectionné du calendrier, bulle de l'utilisateur, compteur de non-lus.
**La lueur :** `--shadow-glow*` grenat très douce, CTA uniquement.
**L'ombre :** trois niveaux teintés de `--tone-dark` (noir chaud), jamais du noir pur.

**DOCTRINE « LE BLANC EST LA SURFACE PORTÉE » :** tout ce qui se pose sur la mise en page crème est BLANC — carte, navbar, barre latérale, pied, pagination, barre d'onglets, champ. Un contrôle posé DANS une porteuse blanche repasse en crème (`--background`) : c'est la déduction de `patterns.css`, avec `surface="card"` / `surface="page"` (et `onCard` / `onPage` pour Tabs) comme échappatoires. Sur une surface blanche, survols et états actifs descendent sur la crème — `--surface-alt` ne s'y voit plus.

**Un motif qu'on refuse :** aucun aplat grenat plein écran, aucun rose bonbon, aucun néon/nightclub en sombre.

## 7. Logo → `src/brand.ts` + `.ds-logo`

À lancer : `npm run rebrand -- "@compagnons-ia/ds" "Compagnons IA"` (monogramme suggéré : `--monogram CI`).

**Mark en CSS ou en SVG :** CSS (mot-marque Nunito Sans bold + point carré arrondi en dégradé grenat).
**La pastille :** le carré en dégradé par défaut.
**Casse du mot-marque :** casse mixte, suit `--heading-transform:none` — rien à surcharger.
**Contenu vitrine :** `demo/src/identity.ts` — prénom d'exemple « Bernard », lieu « Lyon · France ».

## 8. Périmètre du design system

**Ce qui entre :** les 37 composants du socle, plus deux ajouts ASSUMÉS (§ 10) : `TabBar`, la coque d'une PWA mobile que le socle ne portait pas, et `ChatBubble`, la bulle de conversation — de la présentation pure, elle ne connaît ni le persona ni le modèle de message. 39 en tout, aucun retrait.
**En classes, sans composant (pour l'instant) :** `.ds-option`, `.ds-chip`, `.ds-steps`, `.ds-counter`, `.ds-badge--card`, `.ds-card.is-selected` + `.ds-card__flag`, `.ds-portrait` — voir `PORTAGE.md`.
**L'exception du portrait en sombre :** l'initiale quitte `.accent` et prend `--primary-readable` en aplat (`.dark .ds-portrait>:not(.halo)`) — le dégradé clippé tombe à 1,90:1 sur la vignette prune, contre 5,16:1 pour le jumeau lisible ; assombrir la vignette plafonne à 2,59 et l'aplatit. Règle scopée au portrait, aucune classe générique dupliquée.
**Ce qui n'entre pas :** tout ce qui connaît le métier (carte persona, paywall) — ça vit dans l'app.
**Extension métier :** `brand-content.css` NON importé, ses trois jetons non déclarés.

## 9. Interdits — la liste courte ★

1. Aucune valeur littérale hors des fichiers de jetons et de marque.
2. Toute dimension en `rem`, sauf la liste d'exceptions de `scales.css`.
3. `--primary` et `--destructive` ne sont jamais une `color:` — le contenu prend les jumeaux lisibles.
4. Le rayon pill est la RÈGLE (doctrine arrondie) : tout ce qui se presse ou se remplit. Les seules exceptions sont celles de la § 5 — textarea, items de menu, case à cocher, tooltip, squelette.
5. Jamais la couleur seule pour porter un sens — toujours + icône + texte.
6. `house` pour l'accueil ; `layout-dashboard` réservé à un vrai tableau de bord de widgets.
7. Jamais un utilitaire de couleur, de fond, de `background-clip` ou de dimension sur le nœud qui porte `.accent` ou `.eyebrow`.
8. Jamais un défaut de design en style inline.
9. Le grenat n'est jamais un fond de page ni un grand aplat ; le destructif n'est jamais grenat.
10. Jamais de gris froids — tout neutre est chaud (beige, brun).
11. Jamais d'emoji dans l'interface — seul le point médian `·` y est décoratif. Le contenu des personas, lui, en a le droit (§ 1).

## 10. Journal des décisions

| Date | Décision | Pourquoi |
|---|---|---|
| 2026-09-01 | Carte = blanc pur, contrôles de page à `#fdf8ef` sous elle | maquettes validées carte blanche ; l'échelle mesurée exige card ≠ popover/secondary |
| 2026-09-01 | Boutons pill via `patterns.css`, pas via `--radius-md` | pill sur `--radius-md` aurait emporté champs et selects ; seul ce qui se presse est pill |
| 2026-09-01 | Destructif rouge franc `#c53030` (était `#c2452a`, rouge-orangé brûlé) | ne jamais confondre danger et marque (grenat) ; le brûlé lisait « terre cuite » plus que « danger ». Les jumeaux (`--destructive-readable`, le couple sombre, `--pill-danger-bg`) restent sur l'ancienne teinte — accord à trancher |
| 2026-09-01 | Une seule famille (Nunito Sans) display + body | épuré ; la hiérarchie passe par la graisse |
| 2026-09-01 | Sombre : bruns-charbon, grenat éclairci, label CTA blanc conservé | garder la chaleur, éviter nightclub ; 4,6:1 mesuré sur l'arrêt le plus clair |
| 2026-09-01 | Import Google Fonts provisoire | .woff2 à déposer dans `src/styles/assets/fonts/`, @font-face prêts en commentaire |
| 2026-09-01 | Toast et Banner : icône centrée verticalement, tuile de Toast à `2rem` | sur un message d'une seule ligne, l'alignement haut faisait flotter la tuile ; à `1.5rem` elle serrait son tracé |
| 2026-09-01 | Barre d'onglets posée sur `--card` sur la page (était `--secondary`), actif `--background` | la barre se lit comme un contrôle POSÉ sur la page, pas comme un creux ; les barres sur une carte gardent leur régime inverse |
| 2026-09-01 | Tracés lucide un cran plus fins — `1.75`, `1.5` en tuile, `2.5` dans une case | Nunito Sans est ronde et légère : à `2` les icônes pesaient plus lourd que le texte qu'elles accompagnent |
| 2026-09-01 | Point du mot-marque remonté à `0.14em` (override projet dans `patterns.css`) | à `0.03em` — le défaut du socle — il tombait sous la ligne de base sur Nunito Sans |
| 2026-09-01 | `TabBar` — 38e composant, ajout ASSUMÉ hors des 37 du socle | la PWA est mobile-first et le socle ne portait aucune coque basse ; 4 onglets au plus, limite tenue par un avertissement en développement |
| 2026-09-02 | `--popover` passe au blanc pur — doctrine « le blanc est la surface portée » | tout ce qui se pose sur la mise en page crème est blanc ; le flottant se lit par `--shadow-lg`, pas par un écart d'aplat (`@surface-assume` écrit dans le fichier de marque) |
| 2026-09-02 | Navbar, barre latérale, pied, pagination, champs : blancs (`--card`) ; `.ds-appshell__main` porte le crème | même doctrine — la zone de contenu EST la mise en page, les surfaces s'y posent |
| 2026-09-02 | Survols et actifs des surfaces blanches descendent sur `--background` | sur du blanc, `--surface-alt` et `--card` ne se voient plus |
| 2026-09-02 | DOCTRINE ARRONDIE — pill partout sauf cinq exceptions écrites (§ 5) | une seule décision de forme au lieu de huit rayons qui divergeaient ; `--tabs-radius` et `--pagination-radius` suivent, sinon l'item déborde des coins de sa barre |
| 2026-09-02 | Pastille ronde à TOUTES les tailles ; `shape="round"` devient redondant, conservé | le rayon quitte les modificateurs de taille et vit sur la base |
| 2026-09-02 | Survol d'un bouton secondaire : `--accent` (était `--surface-alt`) | sur une page presque toute blanche, le cran de surface ne se voyait plus ; le ghost garde la crème, il n'a pas de bordure pour le tenir |
| 2026-09-02 | Créneaux d'icône : `width/height:var(--ds-icon-size, <mesure>)` au lieu de déclarer la propriété | rendu identique, mais `--ds-icon-size` n'est plus jamais déclarée dans le socle : sa seule source devient le site d'appel |
| 2026-09-02 | `TabBar` version finale : capsule blanche FLOTTANTE, item actif en capsule `--accent` | détachée des bords, elle se lit comme une coque et non comme un bord d'écran ; cible tactile 36 px, écart assumé (voir `docs/accessibilite.md`) |
| 2026-09-02 | Jumeaux du rouge accordés : clair `--destructive-readable` / `--pill-danger-fg` → `#9e2222`, `--pill-danger-bg` → `rgba(197,48,48,.13)`, sombre `--destructive` → `#d04444`, sombre `--destructive-readable` → `#f09a94` | ils restaient teintés de l'ancien `#c2452a` ; en sombre le jumeau garde une pointe d'ORANGÉ (`#f09a94` plutôt qu'un rouge pur) pour ne pas se confondre avec le rose `--primary-readable` |
| 2026-09-02 | L'écart assumé sur la bordure d'erreur en sombre est RETIRÉ | il n'a pas été fermé en bougeant le jeton mais la PORTEUSE : le champ est blanc, plus `--secondary`, et les deux seuils incompatibles disparaissent avec le remplissage qui les créait. Mesure 5,47 / 3,59, seuil 3 |
| 2026-09-02 | `check-contrast.mjs` : **six** paires recâblées sur leur porteuse réelle — `.ds-navlink.is-active`, `.ds-input::placeholder`, `.ds-input.is-error`, `.ds-input — bordure --input vs remplissage`, `.ds-input — remplissage vs page` sur `--card` ; `.ds-sidenav.is-active` sur `--background`. Libellés inchangés (ce sont les clés des `@a11y-assume`) | un garde qui mesure une porteuse que le CSS n'utilise plus est un garde qui ment, même dans le sens sûr. **Règle de tenue** : toute paire dont la porteuse change dans `patterns.css` se recâble dans la foulée |
| 2026-09-02 | `--pill-danger-fg` sombre → `#f09a94`, réaligné sur son jumeau `--destructive-readable` | les deux jetons étaient identiques avant le changement de rouge ; les laisser diverger aurait créé deux salmons pour un seul rôle |
| 2026-09-02 | `.ds-cal__day.is-today` recâblée sur `--popover` — dernière fiction connue du garde | le calendrier n'a jamais été posé sur `--card` : celle-là ne venait pas de la doctrine blanche, elle mesurait la mauvaise surface depuis le début. Le garde ne mesure plus que la réalité |
| 2026-09-30 | Tutoiement acté (§ 1), chaleureux et posé — interface ET personas | décision de l'audit « Parcours cœur » ; remplace l'hypothèse du vouvoiement. La copie de la vitrine du dépôt tutoyait déjà |
| 2026-09-30 | Emoji permis dans le CONTENU des personas, toujours interdits dans l'INTERFACE (§ 1, § 9) | une étiquette de centre d'intérêt ou un message de persona parle comme une personne ; un bouton, un titre, une chip ou une erreur parlent comme l'app |
| 2026-09-30 | Liste fermée de l'accent : + état sélectionné d'un contrôle, bulle de l'utilisateur, compteur de non-lus (§ 3) | trois usages attestés par les maquettes du parcours cœur ; restent interdits le grand aplat de fond d'écran et la bordure de carte au repos |
| 2026-09-30 | Exception au CTA unique : le CTA répété à l'identique dans une liste de cartes (§ 3) | « Faire connaissance » sur chaque carte de recommandation ; la carte mise en avant ne change pas la couleur de son bouton |
| 2026-09-30 | Échelle d'icône documentée `1 · 1.125 · 1.25 · 1.5` (§ 5) | `1.125` (contrôle md, TabBar) existait dans `patterns.css` sans être écrit dans la charte |
| 2026-09-30 | `.ds-badge` passe au palier `--text-caption` (était `0.78125rem`, hors échelle) ; `.ds-tabbar__item` lit `--text-micro` (même 10 px) | aucune taille de texte hors de l'échelle nommée |
| 2026-09-30 | Socle : trois jetons AJOUTÉS — `--text-micro` (10, hors lecture : compteur et TabBar), `--chip-h` (36), `--duration-typing` (1.2s) ; commentaire de `--radius-pill` corrigé | exception autorisée pour la session ; aucun autre jeton du socle ne bouge |
| 2026-09-30 | `ChatBubble` — 39e composant, second ajout ASSUMÉ (§ 8) : `from` (`them` · `me`), `typing` | la bulle et l'indicateur de saisie reviennent sur chaque écran de conversation ; présentation pure, sans connaissance du métier |
| 2026-09-30 | Classes du parcours cœur, sans composant : `.ds-option` (md / sm), `.ds-chip`, `.ds-steps`, `.ds-counter`, `.ds-badge--card`, `.ds-card.is-selected` + `.ds-card__flag`, `.ds-bubble` / `.ds-typing` | la promotion en composant est proposée à part, pas appliquée |
| 2026-09-30 | Délais des points de saisie dérivés du cycle : `calc(var(--duration-typing) / 8)` et `/ 4` au lieu de `150ms` / `300ms` | rendu identique ; une durée écrite en clair dans `patterns.css` fait tomber `check-literals.sh` |
| 2026-09-30 | `check-contrast.mjs` : + 8 paires — `.ds-chip.is-selected`, `.ds-bubble--me` et `.ds-counter` sur les trois arrêts, bordure sélectionnée `--brand-to` | règle de tenue : un nouvel état porté par une couleur se mesure. La bordure sélectionnée tombe à 2,52 en sombre — `@a11y-assume` posé, **à trancher** (`docs/accessibilite.md` § 3.5) |
| 2026-09-30 | Bordure sélectionnée (option, carte de choix) : `--primary` au lieu de `--brand-to` ; l'`@a11y-assume` posé le même jour est retiré | `--brand-to`, l'arrêt le plus sombre du dégradé, tombait à 2,52:1 sur `--card` en sombre ; `--primary` tient 6,44 en clair et 3,54 en sombre. Même bordure que la chip : un seul rouge pour « sélectionné ». Écart à reporter dans la vitrine Claude Design |
| 2026-09-30 | `--gradient-portrait` + `.ds-portrait` : le repli d'une vignette sans photo, déclaré en clair ET en sombre | la maquette l'écrivait en dur en mélangeant dans `--tone-light-alt`, qui vaut `#ffffff` dans les deux thèmes — la vignette restait rose clair en sombre. La base du mélange devient `--card`. Une classe, pas un composant : trois écrans du même produit ne passent pas le test 2 de `GOVERNANCE.md` |
| 2026-09-30 | En sombre, l'initiale du portrait quitte `.accent` pour `--primary-readable` en aplat | le dégradé clippé mesure 1,90:1 sur la vignette prune (mi-ton sur mi-ton) contre 3,91 en clair ; assombrir la vignette plafonne à 2,59 et l'aplatit à 1,06 d'amplitude. Le jumeau lisible donne 5,16. Règle SCOPÉE au portrait (`.dark .ds-portrait>:not(.halo)`), qui ne nomme pas la classe fragile |
