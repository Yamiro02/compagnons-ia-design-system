# Accessibilité — le contraste du système, mesuré

> ⚠️ **LES CHIFFRES DE CE DOCUMENT SONT CEUX DE LA MARQUE D'EXEMPLE.** Chaque projet a les
> siens : une palette différente produit d'autres ratios et d'autres écarts assumés.
> Régénérez-les pour votre marque avec `node check-contrast.mjs --table`, et remplacez les
> tableaux ci-dessous. Ce qui NE change pas d'un projet à l'autre, c'est la liste des paires
> mesurées et les garanties de comportement — c'est pour ça que le document est livré.

> **Ce document ne s'écrit pas à la main.** Les deux tableaux sortent de
> `node check-contrast.mjs --table`, qui lit les valeurs réelles de
> `src/styles/brand-example.css` — la marque du dépôt. `node check-contrast.mjs` sans argument
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

42 paires sur 50, dans les deux thèmes.

| Paire | contenu | seuil | clair | sombre |
|---|---|--:|--:|--:|
| `texte courant sur --background` | 16 / 400 | 4,5 | 15,18 | 15,54 |
| `texte courant sur --card` | 16 / 400 | 4,5 | 16,32 | 13,58 |
| `--text-secondary sur --card` | 16 / 400 | 4,5 | 10,40 | 10,32 |
| `.caption — --text-muted sur --card` | 13 / 500 | 4,5 | 6,23 | 6,40 |
| `.ds-input::placeholder` | 15 / 400 | 4,5 | 6,52 | 6,40 |
| `.ds-tooltip__bubble` | 13 / 600 | 4,5 | 15,70 | 16,32 |
| `a{} au repos sur --background` | 16 / 400 | 4,5 | 7,52 | 9,01 |
| `a{} au repos sur --card` | 16 / 400 | 4,5 | 8,09 | 7,87 |
| `a:hover — dérivé vers --foreground` | 16 / 400 | 4,5 | 8,80 | 10,00 |
| `.ds-navlink.is-active` | 16 / 500 | 4,5 | 8,46 | 7,87 |
| `.ds-sidenav.is-active` | 15 / 500 | 4,5 | 7,18 | 7,22 |
| `.ds-badge--accent` | 12 / 700 | 4,5 | 6,94 | 6,76 |
| `.ds-banner--info` | 15 / 400 | 4,5 | 6,94 | 6,76 |
| `.ds-cal__day.is-today` | 14 / 700 | 4,5 | 8,09 | 7,87 |
| `.ds-pastille--brand — icône` | icône | 3 | 7,46 | 5,97 |
| `.ds-icon-btn[aria-pressed] — icône` | icône | 3 | 6,94 | 6,76 |
| `.ds-error` | 13 / 500 | 4,5 | 8,38 | 7,04 |
| `.ds-dropdown__item--danger` | 14 / 400 | 4,5 | 8,38 | 7,04 |
| `.ds-actionsheet__item--danger` | 15 / 500 | 4,5 | 8,38 | 7,04 |
| `.ds-badge--coral sur --card` | 12 / 700 | 4,5 | 6,88 | 6,70 |
| `.ds-badge--coral sur --background` | 12 / 700 | 4,5 | 6,43 | 7,81 |
| `.ds-badge--amber sur --card` | 12 / 700 | 4,5 | 6,21 | 6,36 |
| `.ds-badge--amber sur --background` | 12 / 700 | 4,5 | 5,80 | 7,44 |
| `.ds-badge--danger sur --card` | 12 / 700 | 4,5 | 6,69 | 6,61 |
| `.ds-badge--danger sur --background` | 12 / 700 | 4,5 | 6,25 | 7,52 |
| `.ds-badge--warning sur --card` | 12 / 700 | 4,5 | 5,86 | 7,95 |
| `.ds-badge--warning sur --background` | 12 / 700 | 4,5 | 5,50 | 9,13 |
| `.ds-badge--success sur --card` | 12 / 700 | 4,5 | 6,06 | 7,31 |
| `.ds-badge--success sur --background` | 12 / 700 | 4,5 | 5,66 | 8,46 |
| `.ds-badge--neutral sur --card` | 12 / 700 | 4,5 | 6,55 | 8,89 |
| `.ds-badge--neutral sur --background` | 12 / 700 | 4,5 | 6,09 | 10,43 |
| `.ds-badge--outline` | 12 / 700 | 4,5 | 10,40 | 10,32 |
| `survol — --foreground sur --surface-alt` | 15 / 600 | 4,5 | 14,48 | 12,46 |
| `.ds-btn--primary — label sur --primary à plat` | 15 / 600 | 4,5 | 5,36 | 4,88 |
| `.ds-btn--primary — label sur --brand-to` | 15 / 600 | 4,5 | 7,23 | 7,31 |
| `.ds-btn--danger — label sur --destructive` | 15 / 600 | 4,5 | 6,93 | 5,00 |
| `.ds-cal__day.is-selected` | 14 / 600 | 4,5 | 5,36 | 4,88 |
| `anneau de focus --ring sur --background` | contour 2px | 3 | 4,76 | 8,12 |
| `.ds-choice coché — aplat --primary` | contrôle | 3 | 4,76 | 5,28 |
| `.ds-switch actif — piste --primary` | contrôle | 3 | 4,76 | 5,28 |
| `.ds-progress__bar sur son rail` | graphique | 3 | 4,54 | 4,23 |

