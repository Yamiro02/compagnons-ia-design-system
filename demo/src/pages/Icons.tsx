import { Icon, type IconName } from '@compagnons-ia/ds';
import { Block, Section, Spec } from '../ui';

const NAMES: IconName[] = [
  'check', 'x', 'chevron-down', 'chevron-right', 'chevron-left', 'arrow-right',
  'arrow-up-right', 'arrow-down', 'play', 'eye', 'eye-off', 'clock', 'calendar', 'copy',
  'search', 'menu', 'mail', 'triangle-alert', 'info', 'circle-check',
  'circle-alert', 'circle-x', 'terminal', 'code', 'zap', 'plus', 'minus', 'trash-2',
  'external-link', 'loader-circle', 'github', 'folder',
  'trending-up', 'user', 'book-open', 'message-square', 'quote', 'rocket', 'file-text',
  'chevrons-left', 'chevrons-right', 'ellipsis', 'panel-left', 'sliders-horizontal',
  'layout-dashboard', 'house', 'video', 'dumbbell', 'settings', 'log-out',
];

export function IconsPage() {
  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Icônes" note="Lucide, exclusivement. Aucun emoji dans l'interface, aucun caractère unicode décoratif — sauf le point médian. (Le contenu des personas, lui, peut porter des emoji.)">
        <Block label="Tailles" hint="1rem · 1.125rem (contrôle md, TabBar) · 1.25rem (défaut) · 1.5rem. Toujours en rem, jamais en px.">
          <Spec token="size=&quot;1rem&quot;"><Icon name="circle-check" size="1rem" /></Spec>
          <Spec token="size=&quot;1.125rem&quot; (contrôle md, TabBar)"><Icon name="circle-check" size="1.125rem" /></Spec>
          <Spec token="size=&quot;1.25rem&quot; (défaut)"><Icon name="circle-check" size="1.25rem" /></Spec>
          <Spec token="size=&quot;1.5rem&quot;"><Icon name="circle-check" size="1.5rem" /></Spec>
        </Block>

        <Block label="Graisses" hint="C'est la RÈGLE CSS qui décide, pas la prop : 1.75 partout, 1.5 dans une tuile (badge, toast, bandeau, pastille, erreur), 2.5 dans une case à cocher. strokeWidth n'écrit qu'un attribut de présentation, que la règle recouvre — pour forcer, c'est un style inline.">
          <Spec token="défaut — la règle rend 1.75"><Icon name="check" size="1.5rem" /></Spec>
          <Spec token="dans une tuile — 1.5"><span className="ds-pastille ds-pastille--dialogue ds-pastille--brand"><Icon name="check" size="1.5rem" /></span></Spec>
          <Spec token="forcé en inline — 3"><Icon name="check" size="1.5rem" style={{ strokeWidth: 3 }} /></Spec>
        </Block>

        <Block label="Couleur" hint="currentColor — --foreground par défaut, --primary seulement pour une icône active ou un CTA.">
          <div className="flex flex-wrap items-center gap-space-5">
            <Icon name="zap" size="1.5rem" />
            <Icon name="zap" size="1.5rem" style={{ color: 'var(--primary)' }} />
            <Icon name="zap" size="1.5rem" style={{ color: 'var(--text-muted)' }} />
            <Icon name="zap" size="1.5rem" style={{ color: 'var(--destructive)' }} />
          </div>
        </Block>

        <Block label="Jeu complet" hint={`${NAMES.length} icônes disponibles.`}>
          <div className="grid grid-cols-2 gap-space-3 sm:grid-cols-4 lg:grid-cols-6">
            {NAMES.map(name => (
              <div key={name} className="flex flex-col items-center gap-space-2 rounded-md border border-border bg-card p-space-3">
                <Icon name={name} size="1.25rem" />
                <span className="mono text-caption text-text-muted w-full truncate text-center">{name}</span>
              </div>
            ))}
          </div>
        </Block>
      </Section>
    </div>
  );
}
