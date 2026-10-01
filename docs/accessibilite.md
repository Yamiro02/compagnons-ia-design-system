# Accessibilité — le contraste du système, mesuré

> **LES CHIFFRES DE CE DOCUMENT SONT CEUX DE LA MARQUE COMPAGNONS IA**, mesurés sur
> `src/styles/brand-compagnons-ia.css`. Ils se régénèrent par
> `node check-contrast.mjs --table` — les deux tableaux ci-dessous en sortent tels quels.
> **À refaire à chaque lot qui touche une couleur ou ajoute une paire**, sinon le document
> décrit une palette qui n'existe plus. Ce qui ne change pas d'une marque à l'autre, c'est
> la liste des paires mesurées et les garanties de comportement.

> **Ce document ne s'écrit pas à la main.** Les deux tableaux sortent de
> `node check-contrast.mjs --table`, qui lit les valeurs réelles de
> `src/styles/brand-compagnons-ia.css` — la marque du dépôt. `node check-contrast.mjs` sans argument
> mesure **toutes** les marques présentes et imprime une ligne par marque. Le même contrôle
> tourne à chaque `npm run lint` et **fait tomber le build** si une paire passe sous son
> seuil sans être déclarée.
>
> Cible : **WCAG 2.2 niveau AA**. 4,5:1 pour le texte courant (1.4.3) · 3:1 pour le gros
> texte, les icônes porteuses de sens et les contours de contrôle (1.4.11). Les fonds
> translucides — pilules, `--grad-soft` — sont composités sur leur surface porteuse
> avant mesure : c'est la couleur que l'œil reçoit, pas celle qui est écrite.
>
> **Un template, pas un design system.** Le socle ne porte AUCUNE couleur : elles viennent
> toutes du fichier de marque, que le client écrit. `TOKENS=<son fichier>
> node check-contrast.mjs` mesure SA palette. C'est le sens de ce document : un écart
> d'accessibilité doit être une décision écrite du concepteur, jamais une découverte faite
> par l'audit du client.

---

## 1. La règle qui est sortie de la mesure

**`--primary` et `--destructive` sont des couleurs de REMPLISSAGE. Elles ne sont jamais une
`color:`.**

Une couleur conçue pour tenir un aplat de bouton ne peut pas, en général, atteindre 4,5:1
comme texte sur une surface claire : un audit a déjà mesuré une couleur de remplissage à
**3,12 sur `--background`** — et c'était la couleur de **tous les liens** du système, plus
l'onglet de nav actif, le lien de sidebar actif, le badge accent, le bandeau d'info, la
date du jour du calendrier.

Le contrat porte donc deux **jumeaux lisibles** — la même marque, rendue lisible :

| jeton | clair | sombre | garantie du contrat |
|---|---|---|---|
| `--primary-readable` | `#0a5468` | `#5cc4dc` | ≥ 4,5:1 sur `--background`, `--card`, `--popover`, `--secondary`, `--accent`, `--surface-alt` |
| `--destructive-readable` | `#8a2340` | `#ef91a8` | idem |

Les lignes `a{}`, `.ds-navlink.is-active`, `.ds-error`, etc. du tableau § 2 mesurent ces
jumeaux : de **7,18 à 8,46** en clair pour le primaire, **7,04 à 8,38** pour le destructif.
Le survol de lien ne demande pas de troisième jeton : il se **dérive** en tirant le jumeau
vers `--foreground` (`color-mix(in srgb, var(--primary-readable) 80%, var(--foreground))`),
ce qui ne peut qu'**augmenter** le ratio — 8,80 en clair, 10,00 en sombre.

La règle se vérifie d'un grep, et c'est ce qui la rend tenable :

```bash
grep -rE '(^|[^-[:alnum:]])color:var\(--(primary|destructive)\)' src/styles/
```

Une sortie vide = la règle tient. Aujourd'hui : vide.

---

## 2. Les paires conformes

59 paires sur 65, dans les deux thèmes.