---

## 3. Les écarts assumés

9 paires. Chacune est déclarée **dans le fichier de marque**, `src/styles/brand-example.css`,
par un bloc `@a11y-assume:` — pas dans le script. Le script porte la mécanique, la marque
porte ses renoncements : un client qui écrit sa marque repart d'une liste VIDE et n'hérite
d'aucune dérogation qu'il n'a pas prise. Le build tombe si une **dixième** apparaît.

| Paire | contenu | seuil | clair | sombre |
|---|---|--:|--:|--:|
| `.ds-btn--primary — label sur --brand-from (pire arrêt)` | 15 / 600 | 4,5 | 3,29 ✗ | 8,23 |
| `.ds-btn--primary — label sur --brand-via` | 15 / 600 | 4,5 | 3,81 ✗ | 8,79 |
| `.eyebrow / .accent — dégradé clippé en texte` | 12 / 600 | 4,5 | 2,92 ✗ | 8,91 |
| `.ds-input — bordure --input vs page` | contour 1.5px | 3 | 1,23 ✗ | 2,10 ✗ |
| `.ds-input — bordure --input vs remplissage` | contour 1.5px | 3 | 1,38 ✗ | 1,55 ✗ |
| `.ds-input — remplissage vs page` | aplat | 3 | 1,12 ✗ | 1,36 ✗ |
| `.ds-card — bordure --border vs page` | contour 1px | 3 | 1,23 ✗ | 1,56 ✗ |
| `.ds-sep — filet --border sur --card` | filet 1px | 3 | 1,32 ✗ | 1,37 ✗ |
| `.ds-input.is-error — bordure --destructive` | contour 1.5px | 3 | 6,93 | 2,69 ✗ |

### 3.1 · Le blanc sur les arrêts clairs du dégradé — `3,29` au pire point

**L'écart.** Le CTA primaire porte `--brand-gradient`. Ses deux arrêts les plus clairs —
`--brand-from` `#34a06a` et `--brand-via` `#0e8fa8` — laissent le label blanc à **3,29**
et **3,81** en thème clair. Le label du bouton mesure **15 px / 600** : il ne bénéficie
**pas** du seuil « gros texte » de 3:1, qui commence à 18,66 px en gras. En thème sombre,
la marque d'exemple bascule le label sur l'encre et éclaircit ses arrêts : les mêmes
paires y passent à 8,23 et 8,79.

