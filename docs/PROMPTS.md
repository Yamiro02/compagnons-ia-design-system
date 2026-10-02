# Catalogue d'usage des composants

Le second fichier qu'un agent lit, après `PORTAGE.md`, avant d'écrire un écran.
Une section par composant : à quoi il sert, quand ne PAS l'utiliser, un exemple minimal
qui compile, et les états qu'il sait rendre.

Ce document est **gardé par `check-catalogue.mjs`** : chaque composant exporté par
`src/index.ts` doit avoir sa section ici, chaque section doit correspondre à un export
réel, et chaque `<Icon name="…">` cité doit exister dans le type `IconName`. Si vous
ajoutez un composant, ajoutez sa section — le build vous le rappellera.

Les exemples supposent les imports depuis la racine du paquet :

```tsx
import { Button, Card, Icon } from '@compagnons-ia/ds';
```

**➜ Les pièges du socle sont rassemblés dans [`PIEGES.md`](PIEGES.md)** — un par section,
avec ce qui casse, pourquoi la panne est muette, la parade, et le garde qui l'attrape quand
il y en a un. Ce qui suit en reprend l'essentiel au fil des composants ; la page en est la
version complète, et c'est elle qu'on lit avant d'écrire un écran.

**⚠️ LA DOCTRINE, avant les cas particuliers : aucune valeur du socle ne doit être hors
de portée de l'appelant.** Trois formes d'un même mal, toutes constatées en usage réel :

1. la valeur est **battue par la cascade** — `.accent`, `.mono` : la couche des
   utilitaires ou des composants gagne toujours, la panne est muette ;
2. la valeur est **hors d'atteinte de la cascade** — un défaut de design écrit en style
   inline, un nœud sans classe : aucun sélecteur ne peut viser la valeur, même en
   théorie ;
3. la valeur est **atteignable mais non prévue pour varier** — les quatre mesures de
   `.ds-logo__dot` : une classe parfaitement ciblable, mais rien ne dit que ces valeurs
   sont censées varier, donc la seule façon d'en changer est de les recopier.

Même issue à chaque fois : le projet recopie ou surcharge, et le socle ne le sait pas.
C'est la doctrine du socle prise à revers — il fournit les VALEURS, l'app écrit les NOMS.
Le premier réflexe de revue, sur tout nouveau composant comme sur tout écran : **cette
valeur, l'appelant peut-il la reprendre ?** Si non, elle est mal placée, quel que soit le
moyen. Et la forme 3 impose la seconde question : **si oui, le sait-il ?** — une valeur
reprise en aveugle est une valeur recopiée.

**La règle du style inline** — elle décide où une valeur a le droit de vivre :

- **Légitime** quand la valeur vient de l'appelant à chaque rendu — `Skeleton`, `Avatar`,
  `Logo`, `Progress` : la prop EST la valeur, il n'y a rien à redéfinir.
- **Illégitime** dès qu'il porte un **défaut**. Un défaut est un arbitrage de design ;
  l'écrire inline le range au seul endroit du langage que la cascade n'atteint pas.
  `Glyph` et `Spinner` faisaient exactement ça — corrigé en v0.3.0 : le défaut vit dans
  le repli de `var(--ds-icon-size, 1.25rem)`, côté cascade, où un créneau peut le battre.
- **Sans excuse** quand il n'y a même pas de prop — l'astérisque de `FormField`, le hint
  de `Dropdown` : une décision du socle qu'aucun sélecteur ne pouvait viser. Corrigés
  (`.ds-label__required`, `.ds-dropdown__hint`).

**⚠️ Les utilitaires de marque perdent contre les composants.** Les huit de
`tokens/base.css` — `.display`, `.display-xl`, `.eyebrow`, `.chip`, `.accent`, `.mono`,
`.caption`, `.prose` — vivent en `layer(base)` ; les redéclarations de `patterns.css`
vivent en `layer(components)` et gagnent toujours sur le même nœud, quelle que soit la
spécificité. `.mono` posé sur un nœud qu'une règle `.ds-*` typographie ne rend rien, en
silence. **La parade** : l'utilitaire Tailwind équivalent sur le même jeton — `font-mono`
lit `--font-mono` et vit en `layer(utilities)`, il gagne. On ne déplace pas la couche.

**⚠️ Deux classes CSS pièges, avant tout écran : `.accent` et `.eyebrow`.** Elles peignent
le dégradé de marque dans le texte par quatre déclarations solidaires (`background`,
`background-clip: text`, `color: transparent`, `width: fit-content`) en `layer(base)` — un
utilitaire posé sur le même nœud vit en `layer(utilities)` et gagne toujours, sans rien
casser à l'écran. **Dangereux** : couleur, fond, `background-clip`, dimension (`text-*` de
couleur, `bg-*`, `w-*`…) — le dégradé meurt en silence. **Sans risque** : la typographie
(`font-*`, paliers `text-heading`…, `leading-*`). La mise en page va sur un span externe.

**Les paliers typo de 12 px — deux, et ils ne s'échangent pas** (v0.6.0) : `text-meta`
(`--text-meta`, 12 px, interligne serré, **sans interlettrage**) pour une méta de liste —
l'horodatage d'une conversation, « il y a 2 min » ; `eyebrow` / `text-eyebrow` pour un
sur-titre, en capitales espacées. Un horodatage en `text-eyebrow` s'écrit « 2 1 : 4 2 ».
`text-meta` est dans `PALIERS_TYPO` : `cn()` le garde à côté d'une couleur `text-*`.

**Le focus sur un titre d'étape** (v0.7.0) : pour qu'un lecteur d'écran annonce un
changement d'étape, l'app place le focus sur le TITRE de l'étape — `<h1 tabIndex={-1}>` +
`.focus()`. Ce titre n'affiche pas d'anneau : `base.css` l'éteint pour
`h1`–`h6`, `main`, `section` et `article` en `tabindex="-1"` **sans `role`** — ni dans
l'ordre de tabulation, ni actionnables. Tout le reste garde son anneau, y compris les
widgets à tabindex itinérant (chips radio, `role="option"`, poignées), qui passent par
`-1`. Ne focalisez donc pas un `<div>` générique : visez le titre.

---

# actions

## Button

L'action du système. `primary` porte le dégradé de marque et la lueur : c'est LE CTA de la
vue — un seul par écran. Tout le reste est `secondary`, `ghost` ou `danger`. **Seule
exception** : un CTA répété à l'identique dans une liste de cartes (« Faire connaissance »
sur chaque carte de recommandation) — et la carte mise en avant ne change pas la couleur de
son bouton.

**Ne pas l'utiliser** pour une action icône seule (c'est `IconButton`), ni pour un lien de
navigation dans du texte (un `<a>` suffit).

```tsx
<Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" />}>On build une app</Button>
<Button variant="secondary" icon={<Icon name="play" />}>Voir la démo</Button>
<Button variant="ghost" size="sm">Annuler</Button>
<Button variant="danger" icon={<Icon name="triangle-alert" />}>Supprimer</Button>
<Button loading>Génération…</Button>
<Button as="a" href="/inscription">S'inscrire</Button>
<Button variant="secondary" surface="card">Dans un conteneur qui n'est pas une Card</Button>
```

- Props : `variant` (`primary·secondary·ghost·danger`) · `size` (`sm·md·lg`) · `surface`
  (`auto·page·card`) · `icon` / `iconRight` · `loading` (spinner + désactivé) · `fullWidth`
  · `as` / `href`.
- **`surface` déclare à la main la surface qui porte le bouton**, jumelle de celle
  d'`Input`. Le squelette ne DÉDUIT rien pour le BOUTON : `secondary` porte `--secondary`
  partout, et `auto` (défaut) est donc l'état normal. `card` force `--background`, pour un
  conteneur qui n'a que l'apparence d'une carte. `page` force `--secondary` — inerte tant que
  `patterns.css` ne déduit pas la surface, indispensable le jour où il le fait : une
  déduction ne prévoit qu'un bouton posé SUR une carte, jamais sur un panneau imbriqué
  dedans. Sans effet sur `ghost`, `primary` et `danger`.