| Paire | contenu | seuil | clair | sombre |
|---|---|--:|--:|--:|
| `texte courant sur --background` | 16 / 400 | 4,5 | 14,05 | 15,51 |
| `texte courant sur --card` | 16 / 400 | 4,5 | 15,26 | 13,70 |
| `--text-secondary sur --card` | 16 / 400 | 4,5 | 10,21 | 10,06 |
| `.caption — --text-muted sur --card` | 13 / 500 | 4,5 | 6,34 | 5,78 |
| `.ds-input::placeholder` | 15 / 400 | 4,5 | 6,34 | 5,78 |
| `.ds-tooltip__bubble` | 13 / 600 | 4,5 | 14,05 | 15,26 |
| `a{} au repos sur --background` | 16 / 400 | 4,5 | 7,38 | 8,73 |
| `a{} au repos sur --card` | 16 / 400 | 4,5 | 8,01 | 7,71 |
| `a:hover — dérivé vers --foreground` | 16 / 400 | 4,5 | 8,59 | 9,80 |
| `.ds-navlink.is-active` | 16 / 500 | 4,5 | 8,01 | 7,71 |
| `.ds-sidenav.is-active` | 15 / 500 | 4,5 | 7,38 | 8,73 |
| `.ds-badge--accent` | 12 / 700 | 4,5 | 6,50 | 6,40 |
| `.ds-banner--info` | 15 / 400 | 4,5 | 6,50 | 6,40 |
| `.ds-chip.is-selected` | 15 / 600 | 4,5 | 6,50 | 6,40 |
| `.ds-cal__day.is-today` | 14 / 700 | 4,5 | 8,01 | 7,33 |
| `.ds-portrait — initiale sur la vignette` | 52 / 700 | 3 | 3,91 | 5,81 |
| `.ds-pastille--brand — icône` | icône | 3 | 7,09 | 6,70 |
| `.ds-pastille--brand-solid — glyphe sur --brand-from` | icône | 3 | 6,44 | 4,63 |
| `.ds-pastille--brand-solid — glyphe sur --brand-via` | icône | 3 | 7,16 | 5,48 |
| `.ds-pastille--brand-solid — glyphe sur --brand-to` | icône | 3 | 8,01 | 6,51 |
| `.ds-icon-btn[aria-pressed] — icône` | icône | 3 | 6,50 | 6,40 |
| `.ds-error` | 13 / 500 | 4,5 | 7,76 | 7,63 |
| `.ds-dropdown__item--danger` | 14 / 400 | 4,5 | 7,76 | 7,25 |
| `.ds-actionsheet__item--danger` | 15 / 500 | 4,5 | 7,76 | 7,25 |
| `.ds-badge--coral sur --card` | 12 / 700 | 4,5 | 6,67 | 6,85 |
| `.ds-badge--coral sur --background` | 12 / 700 | 4,5 | 6,19 | 7,81 |
| `.ds-badge--amber sur --card` | 12 / 700 | 4,5 | 5,74 | 7,42 |
| `.ds-badge--amber sur --background` | 12 / 700 | 4,5 | 5,31 | 8,49 |
| `.ds-badge--danger sur --card` | 12 / 700 | 4,5 | 6,35 | 6,95 |
| `.ds-badge--danger sur --background` | 12 / 700 | 4,5 | 5,87 | 7,86 |
| `.ds-badge--warning sur --card` | 12 / 700 | 4,5 | 6,37 | 8,02 |
| `.ds-badge--warning sur --background` | 12 / 700 | 4,5 | 5,90 | 9,18 |
| `.ds-badge--success sur --card` | 12 / 700 | 4,5 | 6,14 | 8,29 |
| `.ds-badge--success sur --background` | 12 / 700 | 4,5 | 5,71 | 9,46 |
| `.ds-badge--neutral sur --card` | 12 / 700 | 4,5 | 6,53 | 7,82 |
| `.ds-badge--neutral sur --background` | 12 / 700 | 4,5 | 6,04 | 9,00 |
| `.ds-badge--outline` | 12 / 700 | 4,5 | 10,21 | 10,06 |
| `survol — --foreground sur --surface-alt` | 15 / 600 | 4,5 | 13,46 | 12,36 |
| `.ds-btn--primary — label sur --primary à plat` | 15 / 600 | 4,5 | 6,44 | 4,63 |
| `.ds-btn--primary — label sur --brand-from (pire arrêt)` | 15 / 600 | 4,5 | 6,44 | 4,63 |
| `.ds-btn--primary — label sur --brand-via` | 15 / 600 | 4,5 | 7,16 | 5,48 |
| `.ds-btn--primary — label sur --brand-to` | 15 / 600 | 4,5 | 8,01 | 6,51 |
| `.ds-btn--danger — label sur --destructive` | 15 / 600 | 4,5 | 5,47 | 4,57 |
| `.ds-cal__day.is-selected` | 14 / 600 | 4,5 | 6,44 | 4,63 |
| `.ds-bubble--me — texte sur --brand-from` | 15 / 400 | 4,5 | 6,44 | 4,63 |
| `.ds-counter — chiffre sur --brand-from` | 10 / 700 | 4,5 | 6,44 | 4,63 |
| `.ds-bubble--me — texte sur --brand-via` | 15 / 400 | 4,5 | 7,16 | 5,48 |
| `.ds-counter — chiffre sur --brand-via` | 10 / 700 | 4,5 | 7,16 | 5,48 |
| `.ds-bubble--me — texte sur --brand-to` | 15 / 400 | 4,5 | 8,01 | 6,51 |
| `.ds-counter — chiffre sur --brand-to` | 10 / 700 | 4,5 | 8,01 | 6,51 |
| `anneau de focus --ring sur --background` | contour 2px | 3 | 5,93 | 7,26 |
| `.ds-choice coché — aplat --primary` | contrôle | 3 | 5,93 | 4,01 |
| `.ds-switch actif — piste --primary` | contrôle | 3 | 5,93 | 4,01 |
| `.ds-input-action__btn — icône --text-muted sur le champ` | icône | 3 | 6,34 | 5,78 |
| `.ds-progress__bar sur son rail` | graphique | 3 | 5,68 | 3,20 |
| `.ds-range__fill sur son rail` | graphique | 3 | 4,75 | 3,20 |
| `.ds-range__thumb — bordure --primary sur la page` | contour 2px | 3 | 5,93 | 4,01 |
| `.ds-option / .ds-chip / .ds-card.is-selected — bordure --primary` | contour 1.5px | 3 | 6,44 | 3,54 |
| `.ds-input.is-error — bordure --destructive` | contour 1.5px | 3 | 5,47 | 3,59 |