**Pourquoi il est assumé.** Le départ vert-cyan du dégradé est l'identité de cette
palette ; le tenir au blanc demanderait de l'assombrir jusqu'à cesser d'être elle. Un
écart de ce type devient acceptable **à condition d'être écrit** — c'est ce que fait le
bloc `@a11y-assume:` du fichier de marque.

**Ce qui l'atténue.** Le CTA n'est jamais le seul chemin vers une action : il porte un
libellé explicite, il est atteignable au clavier, son anneau de focus mesure 4,76:1 en
clair et 8,12:1 en sombre. Aucune information n'existe uniquement dans ce contraste.

**Le remède, si le client ne peut pas l'assumer.** Basculer `--primary-foreground` sur
l'encre (`--tone-dark`) dans les deux thèmes — c'est déjà ce que fait le thème sombre de
la marque d'exemple, et c'est ce qui y fait passer les mêmes arrêts au-dessus de 8. C'est
une décision d'identité, pas une correction technique.

### 3.2 · Le dégradé clippé en texte — `2,92`

**L'écart.** `.eyebrow` (12 px / 600) et `.accent` clippent `--brand-gradient` dans le
texte. Sur `--background` clair, le pire arrêt mesure **2,92**. En sombre le même dégradé
passe (8,91) : l'écart est un défaut du thème clair seul. C'est une propriété de la
TECHNIQUE — toute marque qui clippe un dégradé d'aplat en texte pique au même endroit.

**Pourquoi il est assumé.** C'est **la signature** : un mot en dégradé par titre. La
corriger reviendrait à la supprimer. `.accent` s'emploie dans un H2 de 29 px — donc en
« gros texte », seuil 3:1 — et même là 2,92 ne passe pas ; `.eyebrow`, à 12 px, encore
moins. L'écart est donc réel dans les deux régimes et pleinement assumé.

**Ce qui l'atténue.** `.accent` marque **un mot d'un titre déjà lisible** ; `.eyebrow` est un
sur-titre décoratif qui **duplique** toujours une information portée par le titre en dessous.
Aucun des deux ne porte une information unique. Le socle ne les utilise nulle part pour un
libellé fonctionnel.

**Le remède.** Un `--brand-gradient-text` bâti sur `--primary-readable` plutôt que sur les
arrêts d'aplat, clippé par `.eyebrow` / `.accent`. Le mot reste en dégradé, il passe le
seuil. Non fait ici : cela change l'aspect de la signature, et c'est une décision du
concepteur de la marque.

### 3.3 · Les contours et filets neutres — `1,12` à `1,56`

**L'écart.** Aucune frontière neutre du système n'atteint 3:1. Le contour d'un champ mesure
**1,23** contre la page et **1,38** contre son propre remplissage ; le remplissage du champ
contre la page, **1,12**. Bordure de carte et filet de séparateur, même ordre. WCAG 1.4.11
demande 3:1 pour ce qui est nécessaire à **identifier un composant**.

**Pourquoi il est assumé.** Les frontières à peine posées **sont** un choix d'identité —
la marque d'exemple le reprend du gabarit (« contours doux »). Les remonter à 3:1 impose
des gris moyens francs sur chaque carte, chaque tableau, chaque séparateur et chaque
champ. C'est un autre design.

**Ce qui l'atténue.** Un champ ne se signale pas seulement par son contour : il a un
remplissage distinct de la page, une hauteur de rail de 3 rem, un libellé associé, un
placeholder à 6,52:1, et **au focus** une bordure `--ring` qui, elle, tient 4,76:1 en clair
et 8,12:1 en sombre. L'état d'erreur tient 6,93 en clair ; en sombre, la remontée du remplissage --secondary le laisse à 2,69 — assumé (§ 3.4), le message et l'icône d'erreur portent l'état. Ce qui
manque est le contraste au **repos**, pas la possibilité d'identifier ou d'utiliser le
contrôle.

