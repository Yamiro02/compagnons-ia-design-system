import { useRef, useState, type KeyboardEvent } from 'react';
import { IDENTITY } from '../identity';
import { Button, Calendar, Checkbox, DatePicker, FormField, Icon, IconButton, Input, Radio, RangeSlider, Select, Switch, Textarea } from '@compagnons-ia/ds';
import { Block, Grid, Row, Section, Stack } from '../ui';

const SERIES = [
  { value: 'build', label: 'Build' },
  { value: 'tuto', label: 'Tuto' },
  { value: 'coulisses', label: 'Coulisses' },
];

/* Parcours cœur — contenus d'exemple de l'onboarding. */
const INTENTIONS = [
  { value: 'complicite', label: 'Une belle complicité' },
  { value: 'serieux', label: 'Une relation sérieuse' },
  { value: 'verra', label: 'On verra bien' },
];
const MOMENTS = ['Le matin', 'En soirée', 'Le week-end'];
const INTERETS = ['Cuisine', 'Randonnée', 'Jazz', 'Voyages', 'Bricolage', 'Cinéma'];
const RYTHMES = ['Tous les jours', 'Quelques fois par semaine', 'De temps en temps'];

/* Les cases de .ds-option — le balisage interne de Radio et Checkbox, repris tel quel. */
const CASE_RADIO = <span className="ds-choice__box ds-choice__box--radio"><span className="ds-choice__dot" /></span>;
const CASE_COCHE = <span className="ds-choice__box"><Icon name="check" size="0.8125rem" strokeWidth={3} /></span>;

/* .ds-steps — le libellé porte l'information, les points ne sont qu'un renfort. */
function Etapes({ courante, total }: { courante: number; total: number }) {
  return (
    <div className="ds-steps">
      <span className="ds-steps__label">Étape {courante} sur {total}</span>
      <span className="ds-steps__dots" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i + 1 < courante ? 'ds-steps__dot is-done' : i + 1 === courante ? 'ds-steps__dot is-current' : 'ds-steps__dot'} />
        ))}
      </span>
    </div>
  );
}

/* .ds-chip en mode RADIO — le comportement d'un radiogroup ARIA, écrit par l'app : un seul
   arrêt de tabulation (la chip choisie, sinon la première), les flèches déplacent le focus
   ET la sélection, en boucle. Le socle ne fournit que le rendu de aria-checked. */
