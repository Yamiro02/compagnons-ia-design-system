# @compagnons-ia/ds

**Un squelette de design system React, à remplir par projet.** Deux couches qui ne se
mélangent pas : un **socle** générique — structure, comportements, échelles, rail de
contrôles, motion, 39 composants React + TypeScript, **zéro couleur** — et une **marque**,
qui porte les couleurs, les polices, les dégradés et la lueur.

Jetons CSS · couche Tailwind v4 · tout est en `rem`.

Les deux couches se montent en **deux imports**, toujours. Il n'existe pas d'entrée qui
monte une marque toute seule : celle qu'une app charge est visible dans son code, jamais
implicite.

```ts
import '@compagnons-ia/ds/core.css';           // la structure, invariante
import '@compagnons-ia/ds/brand-example.css';  // la marque — remplacez-la par la vôtre
```

## Par où commencer

| Vous êtes | Allez voir |
|---|---|
| **un agent qui doit produire ce design system** (Claude Design, Claude Code) | **[`PORTAGE.md`](PORTAGE.md)** |
| **un humain qui monte un projet** | **[`GETTING-STARTED.md`](GETTING-STARTED.md)** |
| **quiconque écrit un écran AVEC ce système** | **[`docs/PIEGES.md`](docs/PIEGES.md)** — ce que le code livré fait et qui ne se devine pas |

La marque livrée, `src/styles/brand-example.css`, est **un exemple à remplacer**. Elle
existe pour que la vitrine s'affiche immédiatement et pour prouver que le socle ne porte
aucune couleur : sa palette est froide et ses polices sont une serif et une grotesque
géométrique. Si un pixel chaud apparaît, une valeur de marque est restée dans le socle.

## Deux façons de s'en servir

|  | **Installer le paquet** | **Copier le dossier** |
|---|---|---|
| Pour qui | vos propres apps, qui partagent un socle | un projet client, qui possède tout son code |
| Ce qu'on monte | `core.css` + votre marque | `core.css` + la marque du projet |
| Mises à jour | elles suivent le paquet, par tag | aucune : le dossier est à lui, **indépendant pour toujours** |

### Les documents

| Pour | Va voir |
|---|---|
| démarrer un design system, de zéro | [`GETTING-STARTED.md`](GETTING-STARTED.md) |
| la charte à remplir avant le CSS | [`docs/DESIGN.md`](docs/DESIGN.md) |
| ce qui entre dans le système, et la procédure de version | [`GOVERNANCE.md`](GOVERNANCE.md) |
| ce qui a changé, version par version | [`CHANGELOG.md`](CHANGELOG.md) |
| les ratios de contraste mesurés et les écarts assumés | [`docs/accessibilite.md`](docs/accessibilite.md) |
| l'usage détaillé, composant par composant | [`docs/PROMPTS.md`](docs/PROMPTS.md) |
| les pièges du socle — la panne muette et sa parade | [`docs/PIEGES.md`](docs/PIEGES.md) |
| la fiche de portage pour un agent | [`PORTAGE.md`](PORTAGE.md) |

---

## Installation

Pas de registry : chaque app épingle une version par un tag git.

```bash
npm i github:Yamiro02/compagnons-ia-design-system#v0.2.0
```

Cinq **peer dependencies**, à la charge de l'app :

| Peer | Plage | Note |
|---|---|---|
| `react` · `react-dom` | `>=18` | |
| `tailwindcss` | `>=4` | **v4 uniquement.** Aucun preset v3 : ce gabarit est né sur la v4 |
| `lucide-react` | `>=0.400` | |
| `tailwind-merge` | `^3` | **3.x obligatoire** |

> **`tailwindcss` est marqué `optional` — voici ce que ça veut dire.** Le paquet a deux régimes.
> Si tu n'utilises que `core.css` + une marque et les classes `.ds-*` — un e-mail, un deck de slides, une page
> sans utilitaires — Tailwind n'est pas nécessaire, et le flag évite à npm de le réclamer.
> **Dès que tu importes `theme.css`, Tailwind >= 4 devient obligatoire** : ce fichier porte les
> `@import "tailwindcss/…"`. Le flag ne rend pas Tailwind facultatif dans ce cas — il dit
> seulement que npm ne bloquera pas l'installation. C'est le build CSS qui échouera.