**Le remède.** `--border` et `--input` sont des jetons du contrat de marque : un client qui
doit tenir 1.4.11 les remonte dans SON fichier de marque, sans ouvrir un fichier du socle,
et vérifie d'un `node check-contrast.mjs` que les paires de contour passent 3:1.

---

### 3.4 · La bordure d'erreur sur le remplissage sombre — `2,69`

**L'écart.** En thème sombre, `--secondary` monte d'un cran au-dessus de la carte pour que
le champ se voie (l'échelle des surfaces, mesurée par `check-surfaces.mjs`). La bordure
d'erreur `--destructive` sur ce remplissage plus clair retombe à **2,69** — sous le seuil
de 3:1 des contours.

**Pourquoi il est assumé.** L'éclaircir jusqu'à 3:1 ferait passer le label blanc du bouton
danger sous 4,5:1 : les deux seuils sont incompatibles à ce remplissage. Et l'état d'erreur
n'est jamais porté par la seule bordure — `FormField` affiche toujours le message en
`--destructive-readable` avec son icône. La bordure est un renfort, pas le signal.

> **Sur la marque Compagnons IA, cet écart N'EXISTE PLUS** — et il n'a pas été fermé en
> déplaçant le jeton, mais en déplaçant la PORTEUSE. Le champ est blanc (`--card`) depuis la
> doctrine « le blanc est la surface portée », pas `--secondary` : le dilemme des deux seuils
> incompatibles disparaît avec le remplissage qui le créait. Avec `--destructive` sombre à
> `#d04444`, la paire mesure **5,47 en clair, 3,59 en sombre** — conforme, et son
> `@a11y-assume` a été retiré du fichier de marque. Le paragraphe ci-dessus reste vrai de la
> marque d'exemple, celle que ce document mesure.

## 4. Ce que ce document ne couvre pas

Le contraste des couleurs, et lui seul. Trois points relèvent de l'accessibilité mais pas
de la mesure faite ici :

- **1.4.1 Utilisation de la couleur.** `a{}` ne pose **pas** de soulignement : dans un
  paragraphe, un lien ne se distingue que par sa couleur. Le corriger change le rendu de
  toute prose du système — décision de conception, à trancher à part.
- **1.4.11 sur les états.** Les états `:hover` reposent sur un écart de surface de ~1,08,
  très en dessous de 3:1. C'est un usage courant et non couvert stricto sensu par 1.4.11
  (l'état reste identifiable par le curseur et le focus), mais il mérite d'être connu.
- **2.4.7, 1.4.12, 1.4.10.** Focus, espacement du texte, redimensionnement : hors mesure.
- **2.5.8 Taille de la cible (minimum) — un écart ASSUMÉ, hors contraste.** Tout le système
  tient le rail 44 px, avec **une** exception : `.ds-tabbar__item`, l'onglet de la `TabBar`
  mobile, mesure `2.25rem` (36 px) de haut. La barre est une capsule FLOTTANTE : à 44 px de
  haut par item elle mange le contenu qu'elle survole, et la coque cesse d'être une coque.
  Ce qui rend l'écart tenable, et qui doit être vérifié si la règle bouge :
  la cible RÉELLE au doigt vaut **44 px** marges comprises (36 + 4 px de marge d'item de
  chaque côté), rien d'autre n'est cliquable dans cet intervalle — il n'y a donc aucune
  cible voisine à rater — et les quatre onglets occupent chacun un quart de la largeur, très
  au-delà du minimum en largeur. Le jour où la barre cesse de flotter, l'item reprend 44 px.

---

## 5. Refaire la mesure

```bash
node check-contrast.mjs           # le contrôle — sort non-zéro sur un écart non déclaré
node check-contrast.mjs --table   # les deux tableaux de ce document, en markdown
TOKENS=chemin/vers/brand-client.css node check-contrast.mjs   # la palette d'un client
```