- Rayon `--radius-pill` — DOCTRINE ARRONDIE du projet : tout ce qui se presse ou se
  remplit est pill (voir l'en-tête de la section actions dans `patterns.css`). Les
  exceptions sont écrites : textarea, items de menu, case à cocher, tooltip, squelette.
- **Hauteurs posées, multiples de 4** (v0.4.0), identiques sur toutes les largeurs d'écran :
  `md` **48** — ce qui CONCLUT un écran (CTA de bas d'écran, « Payer », « Envoyer » au pied
  d'un formulaire, « Supprimer mon compte ») ; `sm` **40** — ce qui vit DANS un composant ou
  une barre (bouton d'une bannière ou d'une carte : « Voir l'abonnement », « Faire
  connaissance », « Ajouter une photo » ; le bouton d'envoi de la barre de chat, en
  `IconButton size="sm"`) ; `lg` **52** — CTA de héros du **site vitrine uniquement**, plus
  employé dans l'app. Le padding ne règle que l'air latéral (`padding-block:0`).
- **Les icônes ne se dimensionnent pas au site d'appel** : le créneau du bouton s'en
  charge (sm 1rem · md 1.125rem, via `--ds-icon-size` — voir la section Icon). Le spinner
  de `loading` prend la même taille que l'icône qu'il remplace.
- États rendus : repos, hover (lueur + translateY), pressé, focus-visible, désactivé,
  loading.

## IconButton

Bouton carré à icône seule — copier, fermer, basculer. `label` est **obligatoire** : il
devient `aria-label` et `title`.

**Ne pas l'utiliser** quand un libellé texte est possible : un bouton qui peut dire ce
qu'il fait le dit.

```tsx
<IconButton label="Copier le prompt"><Icon name="copy" /></IconButton>
<IconButton label="Fermer" variant="secondary" size="sm"><Icon name="x" /></IconButton>
<IconButton label="Boutique" variant="accent" as="a" href="/boutique"><Icon name="external-link" /></IconButton>
```

- Props : `variant` (`primary·secondary·ghost·danger·accent`, défaut `ghost`) · `size`
  (`sm·md·lg`) · `surface` (`auto·page·card`) · `label` (requis) · `as` / `href`.
- `surface` a le même rôle et les mêmes valeurs que sur `Button` — voir sa section.
- **`variant="accent"`** (v0.3.0) : fond `--accent`, sans bordure, icône `--primary` —
  l'état « sélectionné doux » d'un lien-icône ou d'un raccourci. Ne pas le recomposer
  avec `is-active` (une aide de démo) et un style inline : c'est cette fraude que la
  variante remplace.
- **`as="a"` + `href`** (v0.3.0) : un lien-icône reste un LIEN — clic-milieu, « ouvrir
  dans un onglet », annonce correcte au lecteur d'écran. Jumeau du `as` de `Button`.
- L'icône ne se dimensionne pas au site d'appel : le créneau s'en charge (sm 1rem ·
  md 1.125rem) — voir la section Icon.
- Carré sur son propre rail (`--icon-control-*`) : `sm` **40** · `md` **48** · `lg` **56**
  (v0.4.0 — `sm` et `md` s'alignent sur le bouton de même taille). Rayon `--radius-pill` — c'est un
  contrôle qui se presse (doctrine arrondie).
- États rendus : repos, hover, pressé (`aria-pressed` = actif), focus-visible, désactivé.

---

# brand

## Avatar

Portrait **détouré** (PNG transparent) avec halo de marque derrière les épaules. Sans
`src`, il retombe sur un monogramme en sourdine — jamais une image cassée.

**Ne pas l'utiliser** pour une vignette de contenu ou une image pleine : c'est un
portrait, posé bas, jamais centré derrière un titre.

```tsx
<Avatar src="/portrait-cutout.png" size="4rem" />
<Avatar size="3rem" halo={false} />
```

- Props : `src` · `alt` · `initials` (monogramme de repli) · `size` (longueur CSS, rem) ·
  `halo` (défaut `true`).
- Les défauts (`alt`, `initials`) viennent de `src/brand.ts`.
- **Le repli joue aussi quand l'IMAGE ÉCHOUE**, pas seulement quand `src` est absent :
  portrait supprimé du bucket, CDN qui tousse, URL signée expirée. Le navigateur rendait
  l'icône d'image cassée à l'endroit exact où l'app promet un visage ; c'est désormais le
  monogramme. Rien à faire au site d'appel — et une nouvelle `src` retente d'elle-même.

## Halo

L'atmosphère radiale de la marque. À poser dans une section `position:relative`, derrière
le contenu. Ancré en bas par défaut — jamais plein écran, jamais un grand aplat dégradé.

**Ne pas l'utiliser** pour une miniature ou une carte de motion : ce halo-là est `HaloHot`,
sur le sous-chemin optionnel `@compagnons-ia/ds/brand-content`.

```tsx
<section style={{ position: 'relative', overflow: 'hidden' }}>
  <Halo placement="bottom" />
  <div style={{ position: 'relative' }}>…</div>
</section>
```

- Props : `placement` (`bottom·top·center`) · `intensity` (0–1, multiplicateur d'opacité).
- Les dégradés viennent des utilitaires `.halo*` de `tokens/base.css` — aucune valeur ici.

## Logo

La marque, rendue **en CSS** : capitales de `--font-display` + pastille carrée arrondie en
dégradé avec lueur. La pastille garde le dégradé sur tous les fonds ; seules les lettres
s'inversent avec le thème. Les défauts (mot-marque, monogramme) viennent de `src/brand.ts`.

**Ne pas** fausse-grasser, contourer ni interlettrer le mot-marque : sa casse et sa
graisse suivent `--heading-transform` / `--heading-weight`, comme tout le titrage.

```tsx
<Logo variant="wordmark" height="1.75rem" />
<Logo variant="wordmark" letters="light" height="1.75rem" />
<Logo variant="monogram" height="2.5rem" />
<Logo wordmark="Acme" dot={false} />
```

- Props : `variant` (`wordmark·stacked·monogram`) · `letters` (`dark·light` — force la
  couleur des lettres ; omise, elles suivent `--foreground`) · `height` · `wordmark` ·
  `monogram` · `dot` (`false` = sans pastille ; un nœud la remplace) · `label`.
- En HTML nu, le même mark existe en `.ds-logo` / `.ds-logo__dot` (tokens/base.css).

---

# data-display

## Badge

Pill de statut ou de catégorie. Les tons sémantiques portent toujours **couleur + icône +
texte**, jamais la couleur seule.

**Ne pas l'utiliser** comme bouton ni comme métrique : un badge ne se clique pas.

```tsx
<Badge tone="success" icon={<Icon name="circle-check" size="0.875rem" strokeWidth={2.5} />}>En ligne</Badge>
<Badge tone="danger" icon={<Icon name="circle-alert" size="0.875rem" strokeWidth={2.5} />}>Échec</Badge>
<Badge tone="outline">Brouillon</Badge>
<Badge tone="neutral" pad="dense">v0.1.0</Badge>
```

- Props : `tone` (`coral·amber·danger·warning·success·neutral·accent·outline`, défaut
  `neutral`) · `pad` (`md·dense·lg`) · `icon`.
- **Hauteurs** (v0.4.0, multiples de 4) : `md` **28** (`--badge-h`, le badge de statut) ·
  `dense` **24** (`--badge-h-dense`, aligné sur une pill de statut) · `lg` **32**, texte 14
  (`.ds-badge--lg`) — l'étiquette d'intérêt d'une fiche persona, combinée avec
  `.ds-badge--card` : voir § classes.
- Le rayon pill est celui de tout le système depuis la doctrine arrondie : le badge n'est
  plus une exception, c'est la règle.

## Card

LA surface du système — tout ce qui n'est pas une section de page se pose sur une Card.
Fond `--card`, bordure 1px, ombre teintée. Jamais du blanc pur. L'en-tête à slots
(`eyebrow` / `icon` / `title` / `subtitle` / `action`) ne rend AUCUN nœud si aucun slot
n'est passé.

**Ne pas** imbriquer une Card dans une Card, ni poser une grille de cartes avec un gap
sous 1.5rem.

```tsx
<Card>Contenu</Card>
<Card variant="interactive" onClick={() => ouvrir()}>Card cliquable</Card>
<Card variant="feature" size="lg">Mise en avant — lavis --grad-soft + bordure de marque</Card>
<Card icon={<Pastille size="carte"><Icon name="rocket" /></Pastille>}
  title="Déployer" subtitle="En un clic" action={<IconButton label="Options"><Icon name="ellipsis" /></IconButton>}>
  Contenu sous l'en-tête
</Card>
<Card flush><img src="/cover.png" alt="" style={{ width: '100%' }} /></Card>
```

- Props : `variant` (`default·interactive·feature`) · `size` (`md·lg`) · `flush` (sans
  padding, media plein bord) · slots d'en-tête `eyebrow` / `icon` / `title` / `subtitle` /
  `action` · `titleSize` (`sm·lg`) · `headerGap` (`normal·airy`) · `as`.
- **L'alignement de l'en-tête est décidé par le socle, jamais par une prop** (v0.4.0) :
  titre simple → rangée **centrée** — icône, titre et action partagent un axe, la langue du design ; titre **et** sous-titre → `flex-start` —
  l'action s'aligne sur la ligne du haut au lieu de flotter entre les deux. `baseline`
  est écarté : il exigeait une retouche par instance. Ne recomposez pas l'en-tête à la
  main pour choisir un alignement — c'est le composant qui le sait.
- États rendus : repos ; `interactive` ajoute hover (levée + `--shadow-md`), pressé,
  focus-visible.

## ChatBubble

La bulle de conversation. `them` = le persona : carte blanche (`--card`, filet `--border`,
`--shadow-sm`) alignée à gauche, coin bas-gauche resserré. `me` = l'utilisateur : fond
`--brand-gradient`, texte `--primary-foreground`, alignée à droite, coin bas-droit resserré
— l'un des trois usages ajoutés à la liste fermée de l'accent. Le parent est une colonne
flex : la bulle s'aligne d'elle-même (`align-self`), 80 % de largeur au plus.

`typing` rend l'**indicateur de saisie** : trois points qui pulsent à la place du contenu,
dans une région `role="status"`. Il n'a de sens que côté persona. Son nom accessible est
du contenu d'app — passe `aria-label` avec le prénom du persona.

**Ne pas l'utiliser** pour un message système ou un état (« Claire est en ligne ») : ce
n'est pas une réplique. Le texte d'une bulle est du CONTENU — l'emoji y est permis, il reste
interdit dans l'interface autour.

```tsx
<div className="flex flex-col gap-space-3">
  <ChatBubble from="them">Tu m'as manqué hier soir.</ChatBubble>
  <ChatBubble from="me">Longue journée. Je te raconte ?</ChatBubble>
  <ChatBubble from="them">Raconte-moi ta journée.</ChatBubble>
  <ChatBubble from="them" typing typingLabel="Claire écrit" />
</div>
```

- Props : `from` (`them·me`, obligatoire) · `typing` · `typingLabel` (v0.6.0) · plus les
  attributs d'un `<div>`.
- **`typingLabel`** (v0.6.0) : le nom accessible de l'indicateur — c'est par lui que l'app
  le traduit et y met le prénom (« Claire écrit », « Claire is typing »). Défaut : « En
  train d'écrire ». Un `aria-label` passé directement reste prioritaire.
- Le cycle des points vaut `--duration-typing` (1.2s) ; `prefers-reduced-motion` le coupe.
- Contraste mesuré par `check-contrast.mjs` : le texte blanc de `me` sur les trois arrêts
  du dégradé.

## Pastille

La tuile d'icône du système — l'unique porteur teinté. **RONDE À TOUTES LES TAILLES**
depuis la doctrine arrondie : le rayon vit sur la base, les modificateurs de taille ne
portent plus que leur mesure. Ses tailles sont nommées par **contexte**, jamais par
mesure : un site d'appel n'écrit jamais un rem.

**Ne pas l'utiliser** comme bouton (elle ne se clique pas) ni réinventer une tuile d'icône
en div : c'est exactement ce que ce composant remplace.

```tsx
<Pastille size="carte"><Icon name="terminal" /></Pastille>
<Pastille size="dialogue" tone="danger"><Icon name="triangle-alert" /></Pastille>
<Pastille size="panneau" tone="brand" outlined><Icon name="folder" /></Pastille>
<Pastille size="heros" shape="round" tone="inverse"><Icon name="rocket" size="1.5rem" /></Pastille>
<Pastille size="dialogue" tone="brand-solid"><Icon name="plus" /></Pastille>
```

- Props : `size` (`carte` 2.25 · `dialogue` 2.625 · `panneau` 3.25 · `heros` 4 · `ecran`
  5rem — le rayon ne suit plus la taille, il est pill partout) · `shape` (`square·round`,
  devenu redondant, conservé comme classe publique) · `tone` (`brand` ·
  `brand-solid` + les 6 paires sémantiques + `inverse`) · `outlined` (contour 1px
  currentColor à 22 %).
- L'icône ne se dimensionne pas au site d'appel : le créneau s'en charge — `dialogue` et
  `panneau` rendent 1.5rem, `carte` le repli 1.25rem. Seules `heros` et `ecran` attendent
  encore une taille explicite.
- **`tone="brand-solid"` porte le dégradé PLEIN**, avec son glyphe en
  `--primary-foreground` : la tuile de marque affirmée, là où `brand` est la tuile douce.
  `size="dialogue"` (2,625 rem) en fait une tuile de la taille d'un bouton-icône — même
  `--radius-pill` ; depuis la v0.4.0 l'`IconButton` `md` mesure 3 rem, la jumelle n'est plus
  au pixel — mais en `<span>`, donc **posable dans un `<label>` ou une zone cliquable,
  là où un vrai `<button>` imbriqué est du contenu interactif invalide dont le navigateur
  ne transmet pas l'activation.**
- ⚠️ `brand-solid` ne porte **aucune lueur**, et c'est délibéré : dans ce système la lueur
  marque ce qui se **presse**, et seuls `.ds-btn--primary` et `.ds-icon-btn--primary` la
  portent. Une `Pastille` ne se clique jamais. Un appelant qui veut le halo l'ajoute
  lui-même, en le sachant.
- C'est elle qui rend la tuile du `Modal` et celle de l'`EmptyState`.

## Separator

Filet 1px `--border` entre deux blocs. Avec `label`, la légende est centrée sur la ligne.

**Ne pas l'utiliser** pour structurer une liste dense (l'espacement suffit) ni dans un
menu de bureau (`Dropdown` a son item `separator`). Une `ActionSheet` n'en porte PAS : une
feuille du bas est aérée et parcourue au pouce, le rythme des lignes suffit.

```tsx
<Separator />
<Separator label="Ou" />
<Separator orientation="vertical" />
```

- Props : `orientation` (`horizontal·vertical`) · `label` (horizontal uniquement).

## Table

Table de données composable pour les UIs d'outil : `Table > THead/TBody > Tr > Th/Td`.
`framed` lui donne son propre cadre (1px `--border`, radius-lg, fond `--card`, en-tête sur
`--background`) — pas de Card autour. `columns`, `striped`, `hoverable` se composent.

**Ne pas** rendre une table vide : c'est `EmptyState` À LA PLACE de la table, jamais un
état vide dans la table.

```tsx
<Table framed columns hoverable>
  <THead><Tr><Th>Build</Th><Th>Statut</Th></Tr></THead>
  <TBody><Tr><Td>App de lecture</Td><Td><Badge tone="success">En ligne</Badge></Td></Tr></TBody>
</Table>
```

- Props de `Table` : `striped` · `hoverable` · `framed` · `columns`. `THead`, `TBody`,
  `Tr`, `Th`, `Td` acceptent leurs attributs HTML natifs.
- États rendus : lignes au repos, alternées (`striped`), survolées (`hoverable`).

## Tooltip

Bulle d'encre au survol et au focus (bulle claire en thème sombre). Un libellé court —
jamais du contenu riche.

**Ne pas l'utiliser** pour de l'information indispensable : ce qui doit être lu vit dans
la page, pas dans une bulle.

```tsx
<Tooltip content="Copier le prompt">
  <IconButton label="Copier le prompt"><Icon name="copy" /></IconButton>
</Tooltip>
```

- Props : `content` · `placement` (`top·bottom`) · `open` (force la bulle ouverte — cartes
  spécimens et captures).
- États rendus : fermé, ouvert au survol, ouvert au focus clavier, forcé (`open`).

---

# feedback

## Banner

Message persistant, dans une page ou une Card. Toujours couleur + icône + texte.

**Ne pas l'utiliser** pour du feedback transitoire (c'est `Toast`) ni pour une erreur de
champ (c'est `FormField error`).

```tsx
<Banner tone="warning" title="Ce tuto date de mars">La CLI a changé depuis — la méthode reste bonne.</Banner>
<Banner tone="info" title="Nouvelle série en ligne" action={<Button variant="secondary" size="sm">Voir</Button>} />
<Banner tone="info" title="Ton essai se termine dans 3 jours" icon={<Icon name="clock" />}
  actionPlacement="below" action={<Button size="sm" variant="secondary">Choisir une formule</Button>}>
  Tes conversations sont conservées.
</Banner>
```

- Props : `tone` (`danger·warning·success·info`, défaut `info`) · `title` · `children`
  (corps) · `action` · `actionPlacement` (`end` défaut · `below`) · `icon`.
- **`actionPlacement`** : `end` (défaut) met l'action à droite, sur la ligne du texte —
  le rendu de toujours. `below` la fait entrer dans la colonne du message, et le bandeau
  reprend l'alignement HAUT. À choisir quand le libellé est long ou l'écran étroit : à
  droite, le bouton écrase la colonne de texte.
- **`icon`** remplace le glyphe déduit du ton. Passez un `<Icon>` **nu** : la classe, la
  position et le créneau lui sont posés par le composant.

## EmptyState

Emplacement vide en pointillés : tuile `Pastille panneau brand outlined`, titre H4 en face
display, une description courte, et **le prochain geste**. Toujours donner au lecteur la
suite.

**Ne pas l'utiliser** pour une erreur (c'est `Banner` ou `Modal` result) ni pour un
chargement (c'est `Skeleton`).

```tsx
<EmptyState icon={<Icon name="folder" />} title="Aucun build ici"
  description="Choisis une série pour voir les vidéos correspondantes."
  action={<Button variant="secondary">Voir tout</Button>} />
<EmptyState tile={<Pastille size="dialogue" tone="neutral"><Icon name="search" /></Pastille>}
  title="Aucun résultat" description="Essaie un autre mot-clé." />
```

- Props : `icon` (glyphe nu — la Pastille par défaut l'enveloppe) · `tile` (la tuile
  complète, quand `panneau brand outlined` ne convient pas ; `icon` est alors ignoré) ·
  `title` (requis) · `description` · `action` · `framed` (défaut `true`) · `halo`
  (défaut `false`).
- **`framed={false}`** retire la bordure tiretée et le fond, garde le padding. À utiliser
  quand le vide est DANS un contenant qui a déjà sa frontière — une carte, un panneau, un
  écran : deux cadres emboîtés se lisent comme une erreur de mise en page, pas comme une
  intention.
- **`halo`** pose un `Halo` centré derrière le contenu — le vide d'un écran entier, qu'on
  veut chaleureux plutôt que clinique. Se combine avec `framed={false}`.

## Progress

Barre fine : rail `--surface-alt`, remplissage `--brand-gradient` — depuis la v0.6.0, la
barre remplie porte le dégradé de marque, jamais l'aplat (la piste, elle, reste un creux).
Déterminée (0–max) ou indéterminée (barre glissante).

**Ne pas l'utiliser** pour une attente sans notion d'avancement dans un contrôle — c'est
`Spinner` (ou `Button loading`).

```tsx
<Progress value={64} label="Progression du build" />
<Progress indeterminate label="Chargement" />
```

- Props : `value` · `max` (défaut 100) · `indeterminate` · `label` (nom accessible).
- ARIA : `role="progressbar"` + `aria-valuenow` (omis en indéterminé).

## Skeleton

Silhouette de chargement sur `--muted`, shimmer discret. Dimensions en chaînes CSS (rem
ou %) — c'est le style inline **légitime** au sens de la règle générale en tête de ce
fichier : la valeur vient de l'appelant à chaque rendu, il n'y a aucun défaut de design à
reprendre. (La même règle rend illégitime un défaut écrit inline — c'était le cas de
`Glyph` et `Spinner` avant la v0.3.0.)

**Ne pas l'utiliser** après le premier rendu : un skeleton qui persiste est un bug
d'affichage, pas un état.

```tsx
<Skeleton width="12rem" height="1.25rem" />
<Skeleton height="9rem" radius="var(--radius-lg)" />
```

- Props : `width` (défaut 100 %) · `height` (défaut 0.75rem) · `radius` (défaut
  `--radius-sm`).

## SkeletonCard

Un skeleton en forme de carte média (16/9 + lignes) — un par emplacement de grille pendant
qu'une grille de cartes charge.

```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-5)' }}>
  {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
</div>
```

- Props : `media` (le bloc 16/9, défaut `true`) · `lines` (défaut 2).

## Spinner

Anneau de chargement en `currentColor`, tailles alignées sur Icon (1 / 1.25 / 1.5rem).

**Ne pas le poser** dans un `Button` : la prop `loading` du bouton le fait, et désactive
le bouton avec.

```tsx
<Spinner size="sm" />
<Spinner size="1.5rem" />
```

- Props : `size` (`sm·md·lg` ou longueur CSS — omise, le créneau décide, comme pour
  Icon : même propriété `--ds-icon-size`, même repli 1.25rem).
- ARIA : `role="status"`, `aria-label="Chargement"`.

## Toast

Notification transitoire, en bas à droite du viewport, sur `--card` avec `--shadow-lg`.
Toujours couleur + icône + texte. Le texte d'erreur est concret, jamais dramatisé.

**Ne pas l'utiliser** pour un message qui doit rester lisible (c'est `Banner`) ni pour une
confirmation bloquante (c'est `Modal`).

```tsx
<Toast tone="success" title="Prompt copié" description="Colle-le dans Claude Code." onClose={() => fermer()} />
<Toast tone="danger" title="Ça a planté, on réessaie ?" description="Le build n'a pas pu démarrer." />
```

- Props : `tone` (`success·danger·warning·info`, défaut `info`) · `title` (requis) ·
  `description` · `onClose` (rend la croix).
- Tuile d'icône **2rem, ronde** (doctrine arrondie), glyphe 1rem au créneau ; l'épaisseur
  des tracés est décidée par le CSS — 1.5 dans une tuile (check / x / triangle-alert / info).
- Tuile et croix **centrées verticalement** sur le corps du message.

---

# forms

## Calendar

Vue mois, lundi d'abord, locale `fr-FR` par défaut. `Date` natif + `Intl` uniquement —
aucune dépendance. Date unique, pas de plage.

**Ne pas l'utiliser** posé nu dans un formulaire : c'est `DatePicker` qui l'y emmène, en
popover.

```tsx
<Calendar value={date} onChange={setDate} min={new Date()} />
<Calendar />
```

- Props : `value` · `onChange(Date)` · `min` / `max` · `disabledDates` · `locale` · `bare`
  (sans le cadre — l'usage interne du DatePicker).
- États rendus : jour au repos, survolé, sélectionné (aplat `--primary`), aujourd'hui
  (`--primary-readable` gras), désactivé, focus-visible.
- **Pas de plage.** En attendant un mode plage (périmètre envisagé : deux mois,
  surlignage des jours intermédiaires, présélections externes),
  un calendrier fait main peut émettre lui-même les classes du socle et hériter de ses
  espacements, de sa typo et de ses états au lieu de les réinventer : `.ds-cal` (cadre,
  ou `.ds-cal--bare`), `.ds-cal__head` / `.ds-cal__label` / `.ds-cal__nav`,
  `.ds-cal__grid` / `.ds-cal__wd` / `.ds-cal__day` et ses états `.is-today` /
  `.is-selected` / `:disabled`. Ces classes sont un contrat de rendu — le socle les
  garde stables tant que la parade est nécessaire.

## Checkbox

Case à cocher avec libellé. `forwardRef` : la ref atteint l'`<input>` natif —
`register()` de react-hook-form se branche directement.

**Ne pas l'utiliser** pour un choix exclusif (c'est `Radio`) ni pour un réglage à effet
immédiat (c'est `Switch`).

```tsx
<Checkbox label="Je veux recevoir le prompt du build" defaultChecked />
<Checkbox label="Sélection partielle" indeterminate />
<Checkbox label="Option indisponible" disabled />
```

```tsx
<Checkbox label="Je certifie avoir 18 ans ou plus" checked={majeur}
  onChange={e => setMajeur(e.target.checked)} error="Coche cette case pour continuer." />
```

- Props : `label` · `indeterminate` (case d'en-tête de sélection multiple : propriété DOM
  posée par ref, trait `minus` à la place de la coche, `aria-checked="mixed"`) · `error`
  (v0.5.0) + les attributs natifs (`checked`, `defaultChecked`, `onChange`, `disabled`…).
- **`error`** (v0.5.0) : le message `.ds-error` SOUS la case, en retrait de la case plus
  l'écart — il s'aligne sur le TEXTE du libellé. La case reçoit `aria-invalid="true"` et
  cite le message dans son `aria-describedby`. La case elle-même ne change pas de couleur
  (maquette AUTH 2d) : le message porte l'erreur, en couleur + icône + texte. Sans `error`,
  le DOM ne change pas ; avec, une enveloppe `.ds-choice-field` entoure le `<label>`
  (`className` reste posé sur le `<label>`).
- **Libellé sur plusieurs lignes** (v0.5.0) : la case reste en face de la PREMIÈRE ligne
  (`.ds-choice__label`, aligné par `1lh`). Sur une ligne, rendu inchangé au pixel.
- Dans un `FormField` (groupe de cases, par exemple), la case cite aussi l'erreur et l'aide
  du champ, après son propre message.
- États rendus : décochée, cochée, indéterminée, hover, focus-visible, désactivée, en erreur.

## DatePicker

Déclencheur façon Input (même règle de `surface`) + `Calendar` en popover. Clic extérieur
ou Échap pour fermer — Échap et la sélection rendent le focus au déclencheur. Avec `name`,
un `<input type="hidden">` porte la date en ISO (`YYYY-MM-DD`) pour la soumission de
`<form>`. Avec react-hook-form : passer par `<Controller>` (composant contrôlé).

**Ne pas l'utiliser** pour une plage de dates — le système n'en a pas.

```tsx
<DatePicker value={date} onChange={setDate} placeholder="Choisir une date" />
<DatePicker surface="card" name="echeance" value={date} onChange={setDate} />
<DatePicker invalid value={date} onChange={setDate} />
<DatePicker value={date} onChange={setDate}
  trigger={({ value, triggerProps }) => (
    <button type="button" className="ds-btn ds-btn--secondary" {...triggerProps}>
      {value ? value.toLocaleDateString('fr-FR') : 'Choisir une date'}
      <Icon name="calendar" />
    </button>
  )} />
```

- Props : `value` · `onChange(Date)` · `placeholder` · `locale` · `min` / `max` ·
  `disabledDates` · `surface` (`auto·page·card`, voir Input) · `invalid` · `disabled` · `name` ·
  `trigger`.
- **`trigger` — le déclencheur composable** (v0.3.1). Un render-prop qui reçoit
  `{ open, value, triggerProps }` et rend l'élément de son choix en **étalant
  `triggerProps`** dessus — ref, clic, clavier, ARIA. C'est l'étalement qui est le
  contrat : par lui le socle garde la ref (retour de focus sur Échap et sur sélection)
  et pose l'ARIA lui-même (`aria-haspopup` / `aria-expanded` / `aria-controls`, et
  `aria-describedby` dans un `FormField` — v0.5.0), qui
  cesse d'être la charge de l'app. L'élément doit être **focusable et recevoir `ref`** —
  un `<button type="button">` nu, pas un composant sans `forwardRef` (le `Button` du
  socle n'en a pas : la ref s'y perdrait, et le retour de focus avec).
  **L'étalement est nu : aucun cast.** `triggerProps.ref` est une ref de RAPPEL
  (`(node: HTMLElement | null) => void`), donc assignable au `ref` de n'importe quelle
  balise. Un objet de ref sur `HTMLElement` ne l'aurait pas été — l'appelant aurait dû
  écrire `ref={triggerProps.ref as Ref<HTMLButtonElement>}`, et l'exemple ci-dessus
  n'aurait pas compilé. `disabled` reste
  la charge de l'appelant sur son élément. Sans `trigger`, rien ne change : le bouton
  façon Input d'hier, qui étale les mêmes `triggerProps` — les deux chemins ne peuvent
  pas diverger.
- États rendus : vide, rempli, ouvert, invalide, désactivé, focus-visible.

## FormField

Enveloppe libellé + contrôle + erreur + aide. Une erreur porte toujours couleur + icône +
texte. **Erreur ET aide** (v0.5.0) : quand les deux sont fournies, les deux s'affichent —
l'erreur d'abord, collée au champ qu'elle qualifie (l'information nouvelle, lue en
premier), puis l'aide à sa place habituelle (le rappel stable de la règle, qui dit comment
corriger). Avant la v0.5.0, l'erreur remplaçait l'aide : on perdait la règle au moment
exact où on en avait besoin.

