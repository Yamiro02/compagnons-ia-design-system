import { Avatar, Halo, Logo } from '@compagnons-ia/ds';
/* Extension MÉTIER, sous-chemin optionnel — la vitrine la rend, une app d'interface non. */
import { HaloHot } from '@compagnons-ia/ds/brand-content';
import { IDENTITY } from '../identity';
import { Block, Grid, Row, Section } from '../ui';

/* Les trois proportions que les écrans demandent — aucune n'est dans le CSS. */
const RATIOS = [
  { ratio: '3 / 4', lettre: 'C' },
  { ratio: '1 / 1', lettre: 'É' },
  { ratio: '16 / 9', lettre: 'M' },
];

/* LA STRUCTURE À RECOPIER, et elle tient en trois nœuds. Le conteneur porte la mise en page
   et la typo ; le halo est derrière ; l'initiale ne porte QUE `.accent` et sa lettre — pas
   une classe de plus, pas un style inline. C'est la parade au piège de la classe clippée
   (docs/PIEGES.md), et check-fragile-classes.mjs la vérifie sur ce fichier. */
function PortraitDemo({ ratio, lettre }: { ratio: string; lettre: string }) {
  return (
    <span className="ds-portrait" style={{ aspectRatio: ratio }}>
      <Halo placement="center" />
      <span className="accent">{lettre}</span>
    </span>
  );
}

