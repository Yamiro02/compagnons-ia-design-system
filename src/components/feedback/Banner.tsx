import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { Icon, type IconName } from '../icons/Icon';

/** Inline, persistent message inside a page or a card. Always colour + icon + text. */
export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: 'danger' | 'warning' | 'success' | 'info';
  title?: ReactNode;
  action?: ReactNode;
  /**
   * Où se pose l'action. `end` (défaut) : à droite du texte, sur la même ligne — le
   * comportement de toujours, et rien ne bouge pour les appels existants. `below` : sous le
   * texte, aligné à gauche, pour une action dont le libellé est long ou sur un écran
   * étroit, où le bouton de droite écrase la colonne de texte.
   */
  actionPlacement?: 'end' | 'below';
  /**
   * Le glyphe, quand celui du TON ne convient pas. Omis, le bandeau garde le sien
   * (triangle, coche, info). Passez un `<Icon>` nu : la classe et la taille lui sont
   * posées ici.
   */
  icon?: ReactNode;
  children?: ReactNode;
}

const BANNER_ICONS: Record<string, IconName> = {
  danger: 'triangle-alert', warning: 'triangle-alert', success: 'circle-check', info: 'info',
};

const banner = cva('ds-banner', {
  variants: {
    tone: {
      danger: 'ds-banner--danger',
      warning: 'ds-banner--warning',
      success: 'ds-banner--success',
      info: 'ds-banner--info',
    },
  },
  defaultVariants: { tone: 'info' },
});

export function Banner({
  tone = 'info', title, children, action, actionPlacement = 'end', icon, className = '', ...rest
}: BannerProps): JSX.Element {
  /* Le glyphe de l'appelant passe par la MÊME enveloppe que celui du ton : il hérite de
     `.ds-banner__icon`, donc de l'alignement et du créneau, sans que le site d'appel ait
     à connaître la classe. */
  const glyphe = icon
    ? <span className="ds-banner__icon">{icon}</span>
    : <Icon name={BANNER_ICONS[tone]} size="1.125rem" strokeWidth={2} className="ds-banner__icon" />;
  const dessous = actionPlacement === 'below';
  return (
    <div className={[banner({ tone }), className].filter(Boolean).join(' ')} role="note" {...rest}>
      {glyphe}
      <div className="ds-banner__main">
        {title ? <span className="ds-banner__title">{title}</span> : null}
        {children ? <span className="ds-banner__text">{children}</span> : null}
        {dessous && action ? <span className="ds-banner__action">{action}</span> : null}
      </div>
      {dessous ? null : action}
    </div>
  );
}