**Ne pas** poser un libellé à la main au-dessus d'un champ : c'est ce composant qui tient
l'anatomie.

```tsx
<FormField label="Ton email" htmlFor="mail" help="Un build décortiqué par semaine. Zéro spam.">
  <Input id="mail" placeholder="ton@email.com" />
</FormField>
<FormField label="Ton email" htmlFor="mail2" error="Ça a planté, on réessaie ?">
  <Input id="mail2" invalid defaultValue="pas-un-email" />
</FormField>
<FormField label="Nouveau mot de passe" htmlFor="mdp"
  error="Mot de passe trop faible : ajoute une majuscule et un chiffre."
  help="8 caractères minimum, avec une majuscule, une minuscule et un chiffre.">
  <Input id="mdp" type="password" invalid />
</FormField>
<FormField group label="Date de naissance" error="Indique ta date de naissance.">
  <div className="grid gap-space-2" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.5fr) minmax(0,1.2fr)' }}>
    <Select aria-label="Jour" placeholder="Jour" options={jours} invalid />
    <Select aria-label="Mois" placeholder="Mois" options={mois} invalid />
    <Select aria-label="Année" placeholder="Année" options={annees} invalid />
  </div>
</FormField>
```

- Props : `label` · `htmlFor` · `help` · `error` · `required` (astérisque `--primary`) ·
  `group` (v0.5.0).