`lucide-react` et `tailwind-merge` sont des **peers** depuis le premier `package.json` du
gabarit, jamais des dépendances directes : en direct, une app qui a déjà les siennes en
embarque **deux copies** dans son bundle. `tailwind-merge` est épinglé
en 3.x parce que la 2.x ne connaît pas les groupes de classes de Tailwind v4 : elle résoudrait les
conflits faux, sans rien signaler — et `cn()` est précisément l'endroit où ça coûte une couleur
supprimée du DOM.

---

## Mise en route

Le design system se branche en **deux fichiers**, et ils ne s'importent pas de la même façon.

### 1. Les fondations — import **JS** (recommandé)

Socle plus marque. Deux lignes, pas une : c'est ce qui rend explicite la marque que tu montes.

```ts
// src/main.tsx — une app du projet
import '@compagnons-ia/ds/core.css';
import '@compagnons-ia/ds/brand-example.css';
```

```ts
// ou, pour un projet qui a sa propre marque
import '@compagnons-ia/ds/core.css';
import './brand-client.css';        // écrit à partir de brand.template.css
```

> **Pourquoi deux fichiers et pas un override en cascade.** Importer le système complet puis
> redéclarer par-dessus laisserait un jeton oublié retomber EN SILENCE sur la valeur d'origine.
> Avec deux fichiers, un jeton manquant fait que la variable **n'existe pas** — et ça casse à
> l'écran. Même logique que `--text-*: initial`, qui supprime l'échelle typo native de Tailwind :
> une régression doit casser au lieu de dériver.

**Il n'y a pas d'entrée qui monte une marque toute seule.** Elle serait identique à
`core.css` sous un autre nom — deux noms pour un fichier — et c'est précisément ce qui rendait
une copie client sale : on héritait d'une marque sans l'avoir demandée. Deux imports, toujours.

Les mêmes fichiers **depuis ton CSS marchent aussi** et produisent le même résultat — couches,
jetons et polices compris. L'import JS reste la voie recommandée : c'est celle que fait tourner la
vitrine, donc celle qui est vérifiée à chaque version.

**L'extension métier est à part et optionnelle.** `brand-content.css` et le sous-chemin
`@compagnons-ia/ds/brand-content` portent les halos de vignette et les icônes de plateformes : de
quoi fabriquer une miniature ou une carte de motion, pas un écran. Une app d'interface ne
les importe pas et ne perd rien.

### 2. La couche Tailwind — import **CSS**

`theme.css` branche les tokens sur Tailwind v4. Il doit être atteint par un `@import` **depuis le
fichier CSS de ton app** — celui que traite `@tailwindcss/vite`. Jamais par un import JS : Tailwind
ne le verrait pas.

```css
/* src/index.css — l'entrée CSS de l'app */
@import '@compagnons-ia/ds/theme.css';
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({ plugins: [react(), tailwindcss()] });
```

Plus de `tailwind.config.js`, plus de `postcss.config.js`, plus d'`autoprefixer` : tout vit dans le
CSS.

> **Supprime ton `@import "tailwindcss";`.** `theme.css` porte lui-même les imports de Tailwind —
> `theme.css` et `utilities.css`, chacun dans sa couche. Si ton app garde sa propre ligne,
> Tailwind est chargé **deux fois**, et ce second chargement amène un preflight qui arrive
> **après** le reset du design system : c'est l'ordre qui te coûte tes titres, pas une
> incompatibilité. Le socle porte déjà son preflight — voir juste en dessous.

#### Ce que `theme.css` règle pour toi

