# Journal des versions — Compagnons IA

Le journal de CE design system, celui du produit. La numérotation est repartie de `0.1.0`
au portage : elle ne suit ni celle du gabarit dont le dépôt est né, ni celle d'un autre
design system de marque. L'historique du gabarit est conservé plus bas, sous son propre
titre — déplacé, pas supprimé.

La procédure de version est dans [`GOVERNANCE.md`](GOVERNANCE.md), et `node check-version.mjs`
vérifie que la version de `package.json`, la ligne d'installation du README et le tag git
concordent. Le tag n'est pas le but : c'est le péage.

---

## 0.2.0 — le portrait de repli

Une personne sans photo n'a plus l'air d'une image cassée.

### Ajouté

- **`--gradient-portrait`**, jeton de marque, déclaré en `:root` **et** en `.dark`. 165°,
  les trois arrêts de marque à 14 / 30 / 48 % mélangés dans `--card` :
  `#f2e4e8 → #e0c2ca → #c99aa4` en clair, `#3a2526 → #4e2a30 → #602c36` en sombre.
  Entré au contrat (`brand.template.css`, § 3 OBLIGATOIRE **et** bloc `.dark`) : le compte
  passe de **54 à 55 jetons obligatoires**, dont **33** à redéclarer en sombre.
- **`.ds-portrait`** dans `patterns.css` — le conteneur de la vignette : dégradé, halo
  derrière, initiale centrée. **Aucune hauteur, aucun ratio** : l'appelant pose
  `aspect-ratio` ou `height`. La typo est portée par le conteneur et **héritée** par
  l'initiale, ce qui laisse `.accent` seule sur son nœud.
- Vitrine : section **Portrait de repli** sur la page Marque — trois ratios (3/4, 1/1,
  16/9), la comparaison clair / sombre, et le repli posé à côté d'une vraie photo.

### Pourquoi la base du mélange est `--card`

La maquette écrivait le dégradé en dur en mélangeant dans **`--tone-light-alt`**, qui vaut
`#ffffff` dans les **deux** thèmes — le bloc `.dark` ne le redéclare pas. La vignette
restait donc rose clair en sombre. `--card` bascule, lui.

Et le jeton est **redéclaré en `.dark` avec la même expression**, ce qui n'est pas
cosmétique : une propriété personnalisée posée sur `:root` est calculée **une fois**, avec
les valeurs claires ; sans la redéclaration, `var(--card)` y resterait le blanc.
`check-dark-substitution.mjs` fait tomber le build sur ce cas précis.

### ⚠ L'initiale change d'encre en sombre

En clair, l'initiale reste en `.accent` — le dégradé de marque clippé dans le texte, comme
la maquette : **3,91:1** sur la vignette pâle.

En sombre, `.accent` clippe le dégradé **éclairci** (`#b95370 → #9f3b54`), deux mi-tons sur
une vignette prune de la même bande de luminance : **1,90:1**, la lettre disparaît presque.
Ce n'est pas rattrapable en assombrissant la vignette — le balayage plafonne à **2,59**
(4/8/14 % sur `--background`), toujours sous le seuil 3:1 du gros texte, pour une amplitude
de dégradé tombée à 1,06, donc un aplat.

L'initiale prend donc `--primary-readable` en aplat sous `.dark`, et la vignette garde ses
14 / 30 / 48 %. La règle est **scopée au portrait** — `.dark .ds-portrait>:not(.halo)` — et
ne nomme pas la classe fragile ; aucune classe générique ne duplique `.accent`.

La paire entre à `check-contrast.mjs` (règle de tenue : un état porté par une couleur se
mesure) : **3,91 en clair · 5,81 en sombre**, seuil 3. La porteuse mesurée est l'arrêt
**médian** du dégradé, pas le pire — contrairement à l'idiome du bouton. C'est
géométrique : le label d'un bouton couvre toute sa boîte, une initiale centrée dans une
vignette trois à quatre fois plus haute qu'elle ne touche jamais l'arrêt du bas. Contre cet
arrêt-là la paire donnerait 2,65 en clair — exact, et sans objet.

### Ce que l'app doit savoir

```tsx
<span className="ds-portrait" style={{ aspectRatio: '3 / 4' }}>
  <Halo placement="center" />
  <span className="accent">{prenom.charAt(0)}</span>
</span>
```

Le nœud `.accent` ne porte **rien d'autre** : ni classe, ni style. Tout ce qu'on pose à côté
d'elle casse le clip en silence — c'est le piège de `docs/PIEGES.md`, et
`check-fragile-classes.mjs` le surveille.

---

## 0.1.0 — marque Compagnons IA

Le portage du gabarit : grenat / crème, Nunito Sans auto-hébergée, doctrine arrondie,
surfaces blanches, `TabBar`, `ChatBubble`, les classes du parcours cœur. Non taguée — les
lots sont dans l'historique git.

---

# Historique du gabarit (avant portage)

Ce qui suit est le journal du **squelette** dont ce dépôt est né, conservé pour la
traçabilité des décisions du socle. Ces numéros de version ne sont pas ceux de ce projet.

---

## 0.6.0 — les pièges du socle cessent d'être du savoir oral

Le lot v0.20.0 de la marque, versé **intégralement**. Ce sont des protections de
compatibilité et de la doc destinée aux consommateurs : rien là-dedans n'est un traitement
visuel, donc **rien n'entre à l'inventaire des divergences assumées** — il reste ce qu'il
était, aux 24 règles de `patterns.css` près. Aucun changement de rendu, aucun changement
d'API.

### Trois gardes, portés depuis une app par la marque, versés ici

Ils lisent le CODE là où les autres lisent le CSS. `npm run lint` passe de dix à **treize
gardes** ; avec `check-classes.mjs`, qui vit dans `npm run build`, le dépôt en compte
**quatorze**.

| Garde | Ce qu'il ferme |
|---|---|
| `check-dead-utilities.mjs` | une classe que `theme.css` a supprimée et qui ne rend RIEN |
| `check-font-px.mjs` | une taille de police en pixels, qui ne suit pas `app-scale.css` |
| `check-fragile-classes.mjs` | un utilitaire posé sur `.accent` ou `.eyebrow`, qui tue le dégradé |