- **Un lien DANS un message** (v0.6.0) — « Cet e-mail a déjà un compte. Me connecter » :
  dans `.ds-error` et `.ds-help`, le lien prend la couleur du message et se reconnaît à son
  soulignement et sa graisse. Le rose des liens et le rouge des erreurs mesurent 1,01:1 en
  sombre (1,03:1 en clair) : seule une nuance de teinte les séparait, sous WCAG 1.4.1. Le
  message est enveloppé dans un `<span>` : du texte et un lien s'écrivent sur une ligne,
  pas en deux colonnes.
- **Les messages sont RELIÉS au contrôle** (v0.5.0) : leurs ids passent par contexte, et
  `Input`, `Textarea`, `Select`, `DatePicker`, `Checkbox` et `RangeSlider` les posent dans
  leur `aria-describedby` — erreur d'abord, puis aide, puis celui que l'appelant a passé.
  Un lecteur d'écran annonce « invalide » ET pourquoi. Les ids valent
  `${htmlFor}-error` et `${htmlFor}-help` (générés sans `htmlFor`) : un contrôle MAISON
  y pointe à la main. `FormField` ne pose pas `aria-invalid` — c'est `invalid` sur le
  contrôle, qui porte aussi la bordure.
- **`group`** (v0.5.0) : plusieurs contrôles sous un seul libellé — la date en trois
  `Select`, une liste de cases. La racine devient `role="group"` nommé par le libellé (un
  `<span>`, plus un `<label>` : il ne vise aucun contrôle unique) ; chaque contrôle porte
  son propre nom (`aria-label`) et cite l'erreur et l'aide du groupe. `htmlFor` n'y sert
  plus qu'à fixer les ids.