function ChipsRadio({ label }: { label: string }) {
  const [choix, setChoix] = useState(RYTHMES[1]);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const arret = RYTHMES.includes(choix) ? choix : RYTHMES[0];
  const auClavier = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const pas = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!pas) return;
    e.preventDefault();
    const j = (i + pas + RYTHMES.length) % RYTHMES.length;
    setChoix(RYTHMES[j]);
    chips.current[j]?.focus();
  };
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap items-center gap-space-2">
      {RYTHMES.map((r, i) => (
        <button
          key={r}
          ref={el => { chips.current[i] = el; }}
          type="button"
          role="radio"
          aria-checked={choix === r}
          tabIndex={r === arret ? 0 : -1}
          className="ds-chip"
          onClick={() => setChoix(r)}
          onKeyDown={e => auClavier(e, i)}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

/* Écrans d'auth — contenus d'exemple (maquettes AUTH 1, 2d, 5a). */
const JOURS = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  .map((m, i) => ({ value: String(i + 1), label: m }));
const ANNEES = Array.from({ length: 83 }, (_, i) => ({ value: String(2008 - i), label: String(2008 - i) }));

/* Le mot de passe et son œil — la recette de `action` : une BASCULE (pressed), un libellé
   constant, l'icône et le type du champ qui suivent l'état. surface="page" : les spécimens
   sont posés dans un îlot crème, à l'intérieur d'une carte (voir « L'îlot on-page »). */
function MotDePasse({ id, label, error, help, defaultValue }: { id: string; label: string; error?: string; help?: string; defaultValue?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <FormField label={label} htmlFor={id} error={error} help={help}>
      <Input
        id={id}
        surface="page"
        type={visible ? 'text' : 'password'}
        autoComplete="new-password"
        invalid={Boolean(error)}
        defaultValue={defaultValue}
        action={{
          icon: <Icon name={visible ? 'eye-off' : 'eye'} />,
          label: 'Afficher le mot de passe',
          pressed: visible,
          onClick: () => setVisible(v => !v),
        }}
      />
    </FormField>
  );
}

/* La recherche à effacer — l'action n'existe QUE s'il y a du texte : elle apparaît au premier
   caractère et disparaît à l'effacement. Le <input> doit rester le même nœud (v0.7.1) : sinon
   le focus saute et la frappe suivante est perdue (« cla » devenait « c »). */
function RechercheEffacable({ id }: { id: string }) {
  const [q, setQ] = useState('');
  return (
    <Input id={id} size="sm" surface="page" icon={<Icon name="search" />} aria-label="Rechercher une compagne"
      placeholder="Rechercher une compagne" value={q} onChange={e => setQ(e.target.value)}
      action={q ? { icon: <Icon name="x" />, label: 'Effacer la recherche', onClick: () => setQ('') } : undefined} />
  );
}

/* La date de naissance en trois Select — un FormField `group`, chaque Select nommé par son
   aria-label. Grille 1 / 1.5 / 1.2, celle de la maquette AUTH 2d. */
function DateNaissance({ id, error }: { id: string; error?: string }) {
  return (
    <FormField group label="Date de naissance" htmlFor={id} error={error}>
      <div className="grid gap-space-2" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.5fr) minmax(0,1.2fr)' }}>
        <Select surface="page" aria-label="Jour" placeholder="Jour" options={JOURS} invalid={Boolean(error)} />
        <Select surface="page" aria-label="Mois" placeholder="Mois" options={MOIS} invalid={Boolean(error)} />
        <Select surface="page" aria-label="Année" placeholder="Année" options={ANNEES} invalid={Boolean(error)} />
      </div>
    </FormField>
  );
}

/* La barre de saisie du chat — Textarea sm (40 sur une ligne) qui grandit jusqu'à 5 lignes,
   et le bouton d'envoi qui SUIT la barre : IconButton sm, 40, calé en BAS (items-end) pour
   rester au niveau de la dernière ligne quand le champ grandit. */
function BarreDeSaisie() {
  const [texte, setTexte] = useState('');
  return (
    <div className="flex items-end gap-space-2">
      <Textarea size="sm" autoResize maxRows={5} surface="page" className="flex-1" aria-label="Ton message"
        placeholder="Écris à Claire…" value={texte} onChange={e => setTexte(e.target.value)} />
      <IconButton label="Envoyer" variant="primary" size="sm" disabled={!texte.trim()} onClick={() => setTexte('')}>
        <Icon name="arrow-right" />
      </IconButton>
    </div>
  );
}

/* onChange suit chaque cran ; onChangeEnd n'arrive qu'à la fin de l'interaction — c'est lui
   qu'on branche sur l'enregistrement. Les deux compteurs montrent l'écart. */
function CurseurEnregistre() {
  const [age, setAge] = useState<[number, number]>([35, 50]);
  const [crans, setCrans] = useState(0);
  const [enregistre, setEnregistre] = useState<[number, number] | null>(null);
  const [appels, setAppels] = useState(0);
  return (
    <Stack>
      <RangeSlider label="Tranche d'âge" min={25} max={65} value={age}
        onChange={v => { setAge(v); setCrans(n => n + 1); }}
        onChangeEnd={v => { setEnregistre(v); setAppels(n => n + 1); }}
        formatValue={v => `${v} ans`} display={`${age[0]} – ${age[1]} ans`} bounds={['25 ans', '65 ans et +']} />
      <span className="text-meta text-text-muted" aria-live="polite">
        onChange : {crans} cran{crans > 1 ? 's' : ''} · onChangeEnd : {appels} appel{appels > 1 ? 's' : ''}
        {enregistre ? ` · enregistré ${enregistre[0]} – ${enregistre[1]} ans` : ''}
      </span>
    </Stack>
  );
}

/* Le changement d'étape : le focus va sur le TITRE de l'étape (tabIndex -1), pour qu'un
   lecteur d'écran l'annonce. Le titre n'affiche pas d'anneau — il n'est pas actionnable ;
   le bouton, lui, garde le sien. */
const ETAPES = ['Ton prénom', 'Ta date de naissance', 'Tes centres d\'intérêt', 'Tes moments pour discuter', 'Ta compagne'];
function ChangementEtape() {
  const [etape, setEtape] = useState(1);
  const titre = useRef<HTMLHeadingElement>(null);
  const suivante = () => {
    setEtape(e => (e % ETAPES.length) + 1);
    requestAnimationFrame(() => titre.current?.focus());
  };
  return (
    <div className="flex flex-col gap-space-4">
      <Etapes courante={etape} total={ETAPES.length} />
      <h3 ref={titre} tabIndex={-1}>{ETAPES[etape - 1]}</h3>
      <Button variant="secondary" size="sm" onClick={suivante}>Étape suivante</Button>
    </div>
  );
}

/* Les consentements de l'inscription — l'erreur sous chaque case, alignée sur son texte. */
function Consentements() {
  const [majeur, setMajeur] = useState(false);
  const [cgu, setCgu] = useState(false);
  const [nouvelles, setNouvelles] = useState(true);
  return (
    <div className="flex flex-col gap-space-3">
      <Checkbox label="Je certifie avoir 18 ans ou plus" checked={majeur} onChange={e => setMajeur(e.target.checked)}
        error={majeur ? undefined : 'Coche cette case pour continuer.'} />
      <Checkbox label={<>J'accepte les <a href="#forms">CGU</a> et la <a href="#forms">politique de confidentialité</a></>}
        checked={cgu} onChange={e => setCgu(e.target.checked)} error={cgu ? undefined : 'Accepte les CGU pour continuer.'} />
      <Checkbox label="Je veux recevoir un mot de Claire par e-mail, une fois par semaine au plus — je peux me désinscrire à tout moment."
        checked={nouvelles} onChange={e => setNouvelles(e.target.checked)} />
    </div>
  );
}

export function FormsPage() {
  const [checked, setChecked] = useState(true);
  const [niveau, setNiveau] = useState('debutant');
  const [sombre, setSombre] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 8, 24));
  const [intention, setIntention] = useState('serieux');
  const [age, setAge] = useState<[number, number]>([35, 50]);
  const [ageSombre, setAgeSombre] = useState<[number, number]>([35, 50]);
  const [moments, setMoments] = useState<string[]>(['En soirée']);
  const [interets, setInterets] = useState<string[]>(['Jazz', 'Voyages']);
  const basculer = (liste: string[], valeur: string) =>
    liste.includes(valeur) ? liste.filter(v => v !== valeur) : [...liste, valeur];

  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Input" note="Hauteur posée (min-height + padding-block:0) : md 48 pour un champ de formulaire, sm 40 pour une barre de recherche ou de saisie. Bordure 1.5px. Le focus se lit sur la bordure seule, qui passe en --ring — jamais d'anneau en plus. PILL et BLANC : doctrine arrondie + « le blanc est la surface portée ».">
        <Block label="Tailles">
          <Stack>
            <Input size="sm" placeholder="Petite — 40, barre de recherche" />
            <Input size="md" placeholder="ton@email.com" />
            <Input size="lg" placeholder="Grande — 52, site vitrine uniquement" />
          </Stack>
        </Block>
        <Block label="États">
          <Stack>
            <Input placeholder="Repos" />
            <Input className="is-focus" defaultValue="Focus" />
            <Input invalid defaultValue="pas-un-email" />
            <Input disabled defaultValue="Indisponible" />
          </Stack>
        </Block>
        <Block label="Surfaces" hint="auto (défaut) = la déduction décide : blanc --card sur la mise en page, crème --background dans une card, une modale, une feuille, un popover ou la navbar. card force le crème hors d'une vraie .ds-card ; page force le blanc là où la déduction aurait mis du crème.">
          <Stack>
            <Input placeholder="surface=auto (défaut) — sur la page, donc blanc" />
            <Input surface="card" placeholder="surface=card — crème forcé" />
          </Stack>
        </Block>
        <Block label="L'îlot on-page" hint="Le cas de surface=page : un îlot crème posé DANS une card. La déduction y mettrait du crème sur du crème — le champ disparaîtrait. surface=page le remonte au blanc.">
          <div className="flex flex-col gap-space-3 rounded-xl bg-background p-space-4">
            <span className="chip text-text-muted">îlot --background dans la card de démo</span>
            <Input placeholder="sans la prop — le champ se fond dans l'îlot" />
            <Input surface="page" placeholder="surface=page — le champ redevient blanc" />
          </div>
        </Block>
        <Block label="Icône" hint="icon pose un glyphe DANS le champ, à gauche — un repère, pas un bouton : il est aria-hidden et ne se clique pas. Une action dans le champ passe par action (ci-dessous). Combinable avec unit et action.">
          <Stack>
            <Input icon={<Icon name="search" />} placeholder="Rechercher une compagne" />
            <Input icon={<Icon name="mail" />} type="email" placeholder="ton@email.com" />
            <Input icon={<Icon name="clock" />} unit="min" inputMode="numeric" placeholder="20" />
          </Stack>
        </Block>
        <Block label="Unité" hint="unit pose l'unité dans le champ, à droite, en sourdine — trois caractères au plus. aria-hidden : c'est le libellé du FormField qui la nomme.">
          <Stack>
            <Input unit="kg" inputMode="decimal" placeholder="72" />
            <Input unit="€" inputMode="decimal" placeholder="49" />
            <Input unit="min" inputMode="numeric" invalid defaultValue="beaucoup" />
          </Stack>
        </Block>
        <Block label="Action dans le champ" hint="action pose un VRAI bouton à droite, distinct de unit (un repère aria-hidden) : aria-label, aria-pressed quand c'est une bascule, jamais submit. 40 dans un champ md, 32 dans un sm, 44 au doigt ; le champ garde sa hauteur. Il n'agit que sur la valeur du champ — afficher / masquer, effacer ; une action qui fait autre chose est un IconButton posé à côté. Le premier îlot suit la vitrine, le second force le sombre.">
          <Grid cols={2}>
            {[false, true].map(dark => (
              <div key={String(dark)} className={`${dark ? 'dark ' : ''}flex flex-col gap-space-4 rounded-xl bg-background p-space-4`}>
                <span className="chip text-text-muted">{dark ? 'sombre, forcé' : 'thème courant'}</span>
                <MotDePasse id={dark ? 'mdp-sombre' : 'mdp-clair'} label="Mot de passe" defaultValue="voilier-du-port" />
                <RechercheEffacable id={dark ? 'recherche-sombre' : 'recherche-clair'} />
                <Input size="sm" surface="page" icon={<Icon name="search" />} defaultValue="Claire"
                  action={{ icon: <Icon name="x" />, label: 'Effacer la recherche', onClick: () => undefined }} />
                <Input disabled surface="page" type="password" defaultValue="indisponible"
                  action={{ icon: <Icon name="eye" />, label: 'Afficher le mot de passe', pressed: false, onClick: () => undefined }} />
              </div>
            ))}
          </Grid>
        </Block>
      </Section>

      <Section title="Textarea" note="Hauteur portée par rows — jamais de min-height. Redimensionnement vertical uniquement, sauf avec autoResize. Même règle de surface que l'Input. md par défaut ; sm = 40 sur une ligne.">
        <Block label="Repos, focus, erreur, désactivé">
          <Stack>
            <Textarea rows={3} placeholder="Décris ton idée d'app en deux phrases." />
            <Textarea rows={2} className="is-focus" defaultValue="Focus" />
            <Textarea rows={2} invalid defaultValue="Trop court" />
            <Textarea rows={2} disabled defaultValue="Indisponible" />
            <Textarea rows={2} surface="card" defaultValue="surface=card" />
          </Stack>
        </Block>
        <Block label="sm et agrandissement automatique" hint="size=sm : 40 sur une ligne — la barre de saisie du chat (règle 48 / 40). autoResize : le champ suit son contenu, de rows à maxRows lignes, puis défile ; en JavaScript, donc aussi sur Safari iOS. Le bouton d'envoi suit la barre : IconButton sm (40), aligné en bas. Écris plusieurs lignes, puis envoie : le champ revient à 40. Le premier îlot suit la vitrine, le second force le sombre.">
          <Grid cols={2}>
            {[false, true].map(dark => (
              <div key={String(dark)} className={`${dark ? 'dark ' : ''}flex flex-col gap-space-4 rounded-xl bg-background p-space-4`}>
                <span className="chip text-text-muted">{dark ? 'sombre, forcé' : 'thème courant'}</span>
                <BarreDeSaisie />
                <Textarea size="sm" surface="page" aria-label="Note courte" placeholder="sm sans autoResize — une ligne, 40" />
              </div>
            ))}
          </Grid>
        </Block>
      </Section>

      <Section title="Select" note="Select natif sur le rail 48, avec un chevron Lucide. placeholder pose une invite (« Jour ») en --text-muted tant que rien n'est choisi.">
        <Block label="Repos, focus, erreur, désactivé">
          <Stack>
            <Select options={SERIES} defaultValue="build" />
            <Select options={SERIES} className="is-focus" defaultValue="tuto" />
            <Select options={SERIES} invalid defaultValue="build" />
            <Select options={SERIES} disabled defaultValue="build" />
            <Select options={SERIES} surface="card" defaultValue="coulisses" />
          </Stack>
        </Block>
        <Block label="Invite — date de naissance" hint="Maquette AUTH 2d : trois Select côte à côte (grille 1 / 1.5 / 1.2), dans un FormField group — le groupe est nommé par le libellé, chaque Select par son aria-label, et l'erreur est citée par les trois. Mesuré sur un écran de 390 px (358 de contenu) : 92 / 139 / 111 px, « Jour », « septembre » et « Année » tiennent. La vitrine, elle, empile ses marges : sous 600 px de large, ces colonnes-ci sont plus étroites qu'à l'écran. Le premier îlot suit la vitrine, le second force le sombre.">
          <Grid cols={2}>
            <div className="flex flex-col gap-space-4 rounded-xl bg-background p-space-4">
              <span className="chip text-text-muted">thème courant</span>
              <DateNaissance id="naissance-clair" />
              <DateNaissance id="naissance-clair-err" error="Indique ta date de naissance." />
            </div>
            <div className="dark flex flex-col gap-space-4 rounded-xl bg-background p-space-4">
              <span className="chip text-text-muted">sombre, forcé</span>
              <DateNaissance id="naissance-sombre" />
              <DateNaissance id="naissance-sombre-err" error="Indique ta date de naissance." />
            </div>
          </Grid>
        </Block>
      </Section>

      <Section title="Checkbox, Radio, Switch" note="Case 1.25rem, radio 1.25rem à point 0.625rem, switch 2.75 × 1.75rem (44 × 28) à knob 1.25rem, inset 0.25rem.">
        <Grid cols={3}>
          <Block label="Checkbox">
            <Stack>
              <Checkbox label="Je veux recevoir le prompt du build" checked={checked} onChange={e => setChecked(e.target.checked)} />
              <Checkbox label="Non coché" defaultChecked={false} />
              <Checkbox label="Indéterminée — sélection partielle" indeterminate />
              <Checkbox label="Hover" className="is-hover" />
              <Checkbox label="Focus" className="is-focus" defaultChecked />
              <Checkbox label="Option indisponible" disabled />
              <Checkbox label="Cochée et désactivée" disabled defaultChecked />
            </Stack>
          </Block>
          <Block label="Radio" hint="Toujours dans un groupe nommé.">
            <Stack>
              <Radio name="niveau" value="debutant" label="Je débute" checked={niveau === 'debutant'} onChange={() => setNiveau('debutant')} />
              <Radio name="niveau" value="avance" label="Je code déjà" checked={niveau === 'avance'} onChange={() => setNiveau('avance')} />
              <Radio name="niveau-demo" value="hover" label="Hover" className="is-hover" />
              <Radio name="niveau-demo" value="focus" label="Focus" className="is-focus" defaultChecked />
              <Radio name="niveau-off" value="off" label="Indisponible" disabled />
            </Stack>
          </Block>
          <Block label="Switch" hint="Bascule instantanée — pas de bouton Enregistrer.">
            <Stack>
              <Switch label="Thème sombre" checked={sombre} onChange={e => setSombre(e.target.checked)} />
              <Switch label="Non activé" />
              <Switch label="Hover" className="is-hover" />
              <Switch label="Focus" className="is-focus" defaultChecked />
              <Switch label="Indisponible" disabled />
              <Switch label="Activé et indisponible" disabled defaultChecked />
            </Stack>
          </Block>
        </Grid>
        <Block label="Checkbox — erreur et libellé long" hint="Maquette AUTH 2d. error pose le message SOUS la case, aligné sur le texte du libellé ; la case reçoit aria-invalid et cite le message. Sur plusieurs lignes, la case reste en face de la PREMIÈRE ligne. Coche une case : son erreur disparaît. Le premier îlot suit la vitrine, le second force le sombre.">
          <Grid cols={2}>
            <div className="flex flex-col gap-space-3 rounded-xl bg-background p-space-4">
              <span className="chip text-text-muted">thème courant</span>
              <Consentements />
            </div>
            <div className="dark flex flex-col gap-space-3 rounded-xl bg-background p-space-4">
              <span className="chip text-text-muted">sombre, forcé</span>
              <Consentements />
            </div>
          </Grid>
        </Block>
      </Section>

      <Section title="Option" note="Parcours cœur. Une réponse d'onboarding, pill, qui enveloppe un .ds-choice — toute l'option est cliquable. Hauteur 48 et texte 15 dans les deux tailles ; md = écran à une question, sm = écran à plusieurs groupes (écart case-libellé et graisse plus serrés). Sélectionnée : bordure --primary, libellé en gras --foreground, case cochée — jamais la bordure seule. Classes seules, pas de composant.">
        <Grid cols={2}>
          <Block label="md — radio, une question" hint="Tu cherches plutôt… — posée sur la crème, comme dans l'onboarding.">
            <div className="flex flex-col gap-space-3 rounded-xl bg-background p-space-4">
              {INTENTIONS.map(o => (
                <label key={o.value} className="ds-option">
                  <span className="ds-choice">
                    <input type="radio" name="intention" value={o.value} checked={intention === o.value} onChange={() => setIntention(o.value)} />
                    {CASE_RADIO}
                  </span>
                  {o.label}
                </label>
              ))}
            </div>
          </Block>
          <Block label="sm — case, plusieurs groupes" hint="Tes moments pour discuter">
            <div className="flex flex-col gap-space-3 rounded-xl bg-background p-space-4">
              {MOMENTS.map(m => (
                <label key={m} className="ds-option ds-option--sm">
                  <span className="ds-choice">
                    <input type="checkbox" checked={moments.includes(m)} onChange={() => setMoments(basculer(moments, m))} />
                    {CASE_COCHE}
                  </span>
                  {m}
                </label>
              ))}
            </div>
          </Block>
        </Grid>
        <Block label="États forcés" hint="is-hover · is-selected (+ .ds-choice.is-checked) · is-focus · is-disabled — les aides de démo. En vrai, :has(input:checked), :has(input:focus-visible) et :has(input:disabled) posent les mêmes états.">
          <Grid cols={2}>
            <div className="flex flex-col gap-space-3 rounded-xl bg-background p-space-4">
              <span className="chip text-text-muted">md</span>
              <label className="ds-option"><span className="ds-choice"><input type="radio" name="option-repos" />{CASE_RADIO}</span>Repos</label>
              <label className="ds-option is-hover"><span className="ds-choice"><input type="radio" name="option-survol" />{CASE_RADIO}</span>Survol</label>
              <label className="ds-option is-selected"><span className="ds-choice is-checked"><input type="radio" name="option-choisie" />{CASE_RADIO}</span>Sélectionnée</label>
              <label className="ds-option is-focus"><span className="ds-choice"><input type="radio" name="option-focus" />{CASE_RADIO}</span>Focus</label>
              <label className="ds-option is-disabled"><span className="ds-choice"><input type="radio" name="option-off" disabled />{CASE_RADIO}</span>Indisponible</label>
            </div>
            <div className="flex flex-col gap-space-3 rounded-xl bg-background p-space-4">
              <span className="chip text-text-muted">sm</span>
              <label className="ds-option ds-option--sm"><span className="ds-choice"><input type="checkbox" />{CASE_COCHE}</span>Repos</label>
              <label className="ds-option ds-option--sm is-hover"><span className="ds-choice"><input type="checkbox" />{CASE_COCHE}</span>Survol</label>
              <label className="ds-option ds-option--sm is-selected"><span className="ds-choice is-checked"><input type="checkbox" />{CASE_COCHE}</span>Sélectionnée</label>
              <label className="ds-option ds-option--sm is-focus"><span className="ds-choice"><input type="checkbox" />{CASE_COCHE}</span>Focus</label>
              <label className="ds-option ds-option--sm is-disabled"><span className="ds-choice"><input type="checkbox" disabled />{CASE_COCHE}</span>Indisponible</label>
            </div>
          </Grid>
        </Block>
      </Section>

      <Section title="Chip" note="Parcours cœur. Deux modes, un seul rendu : BASCULE (aria-pressed, choix multiples) ou RADIO (role=radio + aria-checked dans un role=radiogroup, choix unique). Hauteur --chip-h : 40 à l'œil (la taille --control-sm), texte 15, 48 au doigt (zone de toucher ::before de --space-1 en haut et en bas ; au moins --space-2 entre deux rangées). Sélectionnée : plaque --accent, bordure --primary, libellé --primary-readable semibold. Libellé d'INTERFACE : jamais d'emoji — c'est le badge carte (Data display) qui en porte. Classe seule, pas de composant.">
        <Block label="Bascule — choix multiples" hint="Tes centres d'intérêt — clique pour basculer. aria-pressed, une tabulation par chip, Espace ou Entrée bascule.">
          <div className="flex flex-wrap items-center gap-space-2 rounded-xl bg-background p-space-4">
            {INTERETS.map(i => (
              <button key={i} type="button" className="ds-chip" aria-pressed={interets.includes(i)} onClick={() => setInterets(basculer(interets, i))}>{i}</button>
            ))}
          </div>
        </Block>
        <Block label="Radio — choix unique" hint="Ton rythme de conversation. role=radiogroup nommé, role=radio + aria-checked sur chaque chip (aria-pressed n'est pas valide sur un radio). Un seul arrêt de tabulation pour le groupe ; les flèches déplacent le focus et la sélection, en boucle. Le premier spécimen suit la vitrine, le second force le sombre.">
          <Grid cols={2}>
            <div className="flex flex-col gap-space-2 rounded-xl bg-background p-space-4">
              <span className="chip text-text-muted">thème courant</span>
              <ChipsRadio label="Ton rythme de conversation" />
            </div>
            <div className="dark flex flex-col gap-space-2 rounded-xl bg-background p-space-4">
              <span className="chip text-text-muted">sombre, forcé</span>
              <ChipsRadio label="Ton rythme de conversation (sombre)" />
            </div>
          </Grid>
        </Block>
        <Block label="États">
          <div className="flex flex-wrap items-center gap-space-2 rounded-xl bg-background p-space-4">
            <button type="button" className="ds-chip">Repos</button>
            <button type="button" className="ds-chip is-hover">Survol</button>
            <button type="button" className="ds-chip is-selected">Sélectionnée</button>
            <button type="button" className="ds-chip is-focus">Focus</button>
            <button type="button" className="ds-chip" disabled>Indisponible</button>
          </div>
        </Block>
      </Section>

      <Section title="Steps" note="Parcours cœur — la progression par étapes de l'onboarding. Le libellé porte l'information ; les points (aria-hidden) la redoublent : étape courante en capsule de dégradé, étapes faites en dégradé atténué, à venir en --border. Classes seules, pas de composant.">
        <Block label="2 sur 5, 5 sur 5">
          <Stack>
            <Etapes courante={2} total={5} />
            <Etapes courante={5} total={5} />
          </Stack>
        </Block>
        <Block label="Changement d'étape — le focus sur le titre" hint="« Étape suivante » place le focus sur le TITRE de l'étape (tabIndex -1), pour qu'un lecteur d'écran annonce le changement. Le titre n'affiche pas d'anneau — il n'est ni dans l'ordre de tabulation ni actionnable (base.css, v0.7.0) ; le bouton garde le sien. Essaie au clavier : Tab jusqu'au bouton, Entrée. Le premier îlot suit la vitrine, le second force le sombre.">
          <Grid cols={2}>
            {[false, true].map(dark => (
              <div key={String(dark)} className={`${dark ? 'dark ' : ''}flex flex-col gap-space-3 rounded-xl bg-background p-space-4`}>
                <span className="chip text-text-muted">{dark ? 'sombre, forcé' : 'thème courant'}</span>
                <ChangementEtape />
              </div>
            ))}
          </Grid>
        </Block>
      </Section>

      <Section title="RangeSlider" note="Le curseur de PLAGE — la tranche d'âge de l'onboarding. Deux poignées role=slider dans un groupe nommé par le libellé ; la portion choisie porte --brand-gradient en remplissage, sans lueur, sur un rail --border (--surface-alt en sombre). Poignée 24 à l'œil, 44 au doigt. Clavier : flèches, Page↑/↓, Début/Fin ; pointeur : glisser, ou cliquer la piste.">
        <Block label="Tranche d'âge" hint="Le premier spécimen suit la vitrine, le second force le sombre.">
          <Grid cols={2}>
            <div className="flex flex-col gap-space-3 rounded-xl bg-background p-space-4">
              <span className="chip text-text-muted">thème courant</span>
              <RangeSlider label="Tranche d'âge" min={25} max={65} value={age} onChange={setAge}
                formatValue={v => `${v} ans`} display={`${age[0]} – ${age[1]} ans`} bounds={['25 ans', '65 ans et +']} />
            </div>
            <div className="dark flex flex-col gap-space-3 rounded-xl bg-background p-space-4">
              <span className="chip text-text-muted">sombre, forcé</span>
              <RangeSlider label="Tranche d'âge" min={25} max={65} value={ageSombre} onChange={setAgeSombre}
                formatValue={v => `${v} ans`} display={`${ageSombre[0]} – ${ageSombre[1]} ans`} bounds={['25 ans', '65 ans et +']} />
            </div>
          </Grid>
        </Block>
        <Block label="onChangeEnd — enregistrer à la fin" hint="onChange suit chaque cran ; onChangeEnd n'est appelé qu'une fois l'interaction finie : poignée relâchée, touche relâchée (une flèche maintenue = des dizaines de crans, un appel), ou poignée quittée en pleine frappe — et jamais si la valeur n'a pas bougé. C'est lui qu'on branche sur le serveur. Le premier îlot suit la vitrine, le second force le sombre.">
          <Grid cols={2}>
            {[false, true].map(dark => (
              <div key={String(dark)} className={`${dark ? 'dark ' : ''}flex flex-col gap-space-3 rounded-xl bg-background p-space-4`}>
                <span className="chip text-text-muted">{dark ? 'sombre, forcé' : 'thème courant'}</span>
                <CurseurEnregistre />
              </div>
            ))}
          </Grid>
        </Block>
        <Block label="Désactivé, sans bornes" hint="disabled : opacité .5, poignées hors tabulation. bounds={false} retire la ligne des bornes.">
          <Stack>
            <RangeSlider label="Tranche d'âge" min={25} max={65} value={[40, 55]} formatValue={v => `${v} ans`} disabled />
            <RangeSlider label="Budget" min={0} max={200} step={10} value={[40, 120]} formatValue={v => `${v} €`} bounds={false} />
          </Stack>
        </Block>
      </Section>

      <Section title="DatePicker" note="Déclencheur façon Input (même règle de surface) + Calendar en popover. Clic extérieur ou Échap pour fermer. Date unique, pas de plage.">
        <Block label="Vide, rempli, surfaces, états">
          <Stack>
            <DatePicker value={date} onChange={setDate} />
            <DatePicker />
            <DatePicker surface="card" value={date} onChange={setDate} />
            <DatePicker invalid value={date} onChange={setDate} />
            <DatePicker disabled />
          </Stack>
        </Block>
        <Block label="Déclencheur composé" hint="trigger rend l'élément de l'app, qui ÉTALE triggerProps — le socle garde la ref (retour de focus sur Échap et sélection) et pose l'ARIA. Un élément qui reçoit ref : un <button> nu, pas un composant sans forwardRef.">
          <Stack>
            <DatePicker
              value={date}
              onChange={setDate}
              trigger={({ value, triggerProps }) => (
                <button type="button" className="ds-btn ds-btn--secondary" {...triggerProps}>
                  {value ? value.toLocaleDateString('fr-FR') : 'Choisir une date'}
                  <Icon name="calendar" />
                </button>
              )}
            />
          </Stack>
        </Block>
      </Section>

      <Section title="Calendar" note="Vue mois, lundi d'abord, locale fr-FR. Date natif et Intl uniquement — aucune dépendance.">
        <Grid cols={3}>
          <Block label="Par défaut">
            <Calendar value={date} onChange={setDate} />
          </Block>
          <Block label="Bornes et dates désactivées" hint="min, max et disabledDates.">
            <Calendar
              value={date}
              onChange={setDate}
              min={new Date(2026, 7, 1)}
              max={new Date(2026, 9, 31)}
              disabledDates={[new Date(2026, 8, 12), new Date(2026, 8, 13)]}
            />
          </Block>
          <Block label="Aujourd'hui" hint="Sans value, la vue s'ouvre sur le mois courant et le jour du jour est marqué (.is-today).">
            <Calendar />
          </Block>
        </Grid>
      </Section>

      <Section title="FormField" note="Une erreur porte toujours couleur + icône + texte. Avec une aide, les deux s'affichent : l'erreur d'abord, collée au champ, puis l'aide — le rappel de la règle. Les deux sont citées par le contrôle (aria-describedby), erreur en premier.">
        <Grid cols={2}>
          <Block label="Aide">
            <FormField label="Ton email" htmlFor="mail-help" help="Un build décortiqué par semaine. Zéro spam.">
              <Input id="mail-help" placeholder="ton@email.com" />
            </FormField>
          </Block>
          <Block label="Erreur">
            <FormField label="Ton email" htmlFor="mail-err" error="Ça a planté, on réessaie ?">
              <Input id="mail-err" invalid defaultValue="pas-un-email" />
            </FormField>
          </Block>
          <Block label="Obligatoire">
            <FormField label="Ton prénom" htmlFor="prenom" required help="Utilisé uniquement dans l'email.">
              <Input id="prenom" placeholder={IDENTITY.prenom} />
            </FormField>
          </Block>
          <Block label="Composé">
            <FormField label="Ta série" htmlFor="serie" help="Tu peux changer d'avis à tout moment.">
              <Select id="serie" options={SERIES} defaultValue="build" />
            </FormField>
          </Block>
        </Grid>
        <Block label="Erreur et aide, ensemble" hint="Maquette AUTH 5a : l'erreur dit ce qui ne va pas, l'aide redit la règle. Le premier îlot suit la vitrine, le second force le sombre.">
          <Grid cols={2}>
            <div className="flex flex-col gap-space-4 rounded-xl bg-background p-space-4">
              <span className="chip text-text-muted">thème courant</span>
              <MotDePasse id="nouveau-clair" label="Nouveau mot de passe" defaultValue="voilier"
                error="Mot de passe trop faible : ajoute une majuscule et un chiffre."
                help="8 caractères minimum, avec une majuscule, une minuscule et un chiffre." />
            </div>
            <div className="dark flex flex-col gap-space-4 rounded-xl bg-background p-space-4">
              <span className="chip text-text-muted">sombre, forcé</span>
              <MotDePasse id="nouveau-sombre" label="Nouveau mot de passe" defaultValue="voilier"
                error="Mot de passe trop faible : ajoute une majuscule et un chiffre."
                help="8 caractères minimum, avec une majuscule, une minuscule et un chiffre." />
            </div>
          </Grid>
        </Block>
        <Block label="Un lien dans un message" hint="Le lien du système (--primary-readable) et le texte d'erreur mesurent 1,01:1 en sombre, 1,03:1 en clair : seule une nuance de teinte les sépare. Dans .ds-error et .ds-help, le lien prend la couleur du message et se reconnaît à son SOULIGNEMENT et sa graisse (WCAG 1.4.1). Le premier îlot suit la vitrine, le second force le sombre.">
          <Grid cols={2}>
            {[false, true].map(dark => (
              <div key={String(dark)} className={`${dark ? 'dark ' : ''}flex flex-col gap-space-4 rounded-xl bg-background p-space-4`}>
                <span className="chip text-text-muted">{dark ? 'sombre, forcé' : 'thème courant'}</span>
                <FormField label="E-mail" htmlFor={dark ? 'mail-lien-sombre' : 'mail-lien-clair'}
                  error={<>Cet e-mail a déjà un compte. <a href="#forms">Me connecter</a></>}
                  help={<>Tu pourras le changer dans <a href="#forms">tes réglages</a>.</>}>
                  <Input id={dark ? 'mail-lien-sombre' : 'mail-lien-clair'} surface="page" invalid defaultValue="marc.durand@gmail.com" />
                </FormField>
              </div>
            ))}
          </Grid>
        </Block>
        <Row label="rail partagé — bouton md, input et select s'alignent à 48">
          <Input placeholder="ton@email.com" />
          <Select options={SERIES} defaultValue="build" />
        </Row>
      </Section>
    </div>
  );
}
