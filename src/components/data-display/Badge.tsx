import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

/**
 * Small pill label. Semantic tones always carry an icon + text, never colour alone.
 * The pill radius is legal here (badges, counters, tabs) — never on a button or input.
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'coral' | 'amber' | 'danger' | 'warning' | 'success' | 'neutral' | 'accent' | 'outline';
  /**
   * Height rail, multiples de 4. md = --badge-h (1.75rem, 28) · dense = --badge-h-dense
   * (1.5rem, 24), the height that lines up with a status pill on the same row · lg = 2rem
   * (32), texte 14 — l'étiquette d'intérêt d'une fiche persona (v0.4.0). Icons: 0.8125rem
   * in md and lg, 0.75rem in dense.
   */
  pad?: 'md' | 'dense' | 'lg';
  icon?: ReactNode;
  children?: ReactNode;
}

const badge = cva('ds-badge', {
  variants: {
    tone: {
      coral: 'ds-badge--coral',
      amber: 'ds-badge--amber',
      danger: 'ds-badge--danger',
      warning: 'ds-badge--warning',
      success: 'ds-badge--success',
      neutral: 'ds-badge--neutral',
      accent: 'ds-badge--accent',
      outline: 'ds-badge--outline',
    },
    pad: { md: '', dense: 'ds-badge--dense', lg: 'ds-badge--lg' },
  },
  defaultVariants: { tone: 'neutral', pad: 'md' },
});

export function Badge({ tone = 'neutral', pad = 'md', icon, className = '', children, ...rest }: BadgeProps): JSX.Element {
  return (
    <span className={[badge({ tone, pad }), className].filter(Boolean).join(' ')} {...rest}>
      {icon}{children}
    </span>
  );
}
