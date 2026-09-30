import { useState } from 'react';
import { ContentIcon } from '@compagnons-ia/ds/brand-content';
import { IDENTITY } from '../identity';
import { AppShell, Avatar, Button, Footer, Icon, IconButton, Navbar, Pagination, Sidebar, TabBar, Tabs, Logo } from '@compagnons-ia/ds';
import { Block, Row, Section } from '../ui';

const LINKS = [{ label: 'Vidéos', active: true }, { label: 'Séries' }, { label: 'À propos' }];
const SERIES = [
  { value: 'all', label: 'Tout' },
  { value: 'build', label: 'Build' },
  { value: 'tuto', label: 'Tuto' },
  { value: 'coulisses', label: 'Coulisses' },
];

/* Les quatre destinations de la coque — la limite du composant, montrée telle quelle. */
const COQUE = [
  { value: 'accueil', label: 'Accueil', icon: <Icon name="house" /> },
  { value: 'discussions', label: 'Discussions', icon: <Icon name="message-square" /> },
  { value: 'profil', label: 'Profil', icon: <Icon name="user" /> },
  { value: 'reglages', label: 'Réglages', icon: <Icon name="settings" /> },
];

export function NavigationPage() {
  const [tab, setTab] = useState('build');
  const [onglet, setOnglet] = useState('accueil');
  const [page, setPage] = useState(4);
  const [longPage, setLongPage] = useState(12);

  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Navbar" note="Posée sur --card (blanche) avec une bordure basse en permanence — doctrine « le blanc est la surface portée » : un contrôle posé sur la mise en page crème, jamais transparent. Au scroll elle se teinte, prend un blur(10px) et une ombre. Seul endroit du système qui utilise backdrop-filter.">
        <Block label="Au repos">
          <div className="overflow-x-auto rounded-xl border border-border">
            <Navbar homeLabel={`${IDENTITY.personne} — accueil`} brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.375rem" />} scrolled={false} links={LINKS} cta={<Button size="sm">La newsletter</Button>} />
          </div>
        </Block>
        <Block label="État scrollé" hint="Teinte color-mix sur --card + blur + ombre.">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <Navbar homeLabel={`${IDENTITY.personne} — accueil`} brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.375rem" />} scrolled links={LINKS} cta={<Button size="sm">La newsletter</Button>} />
          </div>
        </Block>
        <Block label="Tons du logo" hint="Sans la prop letters, les lettres suivent --foreground : sur une surface sombre elles s'éclaircissent toutes seules. letters ne sert qu'à forcer.">
          <div className="dark overflow-x-auto rounded-xl border border-border bg-background">
            <Navbar homeLabel={`${IDENTITY.personne} — accueil`} brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.375rem" />} scrolled links={LINKS} cta={<Button size="sm">La newsletter</Button>} />
          </div>
          <div className="dark overflow-x-auto rounded-xl border border-border bg-background">
            <Navbar homeLabel={`${IDENTITY.personne} — accueil`} brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} letters="dark" height="1.375rem" />} scrolled letters="dark" links={LINKS} cta={<Button size="sm">La newsletter</Button>} />
          </div>
          <p className="caption">Le premier suit la surface ; le second force letters=&quot;dark&quot; sur fond sombre, pour montrer ce que fait la prop.</p>
        </Block>
      </Section>

      <Section title="Tabs" note="Barre BLANCHE (--card) sur la page, onglet actif sur la crème --background. Barre et onglets pill : --tabs-radius est redéclaré en marque, sinon l'onglet déborde des coins de sa barre.">
        <Block label="Interactif">
          <Row><Tabs items={SERIES} value={tab} onChange={setTab} /></Row>
          <p className="caption">Onglet actif : {SERIES.find(s => s.value === tab)?.label}</p>
        </Block>
        <Block label="onCard" hint="La barre contraste avec sa surface porteuse ET l'onglet actif contraste avec la barre : il descend d'un cran de surface, jamais au niveau de la barre. Sur la page : barre --card, actif --background. Sur une card : barre --background, actif --card. onPage fait l'inverse : un îlot crème dans une card qui doit rester blanc. Vérifie en clair ET en sombre — en sombre l'actif se mêle à l'encre (color-mix sur --card), l'ombre n'y porte plus l'élévation.">
          <Row label="sur la page (défaut)"><Tabs items={SERIES} value="build" onChange={() => undefined} /></Row>
          <Row label="sur une card — onCard">
            <span className="inline-flex rounded-lg border border-border bg-card p-space-4">
              <Tabs onCard items={SERIES} value="build" onChange={() => undefined} />
            </span>
          </Row>
          <Row label="îlot crème dans une card — onPage">
            <span className="inline-flex rounded-lg border border-border bg-card p-space-4">
              <span className="inline-flex rounded-lg bg-background p-space-3">
                <Tabs onPage items={SERIES} value="build" onChange={() => undefined} />
              </span>
            </span>
          </Row>
        </Block>
        <Block label="États">
          <Row label="sélection sur chaque item">
            <Tabs items={SERIES} value="all" onChange={() => undefined} />
          </Row>
          <Row label="survol forcé sur le deuxième item">
            <div className="ds-tabs">
              <button type="button" className="ds-tab" aria-selected="true">Tout</button>
              <button type="button" className="ds-tab is-hover">Build</button>
              <button type="button" className="ds-tab">Tuto</button>
            </div>
          </Row>
        </Block>
      </Section>

      <Section title="TabBar" note="La coque de la PWA sur mobile : une capsule BLANCHE FLOTTANTE, détachée des bords, ombre --shadow-lg. Quatre destinations au plus, libellés toujours visibles. L'item actif se pose dans sa propre capsule --accent, icône et libellé en --primary-readable.">
        <Block label="Spécimen — cadre 390 px" hint="La largeur de l'écran de référence, sur la crème de la mise en page. La barre flotte au-dessus du contenu : marges latérales, marge basse, safe-area comprise.">
          {/* 24.375rem = 390 px, l'écran de référence du projet. */}
          <div className="overflow-hidden rounded-xl border border-border bg-background" style={{ width: '24.375rem', maxWidth: '100%' }}>
            <div className="flex flex-col gap-space-2 p-space-5">
              <h3>{COQUE.find(o => o.value === onglet)?.label}</h3>
              <p className="caption">Le contenu de l'écran vit ici. Change d'onglet : la capsule --accent suit, le reste ne bouge pas.</p>
            </div>
            <TabBar items={COQUE.map(o => ({ ...o, active: o.value === onglet, onSelect: () => setOnglet(o.value) }))} />
          </div>
          <p className="caption">Dans l'app, <code className="mono">dock</code> l'enveloppe dans <code className="mono">.ds-tabbar-dock</code> — <code className="mono">position:fixed</code>, collée en bas de l'écran. Ici on la rend dans le flux : un spécimen ne se fixe pas au viewport de la vitrine.</p>
        </Block>
        <Block label="États" hint="Repos, survol forcé, actif. Un cinquième onglet est rendu quand même — couper une navigation en silence serait pire — mais signalé en console en développement. Cible tactile : 36 à l'œil, 44 au doigt — l'item se voit à 2.25rem, ses marges de --space-1 portent le reste. C'est la règle du système, pas un écart : voir docs/accessibilite.md § 4.">
          <div className="rounded-xl bg-background p-space-3" style={{ maxWidth: '24.375rem' }}>
            <div className="ds-tabbar">
              <button type="button" className="ds-tabbar__item is-active" aria-current="page"><Icon name="house" /><span>Accueil</span></button>
              <button type="button" className="ds-tabbar__item is-hover"><Icon name="message-square" /><span>Discussions</span></button>
              <button type="button" className="ds-tabbar__item"><Icon name="user" /><span>Profil</span></button>
              <button type="button" className="ds-tabbar__item"><Icon name="settings" /><span>Réglages</span></button>
            </div>
          </div>
        </Block>
      </Section>

      <Section title="Pagination" note="Contrôlée. Barre BLANCHE --card au rayon pill (--pagination-radius), même traitement que les onglets ; survol et page courante descendent sur la crème --background. Au-delà de 7 pages, une ellipsis en icône — jamais le caractère.">
        <Block label="Peu de pages">
          <Row><Pagination page={page} pageCount={5} onPageChange={setPage} /></Row>
          <p className="caption">Page {page} sur 5.</p>
        </Block>
        <Block label="Beaucoup de pages" hint="Ellipsis des deux côtés selon la position.">
          <Row><Pagination page={longPage} pageCount={40} onPageChange={setLongPage} /></Row>
          <Row label="première page"><Pagination page={1} pageCount={40} onPageChange={() => undefined} /></Row>
          <Row label="dernière page"><Pagination page={40} pageCount={40} onPageChange={() => undefined} /></Row>
        </Block>
        <Block label="Page unique" hint="Les deux flèches sont désactivées.">
          <Row><Pagination page={1} pageCount={1} onPageChange={() => undefined} /></Row>
        </Block>
      </Section>

      <Section title="AppShell et Sidebar" note="Le squelette des outils internes : grille [barre latérale | contenu]. La barre est BLANCHE (--card) et la zone de contenu porte la crème ; items pill, survol et actif sur --background. Repliable en icônes seules, l'état est persisté en localStorage.">
        <Block label="Complet" hint="responsive={false} et staticLayout épinglent la mise en page à deux colonnes pour la vitrine. Chaque section est un groupe : 16px les séparent, avec ou sans titre — le dernier groupe, sans titre, ne se colle plus au précédent.">
          <div className="overflow-hidden rounded-xl border border-border">
            <AppShell
              responsive={false}
              sidebar={
                <Sidebar
                  brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.25rem" />}
                  brandCollapsed={<Logo variant="monogram" wordmark={IDENTITY.wordmark} height="1.5rem" />}
                  staticLayout
                  storageKey="ds-demo-sidebar"
                  sections={[
                    { title: 'Pilotage', items: [
                      { label: 'Accueil', icon: <Icon name="house" />, active: true },
                      { label: 'Vidéos', icon: <Icon name="video" /> },
                      { label: 'Séries', icon: <Icon name="folder" /> },
                    ] },
                    { title: 'Perso', items: [
                      { label: 'Sport', icon: <Icon name="dumbbell" /> },
                    ] },
                    { items: [
                      { label: 'Réglages', icon: <Icon name="settings" /> },
                    ] },
                  ]}
                  footer={
                    <span className="flex items-center gap-space-3">
                      <Avatar size="2rem" halo={false} initials={IDENTITY.monogram} alt={IDENTITY.personne} />
                      <span className="flex flex-col">
                        <span className="text-caption font-semibold">{IDENTITY.personne}</span>
                        <span className="caption">{IDENTITY.lieu}</span>
                      </span>
                    </span>
                  }
                />
              }
            >
              <div className="flex flex-col gap-space-4 p-space-5">
                <h3>Accueil</h3>
                <p className="caption">Le contenu de l'outil vit ici. Replie la barre avec le bouton en tête pour voir le mode icônes seules — l'état est retenu.</p>
                <Row><Button size="sm" icon={<Icon name="plus" />}>Nouveau build</Button></Row>
              </div>
            </AppShell>
          </div>
        </Block>
        <Block label="Sidebar repliée" hint="defaultCollapsed force l'état initial sans toucher au localStorage.">
          <div className="overflow-hidden rounded-xl border border-border">
            <AppShell
              responsive={false}
              sidebar={
                <Sidebar
                  brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.25rem" />}
                  brandCollapsed={<Logo variant="monogram" wordmark={IDENTITY.wordmark} height="1.5rem" />}
                  staticLayout
                  defaultCollapsed
                  collapsible={false}
                  storageKey="ds-demo-sidebar-collapsed"
                  sections={[{ items: [
                    { label: 'Accueil', icon: <Icon name="house" />, active: true },
                    { label: 'Vidéos', icon: <Icon name="video" /> },
                    { label: 'Réglages', icon: <Icon name="settings" /> },
                  ] }]}
                />
              }
            >
              <div className="p-space-5"><p className="caption">Mode icônes seules : le libellé est masqué, il passe en title.</p></div>
            </AppShell>
          </div>
        </Block>
      </Section>

      <Section title="Footer" note={`La ligne de localisation utilise le point médian : ${IDENTITY.lieu}. Elle n'a plus de valeur par défaut : le socle en portait une, codée en dur, et un projet ne pouvait pas la retirer.`}>
        <Block label="Complet" hint="Comme la Navbar, le logo suit --foreground sans tone.">
          <div className="overflow-x-auto rounded-xl border border-border">
            <Footer
              brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.25rem" />}
              note={IDENTITY.lieu}
              columns={[
                { title: 'Séries', links: [{ label: 'Build' }, { label: 'Tuto' }, { label: 'Coulisses' }] },
                { title: 'Ressources', links: [{ label: 'La newsletter' }, { label: 'Les prompts' }] },
                { title: 'Marque', links: [{ label: 'À propos' }, { label: 'Contact' }] },
              ]}
              social={<>
                <IconButton label="YouTube"><ContentIcon name="youtube" /></IconButton>
                <IconButton label="Instagram"><ContentIcon name="instagram" /></IconButton>
                <IconButton label="GitHub"><Icon name="github" /></IconButton>
              </>}
            />
          </div>
        </Block>
      </Section>
    </div>
  );
}