---

## 3. Les écarts assumés

6 paires. Chacune est déclarée **dans le fichier de marque**,
`src/styles/brand-compagnons-ia.css`, par un bloc `@a11y-assume:` — pas dans le script. Le
script porte la mécanique, la marque porte ses renoncements : une autre marque repart d'une
liste VIDE et n'hérite d'aucune dérogation qu'elle n'a pas prise. Le build tombe si une
**septième** apparaît, et il tombe AUSSI si l'une des six cesse d'être un écart sans qu'on
retire sa déclaration.

| Paire | contenu | seuil | clair | sombre |
|---|---|--:|--:|--:|
| `.eyebrow / .accent — dégradé clippé en texte` | 12 / 600 | 4,5 | 5,93 | 4,01 ✗ |
| `.ds-input — bordure --input vs page` | contour 1.5px | 3 | 1,49 ✗ | 2,06 ✗ |
| `.ds-input — bordure --input vs remplissage` | contour 1.5px | 3 | 1,62 ✗ | 1,82 ✗ |
| `.ds-input — remplissage vs page` | aplat | 3 | 1,09 ✗ | 1,13 ✗ |
| `.ds-card — bordure --border vs page` | contour 1px | 3 | 1,25 ✗ | 1,57 ✗ |
| `.ds-sep — filet --border sur --card` | filet 1px | 3 | 1,35 ✗ | 1,38 ✗ |

