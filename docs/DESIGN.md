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
**Densité :** confortable — texte généreux, contrastes forts, cibles tactiles larges (contrôles à 48, compacts à 40, toujours 44 au doigt pour ce qui conclut un écran — § 5).
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
| `--ring` | `#a03b58` | `#d98ca0` | l'anneau de focus — il S'ÉCLAIRCIT en sombre, contrairement à `--primary` : un anneau doit se voir sur la page, pas se fondre dedans |
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

**Graisses chargées :** Nunito Sans 400 · 500 · 600 · 700, DM Mono 400 — rien d'autre. **Auto-hébergées** : les `.woff2` sont dans `src/styles/assets/fonts/` et les `@font-face` en tête du fichier de marque. Aucun appel réseau à Google Fonts.

## 5. Espacement, rayons, rail

**Rayons :** tels quels — le socle rend déjà les gros rayons voulus (cartes 20, panneaux 24, modales 28). Deux redéclarations seulement, en fin de fichier de marque : `--tabs-radius` et `--pagination-radius` → `--radius-pill` (une barre carrée sur des items pill laisse déborder l'item dans ses coins).
**DOCTRINE ARRONDIE — tout ce qui se presse ou se remplit est PILL.** Autre RÈGLE, pas autre valeur → `patterns.css`. Sont pill : boutons et carrés d'icône, champs / selects / déclencheur de date, items d'onglet, de pagination et de barre latérale, croix de toast et de modale, bascule de barre latérale, rail de progression, tuile d'icône de toast, pastilles à TOUTES les tailles.
**Les exceptions, écrites :** textarea `--radius-lg` (un pill courberait sa première et sa dernière ligne) · items de menu, dropdown et action sheet `--radius-sm` (ce sont des lignes de liste) · case à cocher `--choice-box-radius` (le squircle de marque) · tooltip `--radius-md` · squelette `--radius-sm` (il mime du CONTENU). Cartes, panneaux, modales : ce sont des surfaces, elles gardent leurs rayons.
**Hauteurs — multiples de 4, posées, jamais déduites.** Toute hauteur de composant se déclare (`min-height` ou `height`, `padding-block:0`) ; le padding ne règle que l'air latéral. Les hauteurs émergentes (padding + interligne) tombaient hors grille : champ 44,8 · bouton lg 52,5 · option sm 46,5 · badge 29. Le rail ne varie plus avec la largeur d'écran.

| Jeton | Valeur | Qui |
|---|---|---|
| `--control-md` | 48 | bouton, champ, select, option (md **et** sm), barre d'onglets |
| `--control-sm` | 40 | bouton `sm`, champ `sm`, chip (`--chip-h`) |
| `--control-lg` | 52 | **site vitrine uniquement** — CTA de héros, plus employé dans l'app |
| `--icon-control-sm/md/lg` | 40 · 48 · 56 | bouton-icône |
| `--badge-h` · `--badge-h-dense` · `.ds-badge--lg` | 28 · 24 · 32 | badge de statut · dense · étiquette d'intérêt de fiche persona |
| `--switch-h` · knob | 28 · 20 (inset 4) | interrupteur |
| compteur de non-lus | 20 | `.ds-counter` |

**La règle d'usage 48 / 40 :**
- **48 (`--control-md`)** — ce qui CONCLUT un écran ou se REMPLIT dans un formulaire : CTA de bas d'écran, « Payer », « Envoyer » au pied d'un formulaire, « Supprimer mon compte », champs, selects, options.
- **40 (`--control-sm`)** — ce qui vit À L'INTÉRIEUR d'un composant ou d'une barre : bouton dans une bannière ou une carte (« Voir l'abonnement », « Faire connaissance », « Ajouter une photo »), barre de recherche, chips, et la **barre de saisie du chat** — `Textarea size="sm"` — avec son bouton d'envoi.
- **Le bouton suit sa barre, pas son libellé.** « Envoyer » n'a pas de taille en soi : au pied d'un formulaire, il conclut l'écran → 48 ; dans la barre de saisie du chat, il appartient à la barre → `IconButton size="sm"`, 40, au même rail que le `Textarea sm`. Dans la barre, les deux s'alignent en BAS (`items-end`) : à 40 / 40 sur une ligne, le bouton reste au niveau de la dernière ligne quand le champ grandit.

