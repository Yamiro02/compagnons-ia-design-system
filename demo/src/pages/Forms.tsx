import { useRef, useState, type KeyboardEvent } from 'react';
import { IDENTITY } from '../identity';
import { Calendar, Checkbox, DatePicker, FormField, Icon, Input, Radio, Select, Switch, Textarea } from '@compagnons-ia/ds';
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

export function FormsPage() {
  const [checked, setChecked] = useState(true);
  const [niveau, setNiveau] = useState('debutant');
  const [sombre, setSombre] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 8, 24));
  const [intention, setIntention] = useState('serieux');
  const [moments, setMoments] = useState<string[]>(['En soirée']);
  const [interets, setInterets] = useState<string[]>(['Jazz', 'Voyages']);
  const basculer = (liste: string[], valeur: string) =>
    liste.includes(valeur) ? liste.filter(v => v !== valeur) : [...liste, valeur];

  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Input" note="Rail de contrôle partagé, bordure 1.5px. Le focus se lit sur la bordure seule, qui passe en --ring — jamais d'anneau en plus. PILL et BLANC : doctrine arrondie + « le blanc est la surface portée ».">
        <Block label="Tailles">
          <Stack>
            <Input size="sm" placeholder="Petite — 2.375rem" />
            <Input size="md" placeholder="ton@email.com" />
            <Input size="lg" placeholder="Grande — 3.25rem" />
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
        <Block label="Icône" hint="icon pose un glyphe DANS le champ, à gauche — un repère, pas un bouton : il est aria-hidden et ne se clique pas. Une action dans un champ est un IconButton posé à côté. Combinable avec unit.">
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
      </Section>

      <Section title="Textarea" note="Hauteur automatique — jamais de min-height. Redimensionnement vertical uniquement. Même règle de surface que l'Input.">
        <Block label="Repos, focus, erreur, désactivé">
          <Stack>
            <Textarea rows={3} placeholder="Décris ton idée d'app en deux phrases." />
            <Textarea rows={2} className="is-focus" defaultValue="Focus" />
            <Textarea rows={2} invalid defaultValue="Trop court" />
            <Textarea rows={2} disabled defaultValue="Indisponible" />
            <Textarea rows={2} surface="card" defaultValue="surface=card" />
          </Stack>
        </Block>
      </Section>

      <Section title="Select" note="Select natif sur le rail 3rem, avec un chevron Lucide.">
        <Block label="Repos, focus, erreur, désactivé">
          <Stack>
            <Select options={SERIES} defaultValue="build" />
            <Select options={SERIES} className="is-focus" defaultValue="tuto" />
            <Select options={SERIES} invalid defaultValue="build" />
            <Select options={SERIES} disabled defaultValue="build" />
            <Select options={SERIES} surface="card" defaultValue="coulisses" />
          </Stack>
        </Block>
      </Section>

      <Section title="Checkbox, Radio, Switch" note="Case 1.25rem, radio 1.25rem à point 0.625rem, switch 2.75 × 1.625rem à knob 1.25rem.">
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
      </Section>

      <Section title="Option" note="Parcours cœur. Une réponse d'onboarding, pill, qui enveloppe un .ds-choice — toute l'option est cliquable. md = écran à une question, sm = écran à plusieurs groupes. Sélectionnée : bordure --primary, libellé en gras --foreground, case cochée — jamais la bordure seule. Classes seules, pas de composant.">
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

      <Section title="Chip" note="Parcours cœur. Deux modes, un seul rendu : BASCULE (aria-pressed, choix multiples) ou RADIO (role=radio + aria-checked dans un role=radiogroup, choix unique). Hauteur --chip-h : 36 à l'œil, 44 au doigt (zone de toucher ::before de --space-1 en haut et en bas ; au moins --space-2 entre deux rangées). Sélectionnée : plaque --accent, bordure --primary, libellé --primary-readable semibold. Libellé d'INTERFACE : jamais d'emoji — c'est le badge carte (Data display) qui en porte. Classe seule, pas de composant.">
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

      <Section title="FormField" note="Une erreur remplace le texte d'aide et porte toujours couleur + icône + texte.">
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
        <Row label="rail partagé — bouton md, input et select s'alignent à 3rem">
          <Input placeholder="ton@email.com" />
          <Select options={SERIES} defaultValue="build" />
        </Row>
      </Section>
    </div>
  );
}