### 3.1 · Le blanc sur les arrêts clairs du dégradé — écart FERMÉ

**L'écart, chez le gabarit.** Le CTA primaire porte `--brand-gradient` ; sur la palette
vert-cyan d'origine, ses deux arrêts les plus clairs laissaient le label blanc à 3,29 et
3,81 en thème clair — sous 4,5, et sans bénéfice du seuil « gros texte » (15 px / 600).

**Pourquoi il n'existe plus ici.** Le grenat de Compagnons IA est franchement plus sombre
que le vert-cyan : le label blanc mesure **6,44** en clair et **4,63** en sombre sur le pire
arrêt (`--brand-from`), **8,01 / 6,51** sur le plus foncé. Rien à assumer, rien à corriger —
c'est la palette qui a changé, pas la règle.

**Ce qu'il faut en retenir.** Une marque dont les arrêts de dégradé sont clairs rouvrira cet
écart, et le garde le dira. Le remède documenté reste : basculer `--primary-foreground` sur
l'encre plutôt que sur le blanc. C'est une décision d'identité, pas une correction technique.

### 3.2 · Le dégradé clippé en texte — `4,01` en sombre

**L'écart.** `.eyebrow` (12 px / 600) et `.accent` clippent `--brand-gradient` dans le
texte. Sur `--background`, le pire arrêt mesure **5,93 en clair** — qui passe — et
**4,01 en sombre**, qui ne passe pas. C'est l'inverse du gabarit, dont l'écart était côté
clair : la position du défaut suit la palette, mais le défaut, lui, est une propriété de la
TECHNIQUE — toute marque qui clippe un dégradé d'aplat dans du texte pique quelque part.

**Pourquoi il est assumé.** C'est **la signature** : un mot en dégradé par titre. La
corriger reviendrait à la supprimer.

**Ce qui l'atténue.** `.accent` marque **un mot d'un titre déjà lisible** ; `.eyebrow` est un
sur-titre décoratif qui **duplique** toujours une information portée par le titre en dessous.
Aucun des deux ne porte une information unique, et l'accent est rationné par la liste fermée
du § 3 de `docs/DESIGN.md`. Là où le clip devenait réellement illisible — l'initiale d'un
portrait sur sa vignette, 1,90 en sombre — il a été **remplacé**, pas assumé : voir
`.dark .ds-portrait>:not(.halo)` dans `patterns.css`.

**Le remède.** Un `--brand-gradient-text` bâti sur `--primary-readable` plutôt que sur les
arrêts d'aplat, clippé par `.eyebrow` / `.accent`. Le mot reste en dégradé, il passe le
seuil. Non fait : cela change l'aspect de la signature, et c'est une décision de marque.

### 3.3 · Les contours et filets neutres — `1,09` à `2,06`

**L'écart.** Aucune frontière neutre du système n'atteint 3:1. Le contour d'un champ mesure
**1,49** contre la page et **1,62** contre son propre remplissage ; le remplissage du champ
contre la page, **1,09**. Bordure de carte (**1,25**) et filet de séparateur (**1,35**),
même ordre. WCAG 1.4.11 demande 3:1 pour ce qui est nécessaire à **identifier un composant**.

**Pourquoi il est assumé.** Les frontières à peine posées **sont** un choix d'identité —
« à élégance égale, on choisit toujours le plus chaleureux », et une bordure franche sur du
crème est froide. Les remonter à 3:1 impose des bruns moyens sur chaque carte, chaque
tableau, chaque séparateur et chaque champ. C'est un autre design.

**Ce qui l'atténue.** Un champ ne se signale pas seulement par son contour : il est BLANC
sur une page crème (doctrine « le blanc est la surface portée »), il tient le rail de
48 px, il a un libellé associé, un placeholder à **6,34:1**, et **au focus** une bordure
`--ring` qui tient le seuil. L'état d'erreur, lui, mesure **5,47 en clair et 3,59 en
sombre** — il passe, et le message et l'icône le doublent. Ce qui manque est le contraste
au **repos**, pas la possibilité d'identifier ou d'utiliser le contrôle.