- **Le preflight est là, et c'est `core.css` qui le porte** — depuis la 0.2.0. Il est versé
  dans le dépôt (`src/styles/tokens/preflight.css`, copie conforme de celui de Tailwind) et
  chargé en `layer(base)` **juste avant** le reset du socle, dans le même fichier : le
  preflight normalise, l'identité du socle repasse par-dessus. Tu n'as rien à importer, et
  surtout rien à ajouter dans `theme.css` — son en-tête explique pourquoi le geste y est
  interdit.
- **La couleur de bordure par défaut est celle du système**, pas celle du texte. Tailwind v4
  laisse `border-color: currentColor` : un `border` nu tracerait un filet quasi noir là où on
  attend le gris doux de `--border`. `tokens/base.css` repose le défaut sur
  `var(--border, currentColor)` — écart délibéré, et le cas inverse s'écrit
  `border-current`.
- **Les couches** : `@layer theme, base, components, utilities`. Le reset du DS est en `base`, les
  états `.ds-*` en `components`. C'est ce qui permet à un utilitaire Tailwind passé en `className`
  de **surcharger** un composant — `<Card className="p-space-7">` applique bien `--space-7` —
  exactement comme en v3.
- **Le thème sombre** est le scope `.dark`, jamais un media query (`@custom-variant dark`).

`theme.css` ne contient **que** des `var(--…)` : il branche les tokens sur Tailwind, il n'invente
aucune valeur.

### 3. Les composants

```tsx
import { Button, Card, Icon } from '@compagnons-ia/ds';

<Card variant="feature" size="lg">
  <h2>J'ai construit cette <span className="accent">app</span> en un week-end</h2>
  <Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" />}>
    On build une app
  </Button>
</Card>
```

### 4. L'échelle d'app — opt-in, outils internes desktop

Les outils internes desktop importent en plus un module d'échelle, qui adapte la taille racine
par palier de largeur d'écran pour garder une mise en page effective proche de la maquette :

```ts
import '@compagnons-ia/ds/core.css';
import '@compagnons-ia/ds/brand-example.css';
import '@compagnons-ia/ds/app-scale.css';   // outils internes desktop uniquement
```

Les paliers sont en **%** : ils multiplient la préférence de taille de texte du navigateur au lieu
de l'écraser — l'interdit « jamais de `font-size` px sur `html` » reste respecté. **Le site public,
les e-mails et les slides ne l'importent jamais** : le socle et la marque, rien de plus.

### 5. Le thème sombre

```tsx
document.documentElement.classList.toggle('dark', isDark);
```

Une section ink au milieu d'une page crème adopte le scope, elle ne peint pas un fond à la main :

```tsx
<section className="dark bg-background text-foreground">…</section>
```

---

## Ce que `theme.css` expose

| Famille | Utilitaires |
|---|---|
| Couleurs | `bg-background` `text-foreground` `bg-card` `text-card-foreground` `bg-popover` `bg-primary` `bg-secondary` `bg-muted` `text-muted-foreground` `bg-accent` `bg-destructive` `border-border` `ring-ring` `bg-tone-dark` `bg-tone-dark-soft` `bg-tone-light` `bg-tone-light-alt` `text-text-secondary` `text-text-muted` `text-text-inverted` `bg-brand-from/via/to` `bg-pill-*-bg` `text-pill-*-fg` |
| Dégradés | `bg-brand-gradient` `bg-brand-gradient-diagonal` `bg-grad-soft` `bg-halo` — pas de namespace v4 pour `background-image` : ce sont des `@utility`, donc variantables (`hover:`, `dark:`) |
| Rayons | `rounded-xs` `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` `rounded-2xl` `rounded-pill` — **DOCTRINE ARRONDIE de ce projet : le pill est la règle**, tout ce qui se presse ou se remplit le porte ; les exceptions sont listées dans `docs/DESIGN.md` § 5. **`rounded` nu n'est pas au barème**, voir plus bas |
| Ombres | `shadow-sm` `shadow-md` `shadow-lg` `shadow-glow` `shadow-glow-lg` |
| Typo | `font-display` `font-body` `font-mono` · `text-display-xl` `text-display` `text-heading-xl` `text-heading` `text-subheading` `text-heading-sm` `text-body-lg` `text-body` `text-body-sm` `text-control` `text-caption` `text-eyebrow` `text-chip` |
| Espacement | `gap-space-1` … `gap-space-8` · `h-control-sm/md/lg` · `w-icon-control-sm/md/lg` · `p-card-pad` `p-card-pad-lg` — **rail unique** : tous les contrôles s'alignent sur `--control-md`, qui descend à 2.75rem sous 64rem |
| Largeurs | `max-w-shell` `max-w-wide` `max-w-read` `max-w-narrow` `max-w-page` |
| Motion | `ease-standard` |