**Ils entrent au squelette, pas seulement au socle de marque** — c'est la même raison que
`check-classes.mjs` en 0.3.1 : un design system né de ce gabarit les emporte avec lui, et
les a **à son premier commit** plutôt qu'à son quatrième lot. Le périmètre est
**paramétrable** (défaut `src demo/src`), donc chaque app cliente les pointe sur son propre
`src/` :

```bash
node check-dead-utilities.mjs src      # THEME= et TAILWIND_THEME= si le socle est en node_modules
node check-font-px.mjs src
node check-fragile-classes.mjs src
```

Les deux choix de conception de la marque sont conservés tels quels. **Un** : ce qu'un garde
surveille est **dérivé, jamais recopié** — les classes mortes se calculent à chaque appel
(entrées natives de Tailwind moins entrées que notre `theme.css` redéclare), les classes
fragiles se dérivent du CSS (toute règle à classe unique qui clippe un fond dans son texte
ET pose `color:transparent`). **Deux** : chaque garde porte son **jumeau de falsification**
et le rejoue AVANT de scanner — 57 cas au total. Un motif qui ne reconnaît plus rien rend un
garde toujours vert, donc décoratif, et ce mode de panne est aussi silencieux que les
défauts qu'il surveille.

### ⚠️ La liste n'a pas été recopiée du socle de marque : elle a été RE-SONDÉE ici

C'est la leçon que le lot d'amont a payée. `--text-*: initial` **ne tue pas**
`--text-shadow-*` : Tailwind résout le plus long espace de noms, et une dérivation par
déduction condamnait `text-shadow-lg` à tort. La marque l'a découvert en sondant une
**compilation Tailwind réelle**, pas en raisonnant.

Ce dépôt a donc refait la sonde plutôt que de recopier — `theme.css` peut diverger entre les
deux dépôts, et c'est exactement l'écart qu'une liste recopiée masquerait. **Résultat :
aucune divergence.** 33 classes sondées sur tailwindcss 4.3.3, avec `brand-example.css`
monté :

- **muettes** — les paliers de taille natifs (`text-xs` … `text-9xl`), les six paliers
  d'interlettrage natifs (`tracking-tighter` … `tracking-widest`), `rounded` nu,
  `rounded-t`, `rounded-3xl`, `rounded-4xl`, `rounded-t-3xl` ;