## Input

Champ texte sur le rail de contrôle partagé, bordure 1.5px. Focus = la bordure passe en
`--ring` — UNE bordure, jamais un anneau en plus. **PILL et BLANC** : doctrine arrondie
(ce qui se remplit est pill) et doctrine « le blanc est la surface portée » (posé sur la
mise en page, le champ est `--card` ; dans une porteuse blanche, il repasse en
`--background`). `forwardRef` sur l'`<input>` natif.

**Ne pas l'utiliser** pour du texte multi-lignes (c'est `Textarea`).

```tsx
<Input placeholder="ton@email.com" />
<Input surface="card" placeholder="Dans une Card" />
<Input invalid defaultValue="pas-un-email" />
<Input size="lg" placeholder="CTA de héros" />
<Input unit="kg" inputMode="decimal" placeholder="72" />
<Input type={visible ? 'text' : 'password'}
  action={{
    icon: <Icon name={visible ? 'eye-off' : 'eye'} />,
    label: 'Afficher le mot de passe',
    pressed: visible,
    onClick: () => setVisible(v => !v),
  }} />
```

- **`icon`** pose un glyphe DANS le champ, à gauche — la loupe d'une recherche,
  l'enveloppe d'un e-mail. C'est un REPÈRE : `aria-hidden`, non cliquable — jamais une
  action. Combinable avec `unit` et `action`.
- **`action`** (v0.5.0) — `{ icon, label, onClick, pressed? }` (type `InputAction`) : un
  VRAI bouton DANS le champ, à droite, distinct de `unit` qui reste un repère `aria-hidden`.
  `<button type="button">` (il ne soumet jamais le formulaire), `aria-label` et `title` =
  `label`, `aria-pressed` quand `pressed` est passé — c'est alors une bascule. **40** dans
  un champ md, **32** dans un champ sm, **44 au doigt** dans les deux ; la hauteur du champ
  ne bouge pas. Désactivé avec le champ. `unit` et `action` occupent la même place :
  passés ensemble, `action` l'emporte (avertissement en développement).
- **LA DOCTRINE DE L'ACTION DANS UN CHAMP** (v0.5.0, remplace « une action dans un champ
  est un `IconButton` posé à côté ») : une action DANS le champ n'agit que sur la **valeur
  du champ lui-même** — afficher / masquer un mot de passe, effacer une recherche. Une
  seule par champ. Tout ce qui fait AUTRE CHOSE — envoyer, lancer la recherche, copier
  ailleurs, ouvrir un sélecteur — reste un `IconButton` posé **à côté**. La recette du
  mot de passe : un libellé CONSTANT (« Afficher le mot de passe »), `pressed` qui suit
  l'état, l'icône (`eye` / `eye-off`) et le `type` du champ qui suivent `pressed`.
- **Une action, une unité ou une icône CONDITIONNELLE ne coûte rien** (v0.7.1) : l'`<input>`
  reste le même nœud quand elle apparaît ou disparaît — focus et frappe conservés. La croix
  d'une recherche s'écrit donc simplement :
  ```tsx
  <Input value={q} onChange={e => setQ(e.target.value)} icon={<Icon name="search" />}
    action={q ? { icon: <Icon name="x" />, label: 'Effacer la recherche', onClick: () => setQ('') } : undefined} />
  ```
  Une action qui se RETIRE en réponse à son propre clic (cette croix) rendrait le focus à
  `<body>` : le composant le rend au champ. Le mécanisme : une enveloppe
  `.ds-input-shell` toujours rendue, en `display:contents` sans accessoire — aucune boîte,
  l'`<input>` se met en page comme un `<input>` nu. ⚠ `className` et `style` vont sur
  l'`<input>` : avec un accessoire, c'est l'enveloppe (bloc, pleine largeur) qui est l'item
  de mise en page — une largeur se pose sur un conteneur autour de l'`Input`.
- **Hauteurs** (v0.4.0) : `md` **48** — le champ d'un formulaire ; `sm` **40** — la barre de
  recherche, la barre de saisie du chat ; `lg` **52**, site vitrine uniquement.
- Props : `size` (`sm·md·lg`) · `invalid` · `icon` · `surface` (`auto` défaut = la déduction de
  `patterns.css` décide · `card` force le crème `--background` hors d'une vraie Card ·
  `page` force le blanc `--card` là où la déduction aurait mis du crème — un îlot crème
  posé dans une Card) · `unit` · `action` (v0.5.0) + attributs natifs. Même `surface` sur
  `Textarea`, `Select` et `DatePicker`.
- **`unit`** (v0.3.0) : l'unité — « kg », « € », « min » — posée DANS le champ, à
  droite, en sourdine. **Trois caractères au plus** ; plus long, c'est un suffixe de
  libellé, pas une unité. Elle est `aria-hidden` : le libellé du `FormField` la nomme.
- États rendus : repos, focus, invalide, désactivé — sur les deux surfaces ; l'action au
  repos, survolée, basculée, focus-visible, désactivée.

## Radio

Bouton radio — le seul contrôle circulaire du système. Toujours dans un groupe `name`.
`forwardRef` sur l'`<input>` natif.