L'échelle d'espacement est **nommée** (`space-5`, pas `5`) : elle n'écrase pas l'échelle numérique
de Tailwind, sur laquelle reposent les composants shadcn de ton app.

> **L'échelle typo, elle, remplace la native.** `text-xs`, `text-sm`, `text-base`, `text-lg`… ne
> sont plus générables : seuls les paliers sémantiques du DS existent. Une régression casse
> visiblement au lieu de dériver en silence.
>
> Si ton app ajoute ses propres paliers, ne reconstruis pas la configuration `tailwind-merge` à
> côté : appelle `makeCn`. Les paliers du DS y sont déjà, tu ne donnes que les tiens — sans le
> préfixe `text-`. Sans ça, `text-control` repasse **couleur** et disparaît du DOM au premier
> conflit avec `text-foreground`.
> ```ts
> import { makeCn } from '@compagnons-ia/ds';
> export const cn = makeCn(['tab', 'hero']);   // + text-tab, text-hero
> ```
> `cn` reste le raccourci quand il n'y a aucun palier à ajouter, et `PALIERS_TYPO` reste exporté
> pour les cas où tu veux la liste brute.

> **`rounded` nu n'existe plus au barème.** En v3, `rounded` valait `var(--radius)`, soit 20 px.
> En v4 c'est un utilitaire **statique** de Tailwind, câblé sur `0.25rem`, qu'aucun token ne peut
> reprendre : un `@utility rounded` fusionnerait avec lui au lieu de le remplacer, et le natif
> gagnerait. Écris **`rounded-lg`**, qui vaut exactement l'ancien `rounded`. Un `rounded` oublié ne
> lève aucune erreur : il passe silencieusement de 20 px à 4 px.

> **Le paquet n'est pas scanné par Tailwind.** v4 ne lit pas `node_modules`. Sans effet
> aujourd'hui : les 39 composants s'habillent en classes `.ds-*` et n'écrivent aucun utilitaire
> Tailwind. C'est une précaution pour l'avenir — le jour où un composant du DS écrira une classe
> Tailwind, l'app devra pointer le paquet :
> ```css
> @source "../node_modules/@acme/ds/src";
> ```

`tokens/base.css` fournit aussi des classes prêtes à l'emploi : `.display` `.display-xl` `.eyebrow`
`.chip` `.accent` `.mono` `.caption` `.prose` `.halo` `.page` `.ds-logo`.

---

## Composants

| Famille | Composants |
|---|---|
| `icons` | `Icon` — 48 glyphes Lucide ; la taille vient du **créneau** (`--ds-icon-size`, repli `1.25rem`), `size` reste la surcharge au site d'appel. Échelle : `1` · `1.125` (contrôle md, TabBar) · `1.25` · `1.5` rem |
| `actions` | `Button` · `IconButton` — 4 variantes (5 pour `IconButton`, `accent` compris), 3 tailles, pill (doctrine arrondie) |
| `forms` | `Input` · `Textarea` · `Select` · `Checkbox` · `Radio` · `Switch` · `FormField` · `Calendar` · `DatePicker` |
| `data-display` | `Card` (+ en-tête à slots) · `Pastille` · `Badge` (2 rembourrages) · `ChatBubble` (`them` / `me`, indicateur `typing`) · `Tooltip` · `Separator` · `Table` (+ `THead` `TBody` `Tr` `Th` `Td`) — `framed` · `columns` · `striped` · `hoverable`, composables |
| `feedback` | `Toast` · `Banner` · `EmptyState` · `Skeleton` · `SkeletonCard` · `Spinner` · `Progress` |
| `overlays` | `Modal` (3 phases + feuille basse sous 64 rem) · `ActionSheet` · `Dropdown` |
| `navigation` | `Navbar` · `Footer` · `Tabs` (+ `onCard` / `onPage`) · `TabBar` (coque mobile flottante, 4 onglets, `dock`) · `Pagination` · `AppShell` · `Sidebar` |
| `brand` | `Logo` · `Halo` · `Avatar` |