**Le remède.** `--border` et `--input` sont des jetons du contrat de marque : une marque qui
doit tenir 1.4.11 les remonte dans SON fichier, sans ouvrir un fichier du socle, et vérifie
d'un `node check-contrast.mjs` que les paires de contour passent 3:1.

---

### 3.4 · La bordure d'erreur sur le remplissage sombre — écart FERMÉ

**L'écart, chez le gabarit.** En thème sombre, `--secondary` monte d'un cran au-dessus de la
carte pour que le champ se voie. La bordure d'erreur `--destructive` sur ce remplissage plus
clair retombait à 2,69, et l'éclaircir aurait fait passer le label blanc du bouton danger
sous 4,5 : deux seuils incompatibles **au même remplissage**.

**Pourquoi il n'existe plus ici, et comment.** Il n'a pas été fermé en déplaçant le jeton
mais **la PORTEUSE** : depuis la doctrine « le blanc est la surface portée », le champ est
`--card`, plus `--secondary` — et le dilemme disparaît avec le remplissage qui le créait.
Avec `--destructive` sombre à `#d04444`, la paire mesure **5,47 en clair, 3,59 en sombre**.
Son `@a11y-assume` a été retiré du fichier de marque, à la demande du garde.

**Ce qu'il faut en retenir.** Quand deux seuils se contredisent sur une même paire, regarder
la SURFACE avant de bouger la couleur : c'est souvent elle le vrai paramètre.

### 3.5 · Marque Compagnons IA — la bordure sélectionnée : écart FERMÉ

L'option (`.ds-option`), la chip (`.ds-chip`) et la carte de choix (`.ds-card.is-selected`)
sélectionnées portent une bordure 1.5px **`--primary`**. Mesure sur `--card` : **6,44** en
clair, **3,54** en sombre — seuil 3:1 des contours d'état tenu dans les deux thèmes.

Elle a d'abord été posée en `--brand-to`, l'arrêt le plus SOMBRE du dégradé : 8,01 en clair
mais **2,52** en sombre, où il perd sa distance sur les bruns-charbon. Sur la carte de choix,
la bordure est le signal visuel principal de la sélection — l'écart était réel. Il est
fermé en changeant la RÈGLE (`patterns.css`), pas un jeton, et son `@a11y-assume` a été
retiré du fichier de marque.

Le garde mesure la paire sous la clé `.ds-option / .ds-chip / .ds-card.is-selected —
bordure --primary`.

## 4. Ce que ce document ne couvre pas

Le contraste des couleurs, et lui seul. Trois points relèvent de l'accessibilité mais pas
de la mesure faite ici :

- **1.4.1 Utilisation de la couleur.** `a{}` ne pose **pas** de soulignement : dans un
  paragraphe, un lien ne se distingue que par sa couleur. Le corriger change le rendu de
  toute prose du système — décision de conception, à trancher à part.
  **Tranché pour les messages de champ** (v0.6.0) : dans `.ds-error` et `.ds-help`, le lien
  est SOULIGNÉ, en semi-gras, à la couleur du message. Mesuré avec la formule de ce garde,
  le lien (`--primary-readable`) et le texte d'erreur (`--destructive-readable`) valent
  **1,01:1 en sombre, 1,03:1 en clair** — une nuance de teinte seule (ΔE OKLab 4,1 / 4,8).
  Deux couleurs qui tiennent chacune 4,5:1 sur la même surface ne peuvent pas s'écarter de
  3:1 : l'indice non coloré était la seule issue. Aucune paire ne bouge — le lien a le
  contraste de son message, déjà mesuré (`.ds-error`, `.caption`).