**Ne pas l'utiliser** pour plus de ~5 options (c'est `Select`) ni pour un choix multiple
(c'est `Checkbox`).

```tsx
<Radio name="niveau" value="debutant" label="Je débute" defaultChecked />
<Radio name="niveau" value="avance" label="Je code déjà" />
```

- Props : `label` + attributs natifs (`name`, `value`, `checked`, `onChange`,
  `disabled`…).
- Libellé sur plusieurs lignes (v0.5.0) : le rond reste en face de la PREMIÈRE ligne,
  comme pour `Checkbox`. Sur une ligne, rendu inchangé.
- États rendus : au repos, sélectionné, hover, focus-visible, désactivé.

## RangeSlider

Le curseur de PLAGE : deux poignées sur une piste, une valeur `[a, b]` — la tranche d'âge
de l'onboarding. En-tête : le libellé à gauche, la valeur en gras à droite ; les bornes en
`.caption` sous la piste. La portion choisie porte `--brand-gradient` en remplissage, sans
lueur. Contrôlé : `value` + `onChange`.

**Ne pas l'utiliser** pour une seule valeur (un seul nombre se saisit dans un `Input` à
`unit`, ou se choisit dans un `Select`), ni pour une plage de DATES (le système n'en a pas).

```tsx
<RangeSlider
  label="Tranche d'âge"
  min={25}
  max={65}
  value={age}
  onChange={setAge}
  formatValue={v => `${v} ans`}
  display={`${age[0]} – ${age[1]} ans`}
  bounds={['25 ans', '65 ans et +']}
/>
```

- Props : `label` (requis, nomme le groupe) · `min` · `max` · `step` (défaut 1) · `value`
  (`[number, number]`) · `onChange` · `onChangeEnd` (v0.7.0) · `formatValue` (une valeur → texte : `aria-valuetext`
  et bornes par défaut) · `display` (la valeur de l'en-tête, défaut « a – b ») · `bounds`
  (`[gauche, droite]`, `false` les retire) · `thumbLabels` (défaut `['Minimum',
  'Maximum']`) · `disabled` + attributs d'un `<div>`.
- ARIA : le groupe est nommé par le libellé (`role="group"` + `aria-labelledby`) ; chaque
  poignée est un `role="slider"` focusable, avec `aria-valuemin` / `max` / `now` /
  `valuetext`. Les bornes d'une poignée sont l'autre poignée : elles ne se croisent jamais.
- Clavier : flèches (± `step`), Page↑ / Page↓ (± un dixième de la plage), Début / Fin.
  Pointeur : glisser une poignée, ou cliquer la piste — la poignée la plus proche y va.
  Deux poignées confondues : c'est la direction du premier mouvement qui choisit.
- **`onChange` suit chaque cran ; `onChangeEnd` (v0.7.0) suit la FIN de l'interaction** —
  c'est lui qu'on branche sur l'enregistrement serveur. Appelé une fois : au relâchement
  du pointeur (ou à l'annulation du geste), au relâchement de la touche — une flèche
  maintenue fait des dizaines de crans et UN appel —, ou quand la poignée perd le focus en
  pleine frappe. Jamais si la valeur n'a pas bougé depuis le début de l'interaction (un
  appui sans glisser, Fin déjà au maximum). La valeur passée est la dernière émise, pas
  celle de `value` au moment du relâchement.
  ```tsx
  <RangeSlider label="Tranche d'âge" min={25} max={65} value={age} onChange={setAge}
    onChangeEnd={enregistrerPreferences} />
  ```
- Mesures : poignée 24 (`--space-5`) à l'œil, **44 au doigt** (`::before`) ; piste 4
  (`--space-1`). Rail `--border` en clair, `--surface-alt` en sombre : sur `--border`, la
  portion choisie tombait à 2,56:1 en sombre ; sur `--surface-alt`, en clair, le rail
  disparaissait dans la crème.
- États rendus : repos, glisser, focus-visible (anneau `--ring`), désactivé.

## Select

Select **natif** sur le rail 48, avec un chevron Lucide. Même silhouette qu'Input et
Button md. `forwardRef` sur le `<select>` natif.

**Ne pas** le remplacer par un menu custom : le natif gagne au clavier et au tactile.

```tsx
<Select options={[{ value: 'build', label: 'Build' }, { value: 'tuto', label: 'Tuto' }]} defaultValue="build" />
<Select options={[{ value: 'a', label: 'A' }]} invalid />
<Select aria-label="Jour" placeholder="Jour" options={jours} />
```

- Props : `options` (`{value, label}[]`) · `invalid` · `surface` (`auto·page·card`, voir Input) ·
  `placeholder` (v0.5.0) + attributs natifs.
- **`placeholder`** (v0.5.0) — l'invite : « Jour », « Mois », « Année ». Une option vide
  et DÉSACTIVÉE en tête, affichée en `--text-muted` tant que rien n'est choisi (même paire
  de contraste que le placeholder d'un champ) ; les vraies options restent en
  `--foreground`. Sans `value` ni `defaultValue`, l'invite est choisie d'office. En
  contrôlé, `value=""` l'affiche. Désactivée : un choix fait ne revient pas à « rien ».
- **Le padding droit suit le chevron** (v0.5.0) : 40 (retrait 16 + glyphe 16 + air 8), il
  valait 48. Trois `Select` côte à côte sur 390 px (grille 1 / 1.5 / 1.2) mesurent 92 /
  139 / 111 px : « Jour », « septembre » et « Année » tiennent — à 48, les trois étaient
  coupés.
- États rendus : repos, focus, invalide, désactivé — sur les deux surfaces.

## Switch

Bascule binaire à effet **immédiat** — jamais suivie d'un bouton Enregistrer. `forwardRef`
sur l'`<input>` natif.

**Ne pas l'utiliser** dans un formulaire soumis d'un bloc (c'est `Checkbox`).

```tsx
<Switch label="Thème sombre" defaultChecked />
<Switch label="Notifications" disabled />
```

- Props : `label` + attributs natifs (`checked`, `onChange`, `disabled`…). Rendu
  `role="switch"`.
- États rendus : off, on, hover (piste teintée vers `--primary`), focus-visible,
  désactivé.

## Textarea

Champ multi-lignes. Hauteur portée par `rows` — en `md`, jamais de min-height.
Redimensionnement vertical uniquement (sauf `autoResize`). Même règle de `surface` que
l'Input. `forwardRef` sur le `<textarea>` natif — la ref reste branchée avec `autoResize`.

```tsx
<Textarea rows={5} placeholder="Décris ton idée d'app en deux phrases." />
<Textarea rows={3} invalid defaultValue="Trop court" />
{/* la barre de saisie du chat */}
<div className="flex items-end gap-space-2">
  <Textarea size="sm" autoResize maxRows={5} className="flex-1" aria-label="Ton message"
    value={texte} onChange={e => setTexte(e.target.value)} />
  <IconButton label="Envoyer" variant="primary" size="sm" onClick={envoyer}><Icon name="arrow-right" /></IconButton>
</div>
```

- Props : `invalid` · `rows` (défaut 4 en `md`, 1 en `sm`) · `surface` (`auto·page·card`,
  voir Input) · `size` (`sm·md`, v0.6.0) · `autoResize` (v0.6.0) · `maxRows` (v0.6.0) +
  attributs natifs. Rayon `--radius-lg` : l'exception documentée de la doctrine arrondie —
  un pill courberait la première et la dernière ligne d'un champ multi-lignes.
- **`size="sm"`** (v0.6.0) — la barre de saisie du chat : **40 sur une ligne**
  (`--control-sm`, règle 48 / 40), hauteur posée comme `Input sm`. À 40, le rayon 20 rend
  une pilule ; le champ redevient un bloc arrondi en grandissant. `md` : rendu inchangé.
- **`autoResize`** (v0.6.0) : le champ suit son contenu, de `rows` lignes jusqu'à `maxRows`,
  puis il défile. En JavaScript — pas `field-sizing: content`, que Safari iOS ne prend pas
  en charge. Recalculé à la frappe, quand une valeur contrôlée change (le champ vidé après
  envoi revient à une ligne) et quand la largeur change. La poignée est retirée.
- **`maxRows`** : le plafond. Sans lui, le champ grandit sans limite — pour une barre de
  chat, posez-en un (5).
- **Le bouton d'envoi suit la barre** : `IconButton size="sm"` (40), dans un conteneur
  `items-end` — aligné sur une ligne, et au niveau de la dernière ligne quand le champ
  grandit. « Envoyer » au pied d'un formulaire, lui, reste un `Button` md (48).
- États rendus : repos, focus, invalide, désactivé ; sm sur une ligne et agrandi.

---

# icons

## Icon

LE système d'icônes : Lucide, exclusivement. Jamais un emoji, jamais un SVG dessiné à la
main. 51 glyphes typés (`IconName`) — un nom hors du type est une erreur TypeScript, et
c'est voulu.

**Ne pas** chercher `youtube` ou `instagram` ici : les icônes de PLATEFORME vivent dans
`ContentIcon`, sur le sous-chemin optionnel `@compagnons-ia/ds/brand-content`. Et jamais
`sparkles` : l'étoile-éclair est bannie du set.

**La taille vient du CRÉNEAU, plus du site d'appel — v0.3.0.** Une icône sans `size` lit
`var(--ds-icon-size, 1.25rem)` ; les créneaux du socle posent la propriété par une règle
CSS (bouton sm 1rem · bouton et IconButton md 1.125rem · badge dense 0.75rem · pastille
dialogue et panneau 1.5rem · déclencheurs de champ 1rem — les défauts du socle, dans
patterns.css). **Ne passez `size` que pour une correction optique** — une croix ouverte
lit plus petit qu'un aplat, on la remonte d'un cran — ou hors de tout créneau : passée,
elle gagne sur la règle. Un projet pose son propre créneau en ciblant le `svg` lui-même
(`.ma-tuile svg { --ds-icon-size: 1.5rem }`) — jamais le conteneur : la propriété est
enregistrée `inherits: false`, une règle de conteneur est inerte, et c'est voulu.

```tsx
<Icon name="circle-check" strokeWidth={2} />
<Icon name="arrow-right" size="1rem" style={{ color: 'var(--primary-readable)' }} />
```

**Ce que le catalogue ne couvre pas se passe en `glyph`.** Lucide compte ~1500 tracés ;
le catalogue en cure 51 glyphes. Pour le reste, l'app importe le tracé et le socle lui applique
ses propres règles — même grille, même épaisseur. Plus besoin de publier une version du
design system pour une icône.

```tsx
import { ShoppingBag } from 'lucide-react';

<Icon glyph={ShoppingBag} />
```

- Props : `name` (`IconName`) **ou** `glyph` (tracé lucide), jamais les deux — ils sont
  mutuellement exclusifs, et le TYPE l'impose : passer les deux, ou aucun, est une erreur
  de compilation. · `size` (longueur CSS, toujours rem — omise, le créneau décide) ·
  `strokeWidth` (ATTRIBUT de présentation : les règles de `patterns.css` le recouvrent —
  1.75 partout, 1.5 dans une tuile, 2.5 dans une case à cocher. Pour forcer : style inline).
- **`name` reste la voie normale** : le catalogue est relu, documenté, et garantit qu'un
  nom existe. `glyph` est la porte de sortie, pas le chemin par défaut — un besoin qui
  revient dans DEUX apps mérite d'entrer au catalogue.
- `glyph` n'autorise PAS un SVG maison : le rendu reste celui du socle. Ce qui s'ouvre,
  c'est le choix du tracé dans lucide, pas la liberté graphique.
- La couleur suit `currentColor`. Les actions destructives prennent `trash-2`.

---

# navigation

## AppShell

Le squelette d'app-outil : grille `[Sidebar | contenu]`. Sous 64rem, la sidebar devient un
tiroir piloté par `open`/`onClose` de `Sidebar`.

**Ne pas l'utiliser** pour un site de contenu (c'est `Navbar` + `Footer`).

```tsx
<AppShell sidebar={<Sidebar sections={sections} open={menuOpen} onClose={() => setMenuOpen(false)} />}>
  {contenu}
</AppShell>
```

- Props : `sidebar` (un `<Sidebar>`) · `responsive` (défaut `true` ; `false` fige la
  double colonne desktop).

## Footer

Pied de site : marque, ligne de signature optionnelle, colonnes de liens, rangée sociale.

```tsx
<Footer
  note="Busan · Corée du Sud"
  columns={[{ title: 'Séries', links: [{ label: 'Build' }, { label: 'Tuto' }] }]}
  social={<IconButton label="GitHub"><Icon name="github" /></IconButton>}
/>
```

- Props : `columns` (`{title, links:[{label, href?}]}[]`) · `social` · `brand` (défaut :
  le `Logo` du paquet) · `letters` · `note` (ligne de lieu/signature — AUCUN défaut :
  omise, la ligne n'est pas rendue ; le point médian `·` sert de séparateur).

## Navbar

Barre de site sticky : logo à gauche, liens au centre, CTA à droite. Toujours BLANCHE
(`--card`) avec filet bas — doctrine « le blanc est la surface portée » : un contrôle
posé sur la mise en page crème, jamais transparent. Un champ posé dedans repasse en
crème par déduction (`.ds-navbar .ds-input`). Au
scroll : teinte + blur + ombre. C'est le SEUL endroit du système qui emploie
`backdrop-filter` — pas de glassmorphism ailleurs.

```tsx
<Navbar
  links={[{ label: 'Vidéos', active: true }, { label: 'Séries' }, { label: 'À propos' }]}
  cta={<Button size="sm">La newsletter</Button>}
/>
```

- Props : `links` (`{label, href?, active?}[]`) · `cta` · `brand` (défaut : le `Logo`) ·
  `homeHref` / `homeLabel` · `letters` · `scrolled` (force l'état scrollé — spécimens) ·
  `children` (rendu dans l'emplacement de DROITE, juste **avant** `cta` : une action de plus
  — bascule de thème, sélecteur de langue — sans remplacer le CTA).
- États rendus : repos, scrollée, lien au repos / survolé / actif.

## Pagination

Pagination contrôlée sur une barre BLANCHE `--card`, au rayon pill
(`--pagination-radius`, redéclaré en marque) — même traitement que Tabs. Items pill.
Ellipse au-delà de 7 pages ; survol et page courante descendent sur la crème
`--background` : sur une barre blanche, `--surface-alt` ne se voit plus.

```tsx
<Pagination page={page} pageCount={12} onPageChange={setPage} />
```

- Props : `page` (1-based) · `pageCount` · `onPageChange`.
- États rendus : page au repos, survolée, courante (`aria-current="page"`), flèches
  désactivées aux bornes, focus-visible.

## Sidebar

Navigation d'app BLANCHE (`--card`) : marque en tête, sections titrées, item actif, pied
(Avatar + nom). Items pill ; survol et item actif descendent sur la crème `--background`.
Repliable en icônes seules, persisté en localStorage. Sous 64rem : tiroir `open`/`onClose`,
voile compris.

```tsx
<Sidebar
  sections={[{ title: 'Outils', items: [
    { label: 'Accueil', icon: <Icon name="house" />, active: true },
    { label: 'Contenu', icon: <Icon name="video" /> },
  ] }]}
  footer={<Avatar size="2rem" />}
/>
```

- Props : `sections` (`{title?, items:[{label, icon?, href?, active?, onClick?}]}[]`) ·
  `footer` · `footerItems` · `brand` / `brandCollapsed` · `collapsible` (défaut `true`) ·
  `defaultCollapsed` · `storageKey` · `open` / `onClose` (tiroir mobile) · `staticLayout`
  · `linkAs`.
- Chaque section est un **groupe** (v0.3.0) : les groupes se séparent par le gap de la
  nav (16px), avec ou sans titre — deux sections sans titre ne se collent plus.
- États rendus : dépliée, repliée, item au repos / survolé / actif, tiroir ouvert.

## Tabs

Groupe d'onglets segmenté sur le rail de contrôle. La barre contraste TOUJOURS avec sa
surface porteuse : BLANCHE (`--card`) sur la page avec l'onglet actif sur la crème
`--background` ; dans une Card elle se creuse toute seule (barre `--background`, actif
`--card`) — `onCard` ne sert qu'aux conteneurs que la déduction ignore, `onPage` fait
l'inverse (un îlot crème dans une Card qui doit rester blanc). Barre et onglets PILL
(`--tabs-radius` redéclaré en marque) — jamais fondue dans le fond.

**Ne pas l'utiliser** pour de la navigation entre pages (c'est `Navbar` ou `Sidebar`) :
Tabs filtre un contenu en place.

```tsx
<Tabs value={tab} onChange={setTab}
  items={[{ value: 'all', label: 'Tout' }, { value: 'build', label: 'Build' }]} />
<Tabs onCard value={tab} onChange={setTab} items={[{ value: 'all', label: 'Tout' }]} />
<Tabs onPage value={tab} onChange={setTab} items={[{ value: 'all', label: 'Tout' }]} />
```

- Props : `items` (`{value, label}[]`) · `value` / `onChange` (contrôlé) · `onCard` ·
  `onPage`.
- États rendus : onglet au repos, survolé, sélectionné (`aria-selected`), focus-visible.

## TabBar

La barre d'onglets BASSE — la coque d'une PWA mobile. Une **capsule BLANCHE FLOTTANTE**
(`--card`, rayon pill, bordure `--border`, `--shadow-lg`) détachée des bords : marges
latérales et basse, `env(safe-area-inset-bottom)` comprise. Libellés toujours visibles
sous leur icône. L'item actif se pose dans **sa propre capsule `--accent`**, icône et
libellé en `--primary-readable` semibold.

**QUATRE ONGLETS, PAS CINQ.** Sur 390 px, un cinquième onglet fait passer chaque cible
sous 78 px et tronque les libellés. Ce qui ne rentre pas dans quatre destinations
n'appartient pas à la coque : ça vit derrière l'une d'elles. Un cinquième item est rendu
quand même — couper une navigation en silence serait pire — mais le composant le signale
en console en développement.

⚠️ **Cible tactile : 2.25rem (36 px) à l'œil, sous les 44 px de la règle.** Écart
ASSUMÉ — une capsule flottante à 44 px mange le contenu qu'elle survole. La cible réelle
au doigt vaut 44 px marges comprises (36 + 4 + 4) et rien d'autre n'est cliquable entre
deux items. Voir `docs/accessibilite.md`.

**Ne pas la confondre avec `Tabs`**, qui FILTRE un contenu en place. Ici on NAVIGUE :
d'où le `<nav>`, le rendu en `<a>` dès qu'il y a une destination, et `aria-current="page"`.

```tsx
<TabBar
  dock
  items={[
    { label: 'Accueil', icon: <Icon name="house" />, href: '/', active: true },
    { label: 'Discussions', icon: <Icon name="message-square" />, href: '/chats' },
    { label: 'Profil', icon: <Icon name="user" />, href: '/moi' },
    { label: 'Réglages', icon: <Icon name="settings" />, href: '/reglages' },
  ]}
/>
```

- Props : `items` (`{label, icon, href?, active?, onSelect?}[]`, 4 au plus) · `dock`
  (enveloppe la barre dans `.ds-tabbar-dock` — `position:fixed`, collée en bas de l'écran :
  c'est le rendu de PRODUCTION ; sans lui la barre est rendue dans le flux, ce que veut un
  spécimen) · `aria-label` (défaut « Navigation principale ») · plus les attributs d'un
  `<nav>`.
- `href` présent → l'onglet est un `<a>` ; absent → un `<button>` piloté par `onSelect`.
- États rendus : onglet au repos, survolé (plaque `--background`), actif (capsule
  `--accent`, `aria-current="page"`), focus-visible (contour en retrait, pour ne pas
  déborder de la capsule).

---

# overlays

## ActionSheet

Le menu « ⋯ » sur mobile : une feuille basse d'actions, Annuler intégré, chaque ligne au
moins `--control-md` (le rail tactile). Surface modale complète : focus piégé, Échap
ferme, focus rendu au déclencheur, défilement verrouillé.

**DOCTRINE ⋯ — ne pas l'ouvrir au-dessus de 64rem** : `.ds-scrim--sheet` y est en
`display:none`, une ActionSheet modale y est invisible par construction (le composant le
signale en console en développement). Au-dessus de 64rem, le même geste ouvre un
`Dropdown`. En spécimen desktop : `inline panel`.

```tsx
<ActionSheet
  open={sheet}
  onCancel={() => setSheet(false)}
  items={[
    { label: 'Copier le lien', icon: <Icon name="copy" size="1rem" />, onSelect: () => setSheet(false) },
    { label: 'Supprimer', icon: <Icon name="trash-2" size="1rem" />, danger: true },
  ]}
/>
<ActionSheet inline panel items={[{ label: 'Copier le lien' }]} />
```

- Props : `open` · `title` / `subtitle` (en-tête optionnel) · `note` (légende de
  conséquence au-dessus d'Annuler) · `items`
  (`{label, icon?, danger?, onSelect?, className?}[]`) · `cancelLabel` ·
  `onCancel` · `inline` (sans voile) · `panel` (spécimen desktop 20rem — implique
  `inline`).
- **Pas de séparateur** (v0.8.0) : l'item `separator` a été retiré, la feuille n'émet plus
  aucun `<hr>`. C'est `Dropdown` qui garde le sien.
- États rendus : fermée, ouverte (feuille), item au repos / survolé / danger, panneau
  desktop.

## Dropdown

Menu contextuel — **desktop only**. Sous 64rem, un menu « ⋯ » ouvre TOUJOURS une
`ActionSheet` : même geste, deux tailles d'écran. Panneau sur `--popover`, items éclairés
sur `--surface-alt`.

**Ne pas l'utiliser** comme select de formulaire (c'est `Select`).

```tsx
<Dropdown items={[
  { label: 'Copier le lien', icon: <Icon name="copy" size="1rem" /> },
  { label: 'Ouvrir la vidéo', icon: <Icon name="play" size="1rem" />, hint: '⏎' },
  { separator: true },
  { label: 'Supprimer', icon: <Icon name="trash-2" size="1rem" />, danger: true },
]} />
<Dropdown inline items={[{ label: 'Spécimen dans le flux' }]} />
```

- Props : `items` (`{label, icon?, hint?, danger?, separator?, onSelect?, className?}[]`)
  · `inline` (rendu dans le flux, sans positionnement absolu).
- États rendus : item au repos, survolé, danger, séparateur.

## Modal

Dialogue de confirmation ou de tâche focalisée, sur `--popover`, au-dessus d'un voile
encre flouté. **Trois phases dans UN dialogue** : `confirm` → `loading` (rien ne ferme :
Échap, voile et croix inertes) → `result` (succès ou erreur, avec « Réessayer »). Sous
64rem, la MÊME modale devient une feuille basse — CSS seul. Focus piégé, Échap ferme,
focus rendu au déclencheur.

**Ne pas l'utiliser** pour du feedback passif (c'est `Toast` ou `Banner`) ni pour un menu
d'actions (c'est `Dropdown` / `ActionSheet`).

```tsx
<Modal
  open={open}
  onClose={() => setOpen(false)}
  icon={<Icon name="triangle-alert" />}
  title="Supprimer ce build ?"
  description="Cette action est définitive."
  footer={<>
    <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
    <Button variant="danger">Supprimer</Button>
  </>}
/>
<Modal inline phase="result" onClose={() => setOpen(false)}
  result={{ status: 'success', title: 'Build supprimé', message: 'Les fichiers ont été retirés.' }} />
```

- Props : `open` · `icon` + `iconVariant` (`danger·brand·neutral·warning·success` — la
  tuile est une `Pastille dialogue`) · `title` / `description` / `children` · `footer` ·
  `onClose` · `closeButton` · `dismissable` · `phase` (`confirm·loading·result`) ·
  `result` (`{status, title?, message?, onRetry?}`) · `inline` (spécimen sans voile).
- **La croix et les gestes de fuite sont découplés** (v0.3.0) : `closeButton={false}`
  retire la croix en gardant Échap et le clic-voile ; `dismissable={false}` fait
  l'inverse — la croix devient le seul geste de fermeture, pour une modale à saisie
  qu'un clic à côté ne doit pas jeter. Les deux à `true` par défaut : rien ne bouge.
- Un champ dans une modale : voir le spécimen « Avec un champ contrôlé » de la vitrine —
  le piège de focus tient la frappe.
- États rendus : les trois phases, avec et sans icône, succès et erreur, feuille basse
  sous 64rem.

---

# classes

**Des règles CSS, sans composant React.** Elles vivent dans `src/styles/patterns.css` et
s'écrivent à la main dans le JSX. Elles n'ont pas de composant parce qu'elles n'ont pas
passé les quatre tests de [`GOVERNANCE.md`](../GOVERNANCE.md) — le plus souvent le
deuxième : plusieurs écrans **du même produit** ne comptent pas pour deux produits. Le jour
où un second produit les demande, elles montent ; en attendant, une classe coûte une règle,
un composant coûte un fichier, un export, une section et une décision à chaque hésitation.

**La règle qui vaut pour toutes** : aucune ne porte de couleur en dur, aucune n'invente une
mesure. Si vous en recopiez une, recopiez sa STRUCTURE — c'est là que sont les pièges.

## .ds-option

Le grand choix d'un écran de questionnaire — une case ou un radio, un libellé, toute la
largeur. `--sm` pour un écran qui pose plusieurs groupes.

```tsx
<label className="ds-option">
  <span className="ds-choice">
    <input type="radio" name="rythme" />
    <span className="ds-choice__box ds-choice__box--radio"><span className="ds-choice__dot" /></span>
  </span>
  Tous les jours
</label>
```

- **Hauteur 48** (`--control-md`) dans les deux tailles, texte `--text-control` (15) dans les
  deux (v0.4.0) ; md et sm ne diffèrent plus que par l'écart case-libellé et la graisse. Un
  libellé qui passe à la ligne garde `--space-2` d'air en haut et en bas.
- Sélection : `:has(input:checked)` la détecte seule — `.is-selected` n'est qu'une aide de
  spécimen. Bordure `--primary`, libellé en graisse pleine.
- L'anneau de focus est sur l'OPTION, pas sur la case : `.ds-option:has(input:focus-visible)`
  l'allume et éteint celui de `.ds-choice__box`, sinon on en voyait deux.
- Vitrine : Formulaires § Option.

## .ds-chip

Une pastille de choix — centres d'intérêt, filtres, réponse courte. **Deux modes, un seul
rendu** : l'état vit dans un attribut ARIA, jamais dans une classe — `.is-selected` n'est
que l'aide de spécimen. Sélectionnée : plaque `--accent`, bordure `--primary`, libellé
`--primary-readable` semibold, quel que soit le mode.

**Bascule — choix multiples** (v0.3.0). Chaque chip est un bouton à bascule indépendant.

```tsx
<div role="group" aria-label="Tes centres d'intérêt" className="flex flex-wrap gap-space-2">
  <button type="button" className="ds-chip" aria-pressed={choisi} onClick={basculer}>Cuisine</button>
</div>
```

- ARIA : `aria-pressed` (`true` / `false`) sur chaque `<button type="button">`. Le groupe
  est nommé (`role="group"` + `aria-label`, ou un titre relié par `aria-labelledby`).
- Clavier : **rien à écrire**, c'est le bouton natif — Tab / Maj+Tab passent de chip en
  chip (un arrêt par chip), Espace ou Entrée basculent.

**Radio — choix unique** (v0.3.1). Le groupe se comporte comme un groupe de boutons radio.
`aria-pressed` n'est **pas valide** sur le rôle `radio` : l'état passe par
`aria-checked`, et le socle le dessine exactement comme `aria-pressed="true"`.

```tsx
<div role="radiogroup" aria-label="Ton rythme de conversation" className="flex flex-wrap gap-space-2">
  {RYTHMES.map((r, i) => (
    <button key={r} type="button" role="radio" className="ds-chip"
      aria-checked={choix === r} tabIndex={r === arret ? 0 : -1}
      onClick={() => setChoix(r)} onKeyDown={e => auClavier(e, i)}>{r}</button>
  ))}
</div>
```

- ARIA : `role="radiogroup"` nommé sur le conteneur ; `role="radio"` + `aria-checked`
  (`true` / `false`) sur chaque chip. Une seule chip à `true`.
- Clavier — **à la charge de l'app**, le socle ne pose que le rendu :
  - **un seul arrêt de tabulation** pour tout le groupe (tabindex itinérant) : la chip
    choisie à `tabIndex={0}`, les autres à `-1` ; si aucune ne l'est, la première ;
  - **flèches** (→ / ↓ suivante, ← / ↑ précédente, en boucle) : déplacent le focus **et**
    la sélection ;
  - **Espace** choisit la chip qui a le focus si elle ne l'est pas ;
  - **Tab** sort du groupe.
- L'implémentation complète est dans la vitrine : `ChipsRadio`,
  `demo/src/pages/Forms.tsx`.

**Choisir le mode** : plusieurs réponses possibles → bascule ; une seule → radio. Ne pas
simuler un choix unique avec des `aria-pressed` qui s'éteignent entre eux : le lecteur
d'écran annonce des bascules indépendantes, et l'exclusivité n'est dite nulle part.
- **Libellé d'INTERFACE : jamais d'emoji.** Celui qui en porte est `.ds-badge--card`, qui
  est du contenu.
- **Hauteur et cible tactile** : 40 à l'œil (`--chip-h`, la taille `--control-sm`, v0.4.0),
  texte `--text-control` (15) ; 48 au doigt par une couche `::before` invisible.
  Condition : au moins `--space-2` entre deux rangées. Voir `docs/accessibilite.md` § 4.
- Vitrine : Formulaires § Chip — bascule, radio (clair + sombre), états.

## .ds-steps

La progression d'un parcours en plusieurs écrans.

```tsx
<div className="ds-steps">
  <span className="ds-steps__label">Étape 2 sur 5</span>
  <span className="ds-steps__dots" aria-hidden="true">
    <span className="ds-steps__dot is-done" /><span className="ds-steps__dot is-current" />
    <span className="ds-steps__dot" /><span className="ds-steps__dot" /><span className="ds-steps__dot" />
  </span>
</div>
```

- **C'est le LIBELLÉ qui porte l'information**, pas les points : ils sont `aria-hidden`.
  Une rangée de points seule ne dit rien à un lecteur d'écran, et rien du tout à qui ne
  distingue pas les deux teintes.
- Vitrine : Formulaires § Steps.

## .ds-counter

Le compteur de non-lus : une pastille pleine en dégradé, avec un **chiffre**.

```tsx
<span className="ds-counter">2<span className="sr-only"> messages non lus</span></span>
```

- Le chiffre se double **toujours** d'un libellé en `sr-only` : « 2 » seul ne dit pas de
  quoi.
- Au-delà de 99, écrivez `99+` — la pastille a un `min-width`, elle s'allonge proprement.
- Vitrine : Data display § Compteur de non-lus.

## .ds-dot

Le compteur **sans le compte** : il dit qu'il y a du nouveau, pas combien.

```tsx
<span className="ds-dot" aria-hidden="true" />
<span className="ds-dot ds-dot--ring" aria-hidden="true" />
```

- **Toujours `aria-hidden`**, et l'information portée en texte à côté (`sr-only`, ou le
  libellé de la ligne). Un point de couleur seul n'est jamais une information — interdit
  n° 5 de `docs/DESIGN.md`.
- **`--ring`** quand le point CHEVAUCHE quelque chose — un avatar, une vignette, une
  icône : il creuse un contour de la couleur de la carte et détache le point de ce qu'il
  recouvre. Posé à plat sur une surface, il est inutile.
- **Ne pas l'utiliser** pour une présence (« en ligne ») : ce produit n'en a pas, et un
  point vert voudrait dire autre chose. Le non-lu, et rien d'autre.
- Taille : `--dot` (8 px), redéclarable par la marque.
- Vitrine : Data display § Point de non-lu.

## .ds-badge--card

L'étiquette de centre d'intérêt posée sur une carte de persona — blanche, faite pour la
crème.

```tsx
<span className="ds-badge ds-badge--card">🌿 Jardinage</span>
<span className="ds-badge ds-badge--card ds-badge--lg">🌿 Jardinage</span>
```

- **Deux tailles** : la taille du badge de statut (28) sur une carte de liste ; `--lg` (32,
  texte 14, v0.4.0) sur la **fiche persona** — plus discrète que la chip (40, un contrôle),
  plus lisible que le statut. Avec le composant : `<Badge pad="lg" className="ds-badge--card">`.

- **Seul endroit du système où un emoji est permis** : c'est du CONTENU fourni par la base,
  pas un libellé d'interface. La chip, elle, n'en porte jamais.
- Vitrine : Data display § Badge.

## .ds-card.is-selected + .ds-card__flag

La carte de choix sélectionnée — les formules d'abonnement.

```tsx
<div className="ds-card ds-card--interactive is-selected">
  <span className="ds-badge ds-badge--accent ds-badge--dense ds-card__flag">Recommandé</span>
  …
</div>
```

- La bordure sélectionnée est `--primary`, **la même que la chip** : un seul rouge pour
  « sélectionné » dans tout le système.
- Le drapeau est un `Badge` `accent dense` plus la classe de position — pas une nouvelle
  boîte.
- Vitrine : Data display § Card.

## .ds-bubble / .ds-typing

Rendues par le composant `ChatBubble` — voir sa section. Les classes sont documentées ici
pour qui compose une bulle à la main ; dans une app, passez par le composant.

## .ds-portrait

La vignette d'une personne **sans photo**, et qui n'a jamais l'air cassée.

```tsx
<span className="ds-portrait" style={{ aspectRatio: '3 / 4' }}>
  <Halo placement="center" />
  <span className="accent">{prenom.charAt(0).toUpperCase()}</span>
</span>
```

- **Le ratio vient du site d'appel** — `aspectRatio` ou `height`. La classe n'en impose
  aucun : une vignette n'a pas de proportion universelle.
- ⚠️ **Le nœud `.accent` ne porte RIEN d'autre** : ni classe, ni style. La typo lui arrive
  par héritage du conteneur. Tout ce qu'on pose à côté d'elle casse le clip en silence —
  c'est le piège de [`docs/PIEGES.md`](PIEGES.md), et `check-fragile-classes.mjs` le
  surveille.
- **Rien à faire pour le sombre** : l'initiale y quitte `.accent` pour `--primary-readable`
  toute seule, par une règle scopée au portrait.
- Avec photo, c'est la même boîte : un `<img>` à la place des deux enfants.
- Vitrine : Marque § Portrait de repli.