**Arrondi :** pill conservé sur tout ce qui se presse (boutons, champs d'une ligne, options, chips) — 8, 12 et 16 px testés et rejetés. Le textarea garde `--radius-lg` (20).
**Cible tactile : au moins 44 px AU DOIGT, pas forcément à l'œil.** La partie visible peut être plus petite si la zone de toucher atteint 44 px : l'onglet de `TabBar` par ses marges d'item, la chip par une couche `::before` qui déborde de `--space-1` en haut et en bas (40 + 4 + 4 = 48), à condition d'au moins `--space-2` (8 px) entre deux rangées de chips ; la poignée du curseur de plage (24 à l'œil, 44 au doigt). **Écart assumé :** un contrôle `sm` (bouton, champ, bouton-icône) se voit ET se touche à 40 — sous la règle maison, au-dessus du minimum WCAG 2.5.8 (24). Il vit dans un composant ou une barre, jamais comme cible qui conclut un écran. Détail : `docs/accessibilite.md` § 4.
**Icônes — l'échelle :** `1` · `1.125` · `1.25` · `1.5` rem. `1rem` : contrôle sm, déclencheur de champ, tuile de toast · `1.125rem` : contrôle md (bouton, IconButton) et onglet de TabBar · `1.25rem` : le repli de `.ds-icon`, partout ailleurs · `1.5rem` : pastille de dialogue et de panneau. Hors échelle, dans une petite tuile : le badge (`0.8125`, dense `0.75`), la coche d'une case (`0.8125`) et le glyphe d'un message d'erreur (`0.875`). **Tous sont des CRÉNEAUX CSS** — aucune taille n'est écrite au site d'appel ; `size` y reste la surcharge optique, pas le réglage normal.

## 6. Motifs signature

**Le halo :** radial grenat très léger, ancré en bas, jamais plein écran.
**Le dégradé :** CTA + un mot de titre + sur-titre. Grenat → bordeaux, même teinte : il se lit comme une profondeur, pas comme un arc-en-ciel. En **remplissage**, sans lueur : barre de progression, progression par étapes, case, radio et interrupteur cochés, portion choisie du curseur de plage, jour sélectionné du calendrier, bulle de l'utilisateur, compteur de non-lus.
**La lueur :** `--shadow-glow*` grenat très douce, CTA uniquement.
**L'ombre :** trois niveaux teintés de `--tone-dark` (noir chaud), jamais du noir pur.

**DOCTRINE « LE BLANC EST LA SURFACE PORTÉE » :** tout ce qui se pose sur la mise en page crème est BLANC — carte, navbar, barre latérale, pied, pagination, barre d'onglets, champ. Un contrôle posé DANS une porteuse blanche repasse en crème (`--background`) : c'est la déduction de `patterns.css`, avec `surface="card"` / `surface="page"` (et `onCard` / `onPage` pour Tabs) comme échappatoires. Sur une surface blanche, survols et états actifs descendent sur la crème — `--surface-alt` ne s'y voit plus.

**Un motif qu'on refuse :** aucun aplat grenat plein écran, aucun rose bonbon, aucun néon/nightclub en sombre.

## 7. Logo → `src/brand.ts` + `.ds-logo`

À lancer : `npm run rebrand -- "@compagnons-ia/ds" "Compagnons IA"` (monogramme suggéré : `--monogram CI`).

**Mark en CSS ou en SVG :** CSS (mot-marque Nunito Sans bold + point carré arrondi en dégradé grenat).
**La pastille :** le carré en dégradé par défaut.
**Casse du mot-marque :** casse mixte, suit `--heading-transform:none` — rien à surcharger.
**Contenu vitrine :** `demo/src/identity.ts` — prénom d'exemple « Alex », lieu « Ville · Pays ». Ce sont des CONTENUS d'application, pas des jetons : `npm run rebrand` ne les touche pas, ils s'éditent à la main.

## 8. Périmètre du design system

**Ce qui entre :** les 37 composants du socle, plus trois ajouts ASSUMÉS (§ 10) : `TabBar`, la coque d'une PWA mobile que le socle ne portait pas, `ChatBubble`, la bulle de conversation — de la présentation pure, elle ne connaît ni le persona ni le modèle de message —, et `RangeSlider`, le curseur de plage à deux poignées. 40 en tout, aucun retrait.
**En classes, sans composant (pour l'instant) :** `.ds-option`, `.ds-chip`, `.ds-steps`, `.ds-counter`, `.ds-badge--card`, `.ds-card.is-selected` + `.ds-card__flag`, `.ds-portrait`, `.ds-dot` — voir `PORTAGE.md`, et `docs/PROMPTS.md` § classes pour leur usage.
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
| 2026-09-30 | Cible tactile : au moins 44 px AU DOIGT, pas forcément à l'œil (§ 5). La chip reste à 36 px visibles et gagne une zone de toucher invisible de `--space-1` en haut et en bas | la maquette A3 tient la chip à 36 px ; la règle se tient au doigt, comme la `TabBar` par ses marges d'item. Condition : au moins `--space-2` entre deux rangées de chips. L'écart « non tranché » de `docs/accessibilite.md` § 4 est fermé |
| 2026-10-01 | Hauteurs en multiples de 4, posées (`min-height` + `padding-block:0`), jamais déduites du padding (§ 5). `--control-md` 48 fixe (fin du 44 sous 64rem), `--control-sm` 40 devient une vraie taille, `--control-lg` 52 réservé au site vitrine ; chip 40 en texte 15 ; bouton-icône 40 · 48 · 56 ; badge 28 ; compteur 20 ; interrupteur 28 (inset 4) ; option 48 dans les deux tailles, texte 15 | maquettes « Parcours cœur » du 01/10 : les hauteurs émergentes tombaient hors grille (44,8 · 52,5 · 46,5 · 29 · 38 / 42 · 18 · 26) et `--control-sm` n'était qu'un alias. Règle d'usage 48 / 40 écrite au § 5 |
| 2026-10-01 | `--icon-control-lg` 48 → 56 | à 48, `md` et `lg` auraient rendu le même carré — la prop qui ment de `GOVERNANCE.md` |
| 2026-10-01 | Option : `padding-block:var(--space-2)` plutôt que 0 | sans effet sur une ligne (le `min-height` décide), il garde de l'air à un libellé qui passe à la ligne |
| 2026-10-01 | Contrôles `sm` à 40, sous la règle maison des 44 au doigt — écart ASSUMÉ (§ 5) | ce sont des contrôles internes à un composant ou une barre ; WCAG 2.5.8 (24) est tenu |
| 2026-10-01 | `.ds-badge--lg` (32, texte 14) — l'étiquette d'intérêt de la fiche persona ; `Badge pad="lg"` | nommée `--lg` et non `--md` : `pad="md"` est déjà le défaut à 28 |
| 2026-10-01 | `RangeSlider` — 40e composant, troisième ajout ASSUMÉ (§ 8) ; sa portion choisie rejoint les remplissages en dégradé (§ 6) | la tranche d'âge de l'onboarding (A5). Générique : aucun mot du métier dans son nom, aucune donnée métier. Rail `--border` en clair, `--surface-alt` en sombre : sur `--border` la portion choisie tombait à 2,56:1 en sombre, et `--surface-alt` disparaissait dans la crème en clair |
| 2026-10-01 | Doctrine de l'action DANS un champ : elle n'agit que sur la valeur du champ (afficher / masquer, effacer) — `Input action` ; toute autre action reste un `IconButton` posé à côté. `eye-off` entre au catalogue (49 glyphes) | écrans d'auth (AUTH 1, 2, 5) : l'œil du mot de passe vit dans le champ. L'ancienne règle « une action dans un champ = IconButton à côté » n'avait pas d'exception, et celle-ci est attendue partout |
| 2026-10-01 | `FormField` : erreur ET aide affichées ensemble (erreur d'abord), et reliées au contrôle par `aria-describedby` ; `group` pour plusieurs contrôles sous un libellé | AUTH 5a : l'erreur dit ce qui ne va pas, l'aide redit la règle — l'erreur qui remplaçait l'aide retirait la règle au moment où on en a besoin. Un lecteur d'écran annonçait « invalide » sans dire pourquoi |
| 2026-10-01 | `Select` : padding droit 48 → 40 (ce que demande le chevron) ; `placeholder` en `--text-muted` | AUTH 2d : la date en trois `Select` sur 390 px coupait « Jour », « septembre » et « Année » à 48 |
| 2026-10-01 | `Checkbox error` ; case et rond alignés sur la PREMIÈRE ligne d'un libellé long (`1lh`) | AUTH 2d : le message s'aligne sur le texte du libellé ; la case ne change pas de couleur, le message porte l'erreur |
| 2026-10-01 | § 5 : « Envoyer » tranché — le bouton suit sa BARRE, pas son libellé. Au pied d'un formulaire → 48 ; dans la barre de saisie du chat → `IconButton sm` (40), aligné en bas sur le `Textarea sm` (40 sur une ligne) | « Envoyer » figurait dans les deux listes ; le libellé ne dit rien de la taille, c'est le contenant qui décide |
| 2026-10-01 | Palier `--text-meta` (12, sans interlettrage) et utilitaire `text-meta` — l'horodatage, la méta de liste | le seul 12 px était `--text-eyebrow`, capitales espacées : une heure s'écrivait « 2 1 : 4 2 ». Ajouté à `PALIERS_TYPO`, sinon `cn()` le prenait pour une couleur |
| 2026-10-01 | Un lien dans `.ds-error` / `.ds-help` prend la couleur du message, souligné et en semi-gras | lien et texte d'erreur mesurent 1,01:1 en sombre et 1,03:1 en clair (ΔE OKLab 4,1 / 4,8) : une nuance de teinte seule, sous WCAG 1.4.1. Deux couleurs qui tiennent chacune 4,5:1 sur la même surface ne peuvent pas s'écarter de 3:1 : l'indice est le soulignement. Palette intacte ; décaler le rouge sombre vers l'orangé (`#f2a088`) a été mesuré (ΔE 6,2, contraste inchangé à 1,03) et écarté |
| 2026-10-01 | `log-out` au catalogue (50 glyphes) | « Se déconnecter », hub des réglages |
| 2026-10-01 | `heart` au catalogue (51 glyphes) | « Mes préférences de rencontre », hub des réglages |
| 2026-10-01 | `RangeSlider onChangeEnd` : appelé une fois la fin de l'interaction (pointeur relâché, touche relâchée, focus perdu), jamais sans changement | enregistrer une préférence sans appeler le serveur à chaque cran ; une flèche maintenue = un appel |
| 2026-10-01 | Pas d'anneau sur un titre ou une zone de contenu en `tabindex="-1"` sans `role` (`base.css`) | le focus y est posé par programme pour l'annonce d'un changement d'étape ; 2.4.7 ne vise que ce qui s'utilise au clavier. Portée étroite : les widgets à tabindex itinérant gardent leur anneau |