- **rendues** — `text-primary` et `text-muted` (l'utilitaire `text-` lit aussi `--color-*`),
  `text-shadow-lg` / `-sm` / `-2xs` (espace de noms à part), `rounded-full` et
  `rounded-none` (valeurs statiques de l'utilitaire, pas des entrées de namespace), et tous
  les paliers du système — `text-heading`, `text-body-sm`, `text-eyebrow`,
  `tracking-display`, `tracking-chip`, `rounded-lg`, `rounded-xs`, `rounded-pill`.

La dérivation rend **64 classes mortes**, le même compte que la marque. Les cinq survivants
ci-dessus sont épinglés dans le jumeau de falsification : un garde qui crie sur du code
correct se fait désactiver aussi sûrement qu'un garde muet.

### La falsification a été REFAITE sur ce dépôt

Pas recopiée non plus. Violation introduite dans la vitrine, échec constaté, violation
retirée — pour les trois, et avec les faux positifs posés à côté dans le même nœud :

- `text-[15px]` → 1 faute, exit 1 ;
- `tracking-normal`, `rounded-4xl`, `text-lg` → 3 fautes, pendant que `text-primary`,
  `text-muted`, `rounded-full`, `rounded-none` et `text-shadow-lg` passaient ;
- `accent max-w-full` et `cn('eyebrow', dense && 'text-muted')` → 2 fautes, pendant que
  `bg-accent px-3`, `text-eyebrow font-semibold` et la branche de ternaire
  `dense ? 'accent' : 'text-muted'` passaient.

### `docs/PIEGES.md` — et son critère d'admission

Sept pièges du socle, chacun avec **ce qui casse**, **pourquoi la panne est muette**, **la
parade** et **le garde** quand il y en a un : les classes Tailwind qui n'existent pas ·
l'utilitaire de marque qui perd contre un composant (`layer(base)` contre
`layer(components)`) · le pochoir à quatre déclarations de `.accent`/`.eyebrow` · les
tailles de police en pixels · l'absence de portail — un flottant absolu clippé par le
`overflow:hidden` d'une `Card flush` · `Select` qui est un `<select>` natif · et la forme
récurrente du défaut, avec ses trois formes et ses deux questions de revue.

⚠️ **Le critère d'admission est en tête de page, avant la liste** : **un piège entre ici si
sa CAUSE est dans le code livré.** Si la cause est dans une marque, dans un environnement de
travail ou dans une décision d'app, il n'y entre pas. Sans critère, une page de pièges
devient un fourre-tout en trois mois, cesse d'être lue, et les vrais pièges repartent dans
le savoir oral qu'elle existe pour remplacer.

La page vit dans `docs/`, qui voyage avec le paquet (`files`) : une règle qui doit protéger
les apps doit être lisible DEPUIS l'app. Et **elle part avec le projet qu'on tire de ce
gabarit** — les pièges décrits viennent du SOCLE (`theme.css`, `tokens/base.css`,
`patterns.css`, `app-scale.css`), donc ils survivent au remplacement de la marque. Ce qui
change au portage, c'est la palette ; pas la cascade. C'est écrit en tête de page.

Liée depuis le tableau « Par où commencer » du README, depuis la table des documents, et
depuis la tête de `docs/PROMPTS.md`.

### `GOVERNANCE.md` — à quel moment lancer les gardes

La procédure de version listait ses six étapes sans dire QUAND jouer les gardes.
`check-version.mjs` **ne peut pas** passer avant le tag — il exige que le tag existe, c'est
son travail. La procédure passe à huit étapes, avec deux passages : les douze autres gardes
+ `demo:build` + `build` **avant** le tag, puis `npm run lint` en entier **après** le tag et
avant le push. **Rien ne part sans les treize.**

Le rappel du quatorzième y est écrit aussi : `check-classes.mjs` n'est pas dans `lint` — et
c'est voulu, `lint` doit rester lançable sans construire la vitrine — mais il est dans
`build`, donc joué à l'étape 4 et par la CI. **On ne conclut jamais de la lecture du seul
script `lint` qu'un garde ne tourne pas.**

### Les comptes de gardes, recomptés partout

Le socle de marque annonçait encore « dix » après en avoir treize ; ici les mêmes chiffres
traînaient. `README.md` disait « dix gardes » deux fois, l'en-tête de `.github/workflows/ci.yml`
« les trois gardes du dépôt », et le libellé du pas `lint` en nommait quatre. Corrigés :
**treize dans `lint`, quatorze dans le dépôt**. Vérifié en énumérant les `run:` réels du job
`qualite` — `npm ci` · `npm ci --prefix demo` · `npm run lint` · `check-catalogue` ·
`npm run build` · `npm run demo:build` — pas en lisant le seul script `lint`.

Le chiffre « 185 redéclarations de `patterns.css` », que la marque a dû retirer de ses pages
prescriptives faute d'être reproductible, **n'a jamais existé ici** : `docs/PROMPTS.md` de ce
dépôt a toujours écrit « les redéclarations de `patterns.css` », sans compte. Rien à
corriger, et `docs/PIEGES.md` arrive déjà sans.

**Vérifié avant tag :** les douze gardes hors version, `npm run demo:build`, `npm run build`
(qui joue `check-classes.mjs`). **Après tag, avant push :** `npm run lint` en entier.

## 0.5.0 — la vitrine type-checke, et l'unité du champ suit son padding

Le lot de clôture de la marque, versé — moins ce qui lui est propre, plus un bug de
portage qui n'appartient qu'ici. Rien de neuf au catalogue.

### `npm run demo:build` — 56 erreurs, et ce qu'elles cachaient

La dernière étape du job `qualite` était rouge, ici comme dans la marque. **La cause
n'est pas la plage de version déclarée, c'est le nombre de copies.** Le `paths` de
`demo/tsconfig.json` fait résoudre `../src/index.ts` : la source du socle se type contre
les `@types/react` de la RACINE pendant que les fichiers de la vitrine se typent contre
les SIENS.

⚠️ **Aligner les numéros ne suffit pas, et c'est le piège.** Passer la vitrine en `^19`
fait tomber 55 erreurs sur 56 — puis en laisse une nouvelle, `Ref<HTMLButtonElement>
n'est pas assignable à Ref<HTMLButtonElement>`. React 19 type le retour de `RefCallback`
avec un `unique symbol` : deux copies de la **même** version ne sont pas assignables
l'une à l'autre. En 18 elles l'étaient, ce qui explique qu'un dépôt ait pu vivre avec la
duplication. La vitrine ne déclare donc plus `@types/react` ni `@types/react-dom` et lit
ceux de la racine : **une seule identité de types.** Le garde-fou React 19 du squelette
est intact — la source se type contre la 19 avec un runtime en 18.

### `DatePicker` : `triggerProps.ref` devient une ref de RAPPEL

Une fois la vitrine compilée, elle a attrapé ce que `tsconfig.json` cachait en excluant
`demo` : **l'exemple `trigger` du catalogue ne compilait pas.** `triggerProps.ref` était
un objet de ref sur `HTMLElement` — invariant sur son contenu, donc refusé par le `ref`
d'un `<button>`. Le socle s'en sortait par un cast interne que la doc ne montrait pas,
**tout en présentant l'étalement nu comme LE contrat**. La vitrine recopie l'exemple au
caractère près : le contrat était faux, et rien ne le disait.

`ref` est désormais `(node: HTMLElement | null) => void`. Une ref de rappel est
**contravariante sur son paramètre** : elle s'assigne au `ref` de n'importe quelle
balise. Plus un seul cast — ni chez l'appelant, ni dans le socle, dont le bouton par
défaut se contente du `{...triggerProps}` nu. Les deux chemins redeviennent identiques,
ce qui était le point de la forme arbitrée en 0.3.1.

⚠ **Changement de TYPE public**, `DatePickerTriggerApi['triggerProps'].ref` :

- **ne casse rien pour qui étale** — `{...triggerProps}` est le cas documenté et le seul
  attesté ; un cast déjà écrit reste compilable, il devient seulement inutile ;
- **casse** un appelant qui aurait traité cette valeur comme un objet de ref et lu son
  `.current`. Ce n'était pas le contrat, mais la signature change et le journal le dit.

Recette au rendu, sur les deux chemins : ARIA posé par le socle, `aria-controls` qui
pointe le popover réel et n'existe qu'avec lui, retour de focus sur Échap **et** sur
sélection, ArrowDown qui ouvre.

### ⚠ `.ds-input-unit__label` — un bug de portage, corrigé au rendu

L'unité du champ était à `right:1rem`. C'est un **littéral copié du socle de marque**, où
`.ds-input` porte justement `padding:… 1rem` et où le nombre colle donc exactement. Ici
le champ est à `0.875rem` : l'unité rendait **2px plus à l'intérieur** que le texte
qu'elle accompagne, sur un corps de 14. Elle passe à `0.875rem`, et le commentaire dit
maintenant que cette valeur **suit** le padding de `.ds-input` au lieu de le deviner.

Bouge : tout `Input` portant une `unit` — l'unité se décale de 2px vers l'extérieur et
s'aligne sur le texte. Ne bouge pas : le reste du champ, le `padding-right` réservé
(`--space-7`) étant inchangé.

### `--shadow-glow-sm` entre au `@theme inline`

Déclaré par la marque, employé par le socle (l'état enfoncé de `.ds-btn--primary`),
jamais atteignable : une app le recopiait en `shadow-[var(--shadow-glow-sm)]`. C'est
exactement le défaut des quatre couleurs de la 0.3.1, un espace de noms plus loin — et
le commentaire qui déclarait ce balayage terminé avait donc tort d'un cran. Les **trois**
paliers de lueur sont exposés. `--shadow-logo-dot` reste dehors, et c'est écrit : sa
seule lecture est `.ds-logo__dot`, un nœud que le socle rend lui-même.

### La doc contre le code — quatre écarts, et un garde pour le dernier

- **`Toast`** : la doc disait `--popover`, `patterns.css` pose `--card` ;
- **`Progress`** : la doc annonçait un remplissage `--primary` ; la barre porte le
  dégradé de marque, la phrase n'avait pas suivi ;
- **`Navbar.children`** était déclaré, rendu dans un emplacement précis — l'emplacement
  de droite, juste **avant** `cta` — et c'était la seule prop de `NavbarProps` sans
  commentaire, absente du catalogue. Les deux sont écrits ;
- **le catalogue compte 48 glyphes**, la doc en annonçait 47 à trois endroits.

Le dernier ne reviendra pas. `check-catalogue.mjs` gagne une **cinquième vérité** : le
nombre de glyphes annoncé dans `README.md` et `docs/PROMPTS.md` doit être la taille du
type `IconName`. Le contrôle 3 vérifiait que chaque icône **citée** existe ; il ne
regardait jamais le COMPTE. Falsifié : remis à 47, le garde tombe.

### Le README citait la numérotation du SOCLE comme la sienne

Trois faits étaient datés `0.2.4`, `0.3.0` et `0.10.0` — les numéros de la marque, dont
deux n'existent pas dans cette lignée. C'est précisément ce que le préambule de ce
fichier interdit : le numéro du gabarit est **le seul marqueur de millésime qui survit à
une duplication**, un README qui emprunte celui d'un autre dépôt le rend faux. Les trois
faits sont réécrits dans la numérotation d'ici — `lucide-react` et `tailwind-merge` ont
toujours été des **peers** (vérifié sur le premier `package.json` du dépôt), il n'y a
**jamais eu** de preset v3, et le preflight est là **depuis la 0.2.0**.

### L'inventaire « NON porté » redevient exhaustif

C'est ce qui fait sa valeur : c'est lui qu'on relit avant de conclure « le gabarit est en
retard ». Le décompte réel est de **24 règles de `patterns.css` divergentes sur 315**, et
la liste en nommait la moitié. Y entrent : l'icône de nav active
(`.ds-sidenav.is-active svg` — même arbitrage que `.ds-pastille--brand`, deux règles), les
surfaces du calendrier et du popover de date (la liste ne nommait que le `Dropdown`), le
jumeau du halo de focus `.ds-input:focus-visible{outline:none}` — qui n'existe que par
lui, sans halo l'outline générique **est** le marqueur de focus et on ne le retire pas —,
les retraits de **contenu** de la barre latérale à côté du retrait de boîte déjà listé, le
rayon de `.ds-sidenav`, `--card-pad-lg`, et la densité du lot « les marges respirent ».

**Rien n'a été porté à cette occasion, seule la liste change.** La densité était la seule
entrée où la question se posait : `PORTAGE.md` la range dans ce que porte la marque, à
côté de la palette et des arrondis, et sur un projet client `patterns.css` appartient au
projet. Un gabarit qui hériterait de la respiration d'une marque livrerait une décision de
design que personne n'a prise pour lui. Précision au passage : le gabarit **a** la règle
de déduction du CHAMP (`.ds-card .ds-input` et ses quatre sœurs) — ce qui lui manque, ce
sont celles du bouton secondaire et des surfaces flottantes. La liste disait « pas la
règle de déduction », tout court, et c'était trop large.

### Trois commentaires qui prescrivaient l'état d'avant

- au-dessus de `.ds-sidenav.is-active svg`, la phrase « l'icône passe par le jumeau
  lisible `--primary-readable`, jamais par `--primary` » ne décrivait **aucune** des deux
  valeurs en présence : ici l'icône prend `--brand-via`, dans la marque `--primary` ;
- `patterns.css` renvoyait à « Modal.jsx » ; le fichier est `Modal.tsx` ;
- `.github/workflows/ci.yml` ne nommait pas le dixième garde. `check-classes.mjs` **est**
  branché — dans `build`, donc dans la CI, et c'est délibéré qu'il ne soit pas dans `lint`
  (qui doit rester lançable sans construire la vitrine). Mais rien dans « build du paquet »
  ne le disait, et un garde qu'on ne voit pas dans la CI est un garde qu'on croit absent.
  Le pas s'appelle désormais « build du paquet (+ couverture des classes) ».

Ride avec ce lot, sans matière propre : la note `eyebrow` de la section 0.4.0, corrigée
en place.

**Vérifié avant tag :** `npm run lint` (dix gardes), `npm run demo:build`, `npm run build`
(qui enchaîne la couverture des classes).

## 0.4.0 — l'en-tête de carte apprend le centrage

Le lot v0.18.0 de la marque, versé à l'identique. Le `align-items:flex-start` de
`.ds-card__header` n'avait jamais rencontré un design réel : mesuré sur les maquettes
d'une app consommatrice, le centrage est la langue du design — et les en-têtes y étaient
tous recomposés à la main, s'alignant de trois façons sur un même écran.

**La règle, deux cas, aucune prop d'alignement :** titre simple → `center` (le nouveau
défaut) ; titre **et** sous-titre → `flex-start` (`--stacked`, posé par `Card` lui-même
quand `subtitle` est passé) — l'action s'aligne sur la ligne du haut, elle ne flotte pas
entre deux lignes. `baseline` est écarté : il exige une retouche par instance
(`align-self:center; position:relative; top:-1px` sur chaque badge), et une règle qui
exige une retouche par instance n'est pas une règle.

**⚠ Changement de rendu, pas un ajout.** Bouge : toute `Card` à en-tête **sans
sous-titre** portant une `action` ou une icône plus haute que la ligne de titre — le
bloc icône + titre descend vers l'axe central (~5 à 9px selon l'action). Ne bouge pas :
les cartes à sous-titre (`--stacked` = l'ancien défaut, au pixel), les cartes sans
en-tête, et les en-têtes recomposés à la main. La vitrine gagne le spécimen « titre
simple, rangée centrée ».

Cas hors règle, remonté : `eyebrow` + titre sans sous-titre fait aussi une colonne à
deux lignes, que la règle ne couvre pas. ⚠️ Étendre le déclencheur à `eyebrow && title`
serait FAUX, pas seulement prématuré : `flex-start` calerait l'action sur l'EYEBROW —
un sur-titre de 12px — au lieu du titre. La règle qui se cache dessous est « l'action
s'aligne sur la ligne du TITRE » : elle se confond avec `center` quand le titre est
seul, avec `flex-start` quand le titre est premier de deux, et cesse de se confondre
avec quoi que ce soit dès que le titre n'est pas premier. Ce n'est pas une valeur
d'`align-items`, c'est une autre mise en page — et elle n'a aucun demandeur : candidat,
pas besoin, on promeut au premier cas réel.

## 0.3.1 — les quatre couleurs hors de portée, et le contrôle de couverture

Le patch sous le titre de la 0.3.0, plus un contrôle qui rejoint le squelette.

### Quatre couleurs que le socle employait sans les exposer

`--surface-alt` (15 usages dans les règles du socle), `--primary-readable` (6),
`--destructive-readable` (3), `--success` (1) n'existaient pas en `--color-*` dans
`theme.css`, contre 43 couleurs exposées. Ce n'était pas une politique — `primary` et
`destructive` étaient exposés quand leurs jumeaux `-readable`, précisément ceux qui
posent une couleur sur du TEXTE, ne l'étaient pas. Les quatre entrent au `@theme
inline`. Vérifié : zéro collision (ni un nom natif de Tailwind 4.3.3, ni un `@utility`
du socle), et les quatre génèrent, variantes comprises. Seul autre non-exposé :
`--tone-deep`, exclusion délibérée déjà documentée.

### `DatePicker` : le déclencheur composable

`trigger` reçoit `{ open, value, triggerProps }` et l'appelant **étale `triggerProps`**
sur l'élément de son choix : le socle récupère sa ref (retour de focus sur Échap et sur
sélection) et pose l'ARIA lui-même (`aria-controls` n'existe que quand le popover
existe). Un render-prop d'état seul (`{open, toggle}`) ne suffirait pas : sans ref, pas
de retour de focus ; sans prise, pas d'ARIA. Le bouton par défaut étale le même objet —
les deux chemins ne peuvent pas diverger. `onKeyDown` n'ouvre que sur ArrowDown/ArrowUp
(Entrée et Espace passent par le `click` natif) ; l'élément doit être focusable et
recevoir `ref` (pas un composant sans `forwardRef`). `DatePickerTriggerApi` est exporté.

### `check-classes.mjs` — toute classe écrite doit avoir produit une règle

Né dans une app consommatrice du socle, versé au squelette : chaque design system né de
ce gabarit l'a désormais **au premier commit**. Il confronte les classes littérales du
JSX (`src/` + `demo/src/`) à la feuille émise par le `vite build` de la vitrine et
échoue sur toute classe muette — la panne qu'aucun autre contrôle ne voit : ni tsc, ni
le lint, ni le build. **Pourquoi il existe, en une ligne** : `theme.css` supprime trois
échelles natives de Tailwind (`--text-*`, `--tracking-*`, `--radius-*: initial`) —
`text-sm`, `text-base`, `text-lg`, tout `tracking-*` natif, `rounded` nu et
`rounded-3xl/4xl` ne rendent RIEN, en silence (`rounded-none` et `rounded-full`
survivent : staticValues, mesuré sur 4.3.3).
Extracteur auto-testé (9 cas — dont l'extension nécessaire ici : un fragment de
concaténation `'ds-input--' + taille` n'est pas un nom de classe complet), 9 témoins
vivants un par catégorie de faux positif, falsifié sur ce dépôt (230 classes lues,
0 → 3 muettes injectées → 0, zéro faux positif). Câblé : `npm run build` enchaîne tsup,
le `vite build` de la vitrine et le contrôle ; `npm run check:classes` le lance seul.

## 0.3.0 — aucune valeur du socle hors de portée de l'appelant

Le lot v0.17.0 du design system de marque dont ce gabarit est le squelette, versé ici à
l'identique — mêmes règles, mêmes commentaires de piège, sans les faits propres à cet
écosystème. Trois formes d'un même mal, toutes constatées en usage réel : une valeur
**battue par la cascade** (`.accent`, `.mono` — la couche gagne toujours), une valeur
**hors d'atteinte de la cascade** (un défaut de design écrit en style inline, un nœud
sans classe), une valeur **atteignable mais non prévue pour varier** (`.ds-logo__dot`).
Même issue à chaque fois : le projet recopie ou surcharge, le socle ne le sait pas, et la
panne est **muette**.

### Le créneau d'icône

`Glyph` posait `width`/`height` inline avec `size = '1.25rem'` en **défaut de
paramètre** : aucune règle CSS ne pouvait dimensionner un créneau. Désormais `.ds-icon`
et `.ds-spinner` lisent `var(--ds-icon-size, 1.25rem)` ; les créneaux posent la propriété
par une règle CSS (§ LES CRÉNEAUX D'ICÔNE de patterns.css : contrôles sm 1rem · md
1.125rem · badge dense 0.75rem · pastilles dialogue et panneau 1.5rem · déclencheurs de
champ 1rem) ; la prop `size` d'un site d'appel l'écrit inline et **gagne**. La propriété
est **enregistrée** — `@property --ds-icon-size { syntax: '*'; inherits: false }` dans
core.css : `inherits: false` rend INERTE une règle posée sur un conteneur (elle doit
viser le `svg` lui-même), et `syntax: '*'` sans `initial-value` laisse la propriété
guaranteed-invalid, donc le repli `1.25rem` actif partout où rien ne la pose. La
constante JS de `Button` qui donnait sa taille au spinner est supprimée : le spinner rend
la taille de l'icône qu'il remplace, par la même règle.

**⚠ Ce qui change à l'écran** : une icône SANS `size` explicite rend désormais la taille
de son créneau (1.125rem dans un contrôle `md`, 1rem dans un `sm`, 1.5rem dans une
pastille `dialogue`/`panneau`, 1rem sur le chevron du Select et le déclencheur du
DatePicker). Les `size` explicites continuent de gagner. `Glyph` porte la classe
`.ds-icon`. Aucune rupture d'API.

### Le reste du lot

- **Liseré sur le dégradé** : une bordure de couleur plate autour d'un fond
  `--brand-gradient` laissait un liseré (case cochée et indéterminée de `.ds-choice`).
  Bordure `transparent` + dégradé peint `border-box` ; le radio coché **reprend**
  explicitement sa bordure `--brand-to`.
- **Deux nœuds sans classe** : l'astérisque « requis » de `FormField` et le hint d'un
  item de `Dropdown` deviennent `.ds-label__required` et `.ds-dropdown__hint`.
- **`IconButton`** : `variant="accent"` (fond `--accent`, sans bordure, icône
  `--primary` — l'état « sélectionné doux » qu'une app recompose sinon en détournant
  `is-active`) et `as`/`href`, jumeaux de ceux de `Button`. Au portage, vérifier que le
  couple `--primary`/`--accent` tient le seuil 3:1 des graphiques non textuels.
- **`Modal`** : `closeButton` / `dismissable` découplent la croix des gestes de fuite
  (Échap, clic-voile). Défauts à `true` : rien ne bouge.
- **`EmptyState`** : `tile` reçoit la tuile complète quand la Pastille par défaut ne
  convient pas.
- **`Sidebar`** : chaque section rend un `.ds-sidebar__group` ; 16px entre groupes, avec
  ou sans titre — la somme est conservée pour les sections titrées.
- **`Input`** : `unit` pose une unité (« kg », « € » — trois caractères au plus) dans le
  champ, à droite, `aria-hidden`.
- **La doctrine entre dans la doc** : en tête de `docs/PROMPTS.md`, les trois formes, les
  deux questions de revue (« cette valeur, l'appelant peut-il la reprendre ? » — « si
  oui, le sait-il ? »), la règle du style inline (légitime / illégitime / sans excuse) et
  la règle des huit utilitaires de marque battus par `layer(components)`. Interdit n° 8
  dans `docs/DESIGN.md` ; parade `.ds-cal__*` documentée dans la section Calendar pour un
  calendrier fait main en attendant un mode plage.

## 0.3.0 · le lot doc déjà commité — le piège de `.accent`, et un commentaire dit le vrai

Commentaires et documentation seuls : aucun jeton, aucune règle CSS, aucun composant ne
change. **Rien ne casse.** Commité en amont (`cb6f179`), publié avec cette version.

### `.accent` — quatre déclarations solidaires, et rien ne le disait

`.accent` peint le dégradé de marque dans le texte avec quatre déclarations qui ne
fonctionnent qu'ensemble : `background`, `background-clip: text`, `color: transparent`,
`width: fit-content`. Retirez-en une, l'effet disparaît — et **la panne est muette**, le
texte reste lisible.

Or la règle vit en `layer(base)` quand les utilitaires Tailwind vivent en
`layer(utilities)` : posés sur le même nœud, **ils gagnent toujours**, quelle que soit la
spécificité. Le piège a mordu trois fois côté marque, dans deux apps : une classe `text-*`
de couleur qui écrase `color: transparent` — le dégradé disparaît, le mot s'affiche en
couleur pleine — et une largeur `w-12` qui écrase `width: fit-content` — le dégradé se
peint sur toute la boîte puis se découpe aux lettres, qui n'en montrent qu'une tranche, et
deux nombres de largeurs différentes n'ont plus la même couleur.

Rien dans le dépôt ne prévenait. Quatre entrées le font désormais : un commentaire au-dessus
de la déclaration dans `tokens/base.css`, l'interdit n° 7 de `docs/DESIGN.md` — et, parce
qu'une règle écrite hors du parcours de lecture ne protège personne, deux lignes au
paragraphe « L'accent est rationné » de `PORTAGE.md` et un avertissement en tête de
`docs/PROMPTS.md`, les deux fichiers qu'un agent lit avant d'écrire un écran.

La règle est calibrée, pas totale. **Dangereux** : couleur, fond, `background-clip`,
dimension — tout ce qui touche l'une des quatre déclarations. **Sans risque** : la
typographie (`font-*`, paliers, `leading-*`), qui n'en touche aucune. La parade, quand une
mise en page est nécessaire : un span externe la porte, le span `.accent` n'en porte pas.
`.eyebrow` clippe le dégradé avec les mêmes quatre déclarations : même piège, même règle.

### Le commentaire de `--tracking-*: initial` annonçait un faux coût

L'avertissement au-dessus de la ligne, dans `theme.css`, affirmait qu'un mauvais placement
« emporterait la typographie de la marque avec lui ». C'est faux — la section 0.2.0
ci-dessous le disait déjà : le mauvais placement coûte les **utilitaires** `tracking-*`,
pas la typographie, car les paliers `.text-*` tiennent leur interlettrage de
`tokens/typography.css`, résolu à l'exécution. Le commentaire reprend cette formulation.
La ligne, elle, ne bouge pas — l'avertissement reste, il dit le vrai coût.

### La vitrine ne se construit plus par sa propre chaîne

`npm run demo:build` échoue : la chaîne commence par `tsc --noEmit`, qui tombe sur
**51 × TS2786** — la vitrine épingle `@types/react` 18 quand le paquet est en 19.
`npx vite build` dans `demo/`, lui, passe. Défaut antérieur à ce lot, constaté et signalé
ici en attendant son propre traitement.

## 0.2.0 — le gabarit rattrape les écarts d'API de la marque, et reprend un numéro

Premier bump depuis le squelette. Cette section absorbe **treize commits** restés sans
numéro derrière `v0.1.0`, dont les quatre lots portés depuis la marque, plus l'audit
systématique qui a fait le tri.

**⚠ Une rupture d'API**, listée ci-dessous. Elle date de la v0.8.0 du dépôt de marque et
n'avait jamais été portée : une copie du gabarit faite avant aujourd'hui porte encore la
prop retirée.

### ⚠ Rupture — plus de séparateur dans `ActionSheet`

L'item `separator` de `ActionSheetItem` est **retiré**, avec le `<hr>` que le composant
émettait avant « Annuler » et la règle `.ds-actionsheet__sep`. Une feuille du bas est haute,
aérée, parcourue au pouce : le rythme des lignes suffit, et l'action destructrice se signale
déjà par sa couleur. **`Dropdown` garde le sien** — il est dense, survolé à la souris, et le
filet y sépare l'action destructrice du reste.

*Migration* : retirer les entrées `{ separator: true }` des `items` d'un `ActionSheet`.
TypeScript signale les occurrences restantes.

**La règle CSS part avec la prop, et ce n'est pas un réalignement visuel.** Sur un projet
client `patterns.css` t'appartient — pour tes **choix visuels**. Une règle qui stylise une
classe qu'aucun composant n'émet n'est pas un choix, c'est une orpheline : elle lègue au
client une question sans réponse. Le commentaire qui dit *pourquoi* il n'y a pas de filet
reste à sa place, lui.

### La cible tactile de l'entrée de navigation — le gabarit violait son propre contrat

`--sidenav-h` : `2.5rem` → **`2.75rem`** (40 → 44). `PORTAGE.md` garantit noir sur blanc des
« cibles tactiles 44 px », et l'entrée de barre latérale — la cible la plus cliquée d'une
coque d'outil — était le seul endroit du socle à passer dessous. Ce n'est pas une question de
densité, c'est un défaut : le document promettait une chose et le jeton en livrait une autre.

La ligne du **§ FACULTATIF** de `brand.template.css` suit — elle annonçait « socle : 40 ». Un
contrat qui donne la mauvaise valeur de départ est un contrat qui ment.

Le **rayon** de la pilule active ne suit pas : c'est `patterns.css`, donc un choix visuel.

### `house` entre au catalogue, et c'est elle qui va sur l'accueil

`layout-dashboard` — les quatre tuiles — servait d'icône à l'entrée « Tableau de bord ». Ce
n'est pas ce qu'elle dit : quatre tuiles annoncent une **grille de widgets**, pas la
destination d'accueil d'une app. **`layout-dashboard` reste au catalogue**, pour un vrai
tableau de bord ; ce qui change, c'est l'endroit où on la pose. La règle entre dans les
interdits de `docs/DESIGN.md`.

Les usages basculent dans la vitrine (deux `Sidebar`) et dans `docs/PROMPTS.md`, et l'entrée
est renommée **« Accueil »** — « Tableau de bord » sous une maison serait un libellé qui
contredit son icône.

#### Le glyphe est DESSINÉ dans le socle, pas importé de lucide

Nouveau fichier `src/components/icons/compat-glyphs.ts`, à ne pas confondre avec
`brand-glyphs.ts` : celui-là existe pour une raison **juridique**, celui-ci pour une raison
**mécanique**.

`package.json` déclare `lucide-react: ">=0.400"`. Le glyphe s'appelle `House` depuis son
renommage et `Home` avant. Les deux coexistent sur la version installée ici (0.469) — mais
**pas sur toute la plage du peer** : une app en 0.4xx d'avant le renommage n'expose que
`Home`, et une app future peut voir l'alias disparaître. Un import nommé absent n'est pas une
erreur rattrapable : Rollup refuse le module, et c'est le `vite build` de **l'app cliente**
qui casse, jamais le nôtre.

C'est le point qui compte pour un gabarit : sans ce fichier, **chaque design system fabriqué
depuis ce squelette héritait le défaut**. Le fichier ne porte que les coordonnées du dessin,
relevées sur lucide-react 0.469.0, reconstruites par `createLucideIcon`.

### L'échelle d'interlettrage de Tailwind cesse d'exister

`--tracking-*: initial` dans le `@theme`, **avant** les neuf jetons du système, qui restent
seuls disponibles. L'échelle native est presque entièrement **positive** quand l'interlettrage
d'une display de marque est souvent **négatif** ; les deux vocabulaires cohabitaient dans le
même espace de noms et rien ne disait lequel était le bon.

⚠️ **La ligne doit rester avant les jetons.** Posée après, elle vide l'espace de noms une
fois qu'ils y sont : plus **aucun** utilitaire `tracking-*`, pas même ceux du système. Les
paliers `.text-*`, eux, gardent leur interlettrage dans les deux cas — il vient de
`tokens/typography.css` et se résout à l'exécution. Le mauvais placement coûte les
utilitaires, pas la typographie. Mesuré sur les deux compilations, pas déduit.

### La chaîne de `lint` repasse de six gardes à dix

Ce n'était pas une divergence assumée, c'était une **dérive** : personne n'avait décidé que
le gabarit aurait six gardes. Trois d'entre eux — `check-version`, `check-contract`,
`check-literals` — existaient comme fichiers dans le dépôt et n'étaient **branchés nulle
part**.

Le quatrième manquait : `check-token-refs.mjs` est porté. Tout `var(--x)` lu par le CSS du
système ou par un style inline doit correspondre à un `--x:` déclaré. Un `var()` non résolu
n'est pas ignoré, il rend la déclaration **invalide at computed-value time** — pour un
`font-size`, ça veut dire `inherit`, et un `Button size="sm"` rend alors plus GROS qu'un `md`.
C'est le garde qui compte le plus **ici** : sur un projet client, `patterns.css` est
précisément le fichier que le portage réécrit.

Les dix passent au vert sur le gabarit tel quel. `check-portage.sh` gagne deux points — le
glyphe dessiné et l'entrée d'accueil — et passe de 17 à **19**.

### La couleur de bordure par défaut — écart délibéré avec Tailwind v4

Le preflight d'amont pose `border: 0 solid` : sans couleur, donc `currentColor`. C'est le
bon défaut pour un framework générique, qui ne connaît aucune palette ; ce n'en est pas un
pour un socle qui porte **exactement un** jeton de bordure.

`tokens/base.css` repose donc le défaut, tout en haut, juste après l'en-tête :

```css
*,::after,::before,::backdrop,::file-selector-button{border-color:var(--border,currentColor)}
```

Deux raisons. **La doctrine** : le socle fournit les valeurs, l'app écrit les noms — un
défaut `currentColor` dit l'inverse, il fait dépendre la bordure d'une propriété de texte
que l'app n'a pas choisie pour ça. **Le mode de panne est silencieux** : sur une page claire
à encre sombre, un `border` nu trace un filet quasi noir là où on attendait le gris doux de
`--border`. Rien ne casse, l'écran est juste faux.

Le cas rare — une bordure qui suit la couleur du texte — s'écrit `border-current`, un mot,
et c'est bien lui qui doit coûter les mots. Le repli `currentColor` n'est pas décoratif : un
socle monté **sans** fichier de marque retrouve exactement le comportement d'amont.

Aucun composant du système n'est concerné : tous posent leur `border-color` explicitement.

### `check-preflight-drift.mjs` — la copie versée suit-elle son amont ?

`tokens/preflight.css` est une copie figée à une version de Tailwind, et son en-tête
prescrit une *procédure écrite* pour suivre les montées. Ce dépôt a déjà établi qu'une
procédure écrite ne tient pas. Le garde compare la copie à
`node_modules/tailwindcss/preflight.css`, en retirant les six coupes connues et les
commentaires — ce qui compte est qu'aucune **déclaration** n'ait bougé.

**Il n'échoue jamais** (`exit 0` dans tous les cas), et c'est délibéré : une montée de
Tailwind est légitime, l'arbitrage est humain, et `tailwindcss` est un peer **optionnel** —
un garde bloquant sur un paquet facultatif casserait la CI pour la mauvaise raison. Sa
valeur est de rendre la dérive **visible**, pas de l'interdire. La version attendue est lue
dans l'en-tête de la copie : un numéro noté à deux endroits est un numéro qui divergera.

Branché en fin de chaîne de `npm run lint`. `check-portage.sh` a gagné deux points à ce
lot-là — le preflight versé et la couleur de bordure — passant de 15 à 17 ; les deux points
du glyphe le portent à **19** dans cette version.

### Ce qui a été examiné et NON porté

> ⚠️ **Liste complétée après la 0.4.0 — elle se voulait exhaustive et ne l'était pas.**
> Le décompte réel : **24 règles** de `patterns.css` diffèrent (sur 315), et la liste en
> nommait la moitié. Les manquantes sont ci-dessous, à leur place. **Rien n'a été porté à
> cette occasion** : l'arbitrage est le même que pour les autres, seule la liste change.
> Une liste dont on dit qu'elle est complète et qui ne l'est pas vaut moins que pas de
> liste — c'est elle qu'on relit avant de conclure « le gabarit est en retard ».

L'audit a comparé les deux dépôts fichier à fichier. Restent **délibérément** différents :

- **la déduction de surface** de `patterns.css`. Le gabarit a toute l'API (`surface` sur
  `Button`, `IconButton`, `Input`, `Tabs`), les règles d'échappatoire **et** la déduction
  du CHAMP — `.ds-card .ds-input` et ses quatre sœurs sont bien là. Ce qu'il n'a pas : la
  déduction du **bouton secondaire** et celle des **surfaces flottantes** posées dans une
  carte ou une modale ;
- **la couleur de l'icône de marque** — `.ds-pastille--brand` (`--primary-readable` ici,
  `--primary` là-bas) et `.ds-sidenav.is-active svg` (`--brand-via` / `--primary`). Un
  seul arbitrage, deux règles : la seconde manquait à la liste ;
- **les surfaces flottantes** — `.ds-dropdown`, `.ds-cal` et `.ds-datepicker__pop`, sur
  `--popover` ici et sur `--secondary` là-bas. La liste ne nommait que le `Dropdown` ;
- **le halo de focus de l'`Input`**, et son jumeau `.ds-input:focus-visible{outline:none}`,
  qui n'existe que par lui : sans halo, l'outline générique de `tokens/base.css` **est** le
  marqueur de focus du champ, et on ne le retire pas. Les deux se portent ensemble ou pas
  du tout ;
- **les retraits de la barre latérale** — le retrait de BOÎTE (`.ds-sidebar`), qui était
  seul nommé, et les retraits de CONTENU qui vont avec : `__head`, `__title`, `__foot`,
  leurs états repliés, et le padding de `.ds-sidenav`. Plus le **rayon** de `.ds-sidenav`
  (`--radius-sm` ici, `--radius-md` là-bas) ;
- **la densité du lot « les marges respirent »** — `.ds-input`, `.ds-toast`, `.ds-banner`
  (avec son `align-items:flex-start` et le `.ds-banner__icon` qui le rattrape optiquement),
  `.ds-dropdown__item`, et `.ds-input-unit__label` qui suit le padding du champ.
  **C'est la seule entrée où la question de porter se posait**, et la réponse est non :
  `PORTAGE.md` range la **densité** dans ce que porte la marque, à côté de la palette et
  des arrondis, et sur un projet client `patterns.css` appartient au projet. Un gabarit qui
  hériterait de la respiration d'une marque livrerait une décision de design que personne
  n'a prise pour lui ;
- **les jetons** `--card-pad`, `--card-pad-lg` et `--sidebar-w` ;
- **le côté de la pastille du logo** (`.ds-logo__dot`) ;
- **les chiffres de `docs/accessibilite.md`**, qui mesurent deux palettes différentes.

**Inventaire de classes CSS vérifié identique des deux côtés** : aucun composant ne lit une
classe absente. **Et les API le sont aussi** : le diff des 37 composants ne porte que sur
des commentaires — numéros de version, nom de paquet, formulations de marque. Pas une prop,
pas une signature, pas un nom de classe.

C'est la ligne de `PORTAGE.md` : l'API, le comportement, l'accessibilité et les protections
de compatibilité se portent ; le traitement visuel, jamais.

## 0.1.0 — squelette


Point de départ : 37 composants, 9 pages de vitrine, le contrat de marque, les sept scripts
de contrôle (`check-contract`, `check-contrast`, `check-dark-substitution`,
`check-utility-collisions`, `check-literals`, `check-version`, `check-catalogue`) —
`npm run lint` en agrège une partie avec le typecheck — et une marque d'exemple à remplacer.