export function BrandPage() {
  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Logo" note="Le mark est rendu en CSS : --font-display + point carré arrondi en --brand-gradient-diagonal, avec --shadow-logo-dot. Casse et graisse suivent --heading-transform / --heading-weight, comme le titrage. Le point garde le dégradé sur tous les fonds ; seules les lettres s'inversent.">
        <Block label="Variantes">
          <Row label="wordmark"><Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.75rem" /></Row>
          <Row label="stacked"><Logo variant="stacked" wordmark={IDENTITY.wordmark} height="1.75rem" /></Row>
          <Row label="monogram"><Logo variant="monogram" wordmark={IDENTITY.wordmark} height="2.5rem" /></Row>
        </Block>
        <Block label="Tailles" hint="height pilote la hauteur du mark ; la taille de police en découle.">
          <Row>
            <Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1rem" />
            <Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.375rem" />
            <Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.75rem" />
            <Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="2.5rem" />
          </Row>
        </Block>
        <Block label="Tons" hint="letters='dark' force les lettres sombres, letters='light' les force claires. Sans la prop, elles suivent --foreground et s'inversent avec la surface.">
          <Grid cols={2}>
            <div className="flex items-center justify-center rounded-xl border border-border p-space-6" style={{ background: 'var(--tone-light)' }}>
              <Logo variant="wordmark" wordmark={IDENTITY.wordmark} letters="dark" height="1.75rem" />
            </div>
            <div className="flex items-center justify-center rounded-xl border border-border p-space-6" style={{ background: 'var(--tone-dark)' }}>
              <Logo variant="wordmark" wordmark={IDENTITY.wordmark} letters="light" height="1.75rem" />
            </div>
          </Grid>
        </Block>
      </Section>

      <Section title="HaloHot" note="Le halo CHAUD des miniatures — --gradient-thumbnail. EXTENSION MÉTIER : vignettes et cartes motion uniquement, jamais le site, jamais l'UI, jamais les slides. Importé à part, depuis @compagnons-ia/ds/brand-content.">
        <Block label="Sur --tone-deep" hint="Le seul contexte légitime : une surface d'export. Halo, lui, est le halo d'INTERFACE — plus discret, et dans le point d'entrée principal.">
          <Grid cols={2}>
            <div className="relative overflow-hidden rounded-xl p-space-7" style={{ background: 'var(--tone-deep)' }}>
              <HaloHot />
              <span className="relative mono text-caption" style={{ color: 'var(--tone-light)' }}>HaloHot</span>
            </div>
            <div className="relative overflow-hidden rounded-xl p-space-7" style={{ background: 'var(--tone-deep)' }}>
              <HaloHot intensity={0.5} />
              <span className="relative mono text-caption" style={{ color: 'var(--tone-light)' }}>intensity=0.5</span>
            </div>
          </Grid>
        </Block>
      </Section>

      <Section title="Halo" note="Dégradé radial chaud, ancré en bas, jamais plein écran. À poser dans une section position:relative, derrière le contenu.">
        <Grid cols={3}>
          <div className="relative overflow-hidden rounded-xl border border-border bg-card p-space-6">
            <Halo placement="bottom" />
            <div className="relative flex flex-col gap-space-2">
              <span className="eyebrow">placement</span>
              <h4>bottom</h4>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-border bg-card p-space-6">
            <Halo placement="top" />
            <div className="relative flex flex-col gap-space-2">
              <span className="eyebrow">placement</span>
              <h4>top</h4>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-border bg-card p-space-6">
            <Halo placement="center" />
            <div className="relative flex flex-col gap-space-2">
              <span className="eyebrow">placement</span>
              <h4>center</h4>
            </div>
          </div>
        </Grid>
        <Block label="intensity" hint="Multiplicateur d'opacité de 0 à 1.">
          <Grid cols={3}>
            {[0.35, 0.7, 1].map(i => (
              <div key={i} className="relative overflow-hidden rounded-xl border border-border bg-card p-space-6">
                <Halo intensity={i} />
                <span className="relative mono text-caption text-text-muted">intensity={i}</span>
              </div>
            ))}
          </Grid>
        </Block>
      </Section>

      <Section title="Avatar" note="Les portraits sont toujours des découpes, placées bas, halo derrière les épaules. Aucun portrait n'est fourni : sans src, le composant retombe sur le monogramme muté.">
        <Block label="Tailles et halo">
          <Row>
            <Avatar size="2.5rem" initials={IDENTITY.monogram} alt={IDENTITY.personne} />
            <Avatar size="3rem" initials={IDENTITY.monogram} alt={IDENTITY.personne} />
            <Avatar size="4rem" initials={IDENTITY.monogram} alt={IDENTITY.personne} />
            <Avatar size="6rem" initials={IDENTITY.monogram} alt={IDENTITY.personne} />
          </Row>
          <Row label="halo={false}">
            <Avatar size="3rem" halo={false} />
            <Avatar size="4rem" halo={false} />
          </Row>
        </Block>
      </Section>

      <Section title="Portrait de repli" note="La vignette d'une personne SANS photo, et qui n'a jamais l'air cassée : --gradient-portrait, un halo derrière, l'initiale en .accent. Une classe, pas un composant — l'app l'enveloppe dans sa propre carte. La classe ne décide pas de sa hauteur : l'appelant pose aspect-ratio ou height.">
        <Block label="Ratios" hint="3/4 en vignette de catalogue · 1/1 en recommandation · 16/9 en bandeau de fiche. Aucun ratio n'est dans le CSS : les trois viennent du site d'appel.">
          <Grid cols={3}>
            {RATIOS.map(r => (
              <div key={r.ratio} className="flex flex-col gap-space-2">
                <PortraitDemo ratio={r.ratio} lettre={r.lettre} />
                <span className="mono text-caption text-text-muted">aspectRatio: {r.ratio}</span>
              </div>
            ))}
          </Grid>
        </Block>
        <Block label="Le portrait suit le thème" hint="Le dégradé mélange les arrêts de marque dans --card, pas dans un blanc nommé : il bascule donc avec le thème. Le premier spécimen suit la vitrine ; le second force le sombre, où l'initiale quitte .accent pour --primary-readable en aplat (le dégradé clippé y tombait à 1,90:1). Pour voir les deux thèmes CÔTE À CÔTE dans tous les cas, passe la vitrine en « Côte à côte » : un îlot CLAIR dans une page sombre n'existe pas — le thème se pose en .dark sur la racine, et aucune classe ne le retire.">
          <Grid cols={2}>
            <div className="flex flex-col gap-space-2 rounded-xl bg-background p-space-4">
              <span className="chip text-text-muted">thème courant</span>
              <PortraitDemo ratio="3 / 4" lettre="C" />
            </div>
            <div className="dark flex flex-col gap-space-2 rounded-xl bg-background p-space-4">
              <span className="chip text-text-muted">sombre, forcé</span>
              <PortraitDemo ratio="3 / 4" lettre="C" />
            </div>
          </Grid>
        </Block>
        <Block label="Avec photo, sans photo" hint="Le repli n'est pas un trou : posé à côté d'une vraie photo, il tient la même place et la même chaleur. La photo est un simple <img> de l'app — le socle n'en fournit aucune.">
          <Grid cols={2}>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <span className="ds-portrait" style={{ aspectRatio: '3 / 4' }}>
                <Halo placement="center" />
                <span className="accent">M</span>
              </span>
              <div className="flex flex-col gap-space-1 p-space-3">
                <span className="text-control font-bold">Sans photo</span>
                <span className="caption">Le repli de marque.</span>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <span className="ds-portrait" style={{ aspectRatio: '3 / 4', background: 'var(--muted)' }}>
                <span className="caption">l&apos;&lt;img&gt; de l&apos;app vient ici</span>
              </span>
              <div className="flex flex-col gap-space-1 p-space-3">
                <span className="text-control font-bold">Avec photo</span>
                <span className="caption">Même boîte, même ratio.</span>
              </div>
            </div>
          </Grid>
        </Block>
      </Section>

    </div>
  );
}