Tous sont exportés en nommé depuis la racine, avec leurs types :

```ts
import { Button, type ButtonProps } from '@compagnons-ia/ds';
```

Les règles d'usage composant par composant sont dans [`docs/PROMPTS.md`](docs/PROMPTS.md).

**En classes, sans composant** (parcours cœur, Compagnons IA) : `.ds-option` (md / sm),
`.ds-chip`, `.ds-steps`, `.ds-counter`, `.ds-badge--card`, `.ds-card.is-selected` +
`.ds-card__flag`, `.ds-portrait` (la vignette d'une personne sans photo). Structure et
usage : [`PORTAGE.md`](PORTAGE.md).

> **Doctrine ⋯ .** `Dropdown` est **desktop only**. Sous 64 rem, un menu ⋯ s'ouvre **toujours** en
> `ActionSheet`, jamais en `Dropdown` : ce ne sont pas deux composants concurrents, c'est le même
> geste sur deux tailles d'écran. La règle est tenue par le CSS — au-dessus de 64 rem,
> `.ds-scrim--sheet` est en `display:none`, une ActionSheet modale y est impossible. Le composant
> le signale en console en développement.

> **Hors périmètre** — une famille `content` (`CodeBlock`, `StepCard`, `BeforeAfter`,
> `QuoteBlock`) et un `MetricPill` ont existé puis sont sortis du socle : ce sont des
> composants métier, ils vivent dans l'app qui en a besoin. Les classes `.ds-metric*`
> restent dans `patterns.css`, une app peut donc reconstruire sa propre pill de métrique
> sans réinventer une valeur.

---

## Polices

`src/styles/assets/fonts/` existe et est **vide** : c'est là qu'un projet dépose ses `.woff2`
auto-hébergés, chargés par les `@font-face` en tête de son fichier de marque. Le socle ne
connaît que les trois NOMS `--font-display` / `--font-body` / `--font-mono`. (La marque
d'exemple charge les siennes depuis Google Fonts, le dossier reste donc vide dans le dépôt.)
Pour le logo, préfère le composant `Logo` : il rend le mark en CSS, avec le point en dégradé.

---

## Développement

```bash
npm install          # dépendances du paquet
npm run build        # tsup → dist/ (ESM + CJS + .d.ts)
npm run typecheck    # tsc --noEmit
npm run lint         # typecheck + les treize gardes
```

`npm run lint` enchaîne le typecheck et **treize gardes** ; un quatorzième, `check-classes.mjs`,
vit dans `npm run build`. Le premier de la chaîne est
[`check-token-refs.mjs`](check-token-refs.mjs) — c'est le moins cher, et un jeton manquant rend le
diagnostic des autres trompeur : il refuse tout `var(--x)` lu par le CSS du système ou par un style
inline de composant sans qu'un `--x:` soit déclaré. Un `var()` non résolu n'est pas ignoré, il rend
la déclaration **invalide at computed-value time** — pour un `font-size`, ça veut dire `inherit`, et
un `Button size="sm"` rend alors plus GROS qu'un `md`. C'est le garde qui compte le plus **sur un
projet client**, parce que `patterns.css` est justement le fichier que le portage réécrit.

Vient ensuite, entre autres, [`check-utility-collisions.mjs`](check-utility-collisions.mjs), qui
refuse tout `@utility` de `theme.css` portant le nom d'une classe qu'un jeton de thème génère
déjà : en Tailwind v4 les deux déclarations **fusionnent** dans la même règle et la dernière gagne,
sans erreur ni avertissement.

**Trois gardes lisent le CODE, pas le CSS** — [`check-dead-utilities.mjs`](check-dead-utilities.mjs),
[`check-font-px.mjs`](check-font-px.mjs) et [`check-fragile-classes.mjs`](check-fragile-classes.mjs).
Ils ferment les pièges de [`docs/PIEGES.md`](docs/PIEGES.md) : une classe que `theme.css` a
supprimée et qui ne rend rien, une taille de police en pixels qui ne suit pas `app-scale.css`, un
utilitaire posé sur `.accent` ou `.eyebrow` qui tue le dégradé. **Ils prennent un dossier en
argument** — un design system né de ce gabarit les emporte, et chaque app les pointe sur son propre
`src/` :

```bash
node check-dead-utilities.mjs src
node check-font-px.mjs src
node check-fragile-classes.mjs src
```

Chacun **dérive** ce qu'il surveille au lieu de le recopier (les classes mortes se déduisent des
`initial` de `theme.css`, les classes fragiles du CSS qui les déclare) et **rejoue son jumeau de
falsification à chaque appel** : un motif qui ne reconnaît plus rien rend un garde toujours vert,
donc décoratif — et ce mode de panne est aussi silencieux que les défauts qu'il surveille.

### La vitrine de recette

Une app Vite dans `demo/`, non publiée dans le paquet. Une page par famille, chaque composant dans
toutes ses variantes, tailles et états, plus le rendu des fondations. Trois modes : clair, sombre,
et **côte à côte** (les deux thèmes en vis-à-vis).

```bash
npm run demo:install    # une seule fois
npm run demo            # http://localhost:5273
```

La démo consomme le design system depuis ses **sources** : ce que tu vois est exactement ce qui est
publié. Elle n'utilise aucun style custom hors tokens.

---

## Périmètre et versions

**Ici : uniquement le générique.** Les composants métiers d'une app restent dans l'app.
Les gabarits de production (landing, miniatures, motion, slides, social) vivent dans les projets
consommateurs.

Semver + tags git. Une évolution = PR sur ce repo, bump, tag, puis mise à jour de la dépendance
dans chaque app. Le projet Claude Design reste l'atelier de conception ; tout changement validé y
est reporté, puis porté ici.

---

## Interdits

Pas de valeur inventée : chaque couleur, taille, rayon ou ombre vient d'un jeton. Pas
d'emoji dans l'INTERFACE (boutons, titres, navigation, chips, états, erreurs) — seul le
point médian `·` y est décoratif ; le CONTENU des personas (centres d'intérêt, messages)
peut en porter. La copie tutoie, chaleureuse et posée (`docs/DESIGN.md` § 1). Un seul CTA
primaire par vue, sauf CTA répété à l'identique dans une liste de cartes. Le pill est la RÈGLE, pas l'exception (doctrine
arrondie, `docs/DESIGN.md` § 5). La face
`--font-display` est réservée aux titres, jamais sous `1.125rem`, jamais faux-grassée — sa
casse et sa graisse viennent de `--heading-transform` / `--heading-weight`, que la marque
règle. `--tone-deep` : miniatures et motion uniquement. Jamais `rounded` nu — toujours
`rounded-lg` : en Tailwind v4, `rounded` est un littéral de 4 px hors barème, et il dérive
sans rien signaler. Pas de `sparkles` : l'étoile-éclair est bannie du set, elle signe
« fait par une IA ». Les actions destructives prennent `trash-2`.

Les interdits de **couleur** (« pas de bleu », « pas de tel rose ») appartiennent à chaque
marque, pas au squelette : écrivez les vôtres dans `docs/DESIGN.md`.