- **1.4.11 sur les états.** Les états `:hover` reposent sur un écart de surface de ~1,08,
  très en dessous de 3:1. C'est un usage courant et non couvert stricto sensu par 1.4.11
  (l'état reste identifiable par le curseur et le focus), mais il mérite d'être connu.
- **2.4.7, 1.4.12, 1.4.10.** Focus, espacement du texte, redimensionnement : hors mesure.
  **Une exception écrite à l'anneau de focus** (v0.7.0) : un titre ou une zone de contenu
  (`h1`–`h6`, `main`, `section`, `article`) en `tabindex="-1"` et sans `role` n'affiche
  pas l'anneau quand une app y place le focus par programme — le titre d'une étape, pour
  que le lecteur d'écran annonce le changement. 2.4.7 demande un focus visible pour ce qui
  **s'utilise au clavier** ; ce titre n'est ni dans l'ordre de tabulation ni actionnable,
  et l'annonce ne dépend pas de l'anneau. La portée est volontairement étroite : un
  `tabindex="-1"` sur un widget (tabindex itinérant, `role` posé) garde son anneau.
- **2.5.8 Taille de la cible (minimum) — la règle : 44 px AU DOIGT, pas forcément à l'œil.**
  Toute cible offre au moins 44 px de zone de toucher ; sa partie VISIBLE peut être plus
  petite. Le rail des contrôles (`--control-md`) vaut **48 px** sur toutes les largeurs
  d'écran (v0.4.0 — il ne descend plus à 44 sous 64 rem) : il tient le seuil à l'œil comme
  au doigt. Quatre composants voient moins que 44 et touchent au moins 44 — ce sont quatre
  applications de la règle :
  - **`.ds-tabbar__item`**, l'onglet de la `TabBar` mobile, se voit à `2.25rem` (36 px) :
    la barre est une capsule FLOTTANTE, et à 44 px de haut par item elle mangerait le
    contenu qu'elle survole. Au doigt, l'item vaut **44 px** marges comprises (36 + 4 px de
    marge d'item de chaque côté) ; rien d'autre n'est cliquable dans cet intervalle — il n'y
    a donc aucune cible voisine à rater — et les quatre onglets occupent chacun un quart de
    la largeur, très au-delà du minimum en largeur. Le jour où la barre cesse de flotter,
    l'item reprend 44 px à l'œil.
  - **`.ds-chip`** (marque Compagnons IA) se voit à `--chip-h`, `2.5rem` (40 px, v0.4.0).
    Une couche invisible (`::before`) étend sa zone de toucher de `--space-1` en haut et en
    bas : **40 + 4 + 4 = 48 px** au doigt. Condition : l'écart VERTICAL entre deux rangées de
    chips ne descend jamais sous `--space-2` (8 px) — les zones de deux rangées se touchent
    alors pile, sans se chevaucher.
  - **`.ds-range__thumb`**, la poignée du `RangeSlider`, se voit à 24 px (`--space-5`) ; son
    `::before` déborde de `0.625rem` tout autour : **24 + 10 + 10 = 44 px** au doigt.
  - **`.ds-input-action__btn`**, le bouton DANS un champ (l'œil du mot de passe, v0.5.0), se
    voit à 40 px dans un champ md et à 32 dans un champ sm ; son `::before` le porte à
    **44 px** au doigt dans les deux cas. Il ne chevauche aucune autre cible : à sa gauche,
    le champ lui-même, dont il sert la valeur.

  **Un écart assumé, et il est écrit :** les contrôles **`sm`** — bouton, champ,
  bouton-icône — se voient ET se touchent à **40 px** (`--control-sm`, `--icon-control-sm`),
  sous la règle maison des 44. Ils restent au-dessus du minimum de WCAG 2.5.8 (24 px), et la
  règle d'usage les cantonne à l'intérieur d'un composant ou d'une barre (`docs/DESIGN.md`
  § 5) : ce qui conclut un écran est en `md`, à 48.

---

## 5. Refaire la mesure

```bash
node check-contrast.mjs           # le contrôle — sort non-zéro sur un écart non déclaré
node check-contrast.mjs --table   # les deux tableaux de ce document, en markdown
TOKENS=chemin/vers/brand-client.css node check-contrast.mjs   # la palette d'un client
```
