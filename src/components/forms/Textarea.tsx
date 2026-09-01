import { forwardRef } from 'react';
import type { JSX, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/** Multi-line field. Auto height (no min-height), vertical resize only. Radius --radius-lg,
 *  the documented exception to the rounded doctrine: a pill would bend its first and last line.
 *  `forwardRef` : la ref atteint le <textarea> natif (react-hook-form, focus programmatique). */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  rows?: number;
  /**
   * La surface porteuse — l'échappatoire à la DÉDUCTION de patterns.css, jumelle exacte
   * du `surface` de Button. `auto` (défaut) laisse la déduction décider : blanc (--card)
   * sur la mise en page, crème (--background) dans une carte, une modale, une feuille,
   * un popover ou la navbar. `page` force le BLANC là où la déduction aurait mis du crème
   * (un îlot crème posé dans une carte) ; `card` force le crème hors d'une vraie .ds-card,
   * pour un conteneur qui n'en a que l'apparence.
   */
  surface?: 'auto' | 'page' | 'card';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
  invalid = false, rows = 4, surface = 'auto', className = '', ...rest
}: TextareaProps, ref): JSX.Element {
  const cls = cn('ds-input', 'ds-textarea', surface === 'card' && 'ds-input--on-card', surface === 'page' && 'ds-input--on-page', invalid && 'is-error', className);
  return <textarea ref={ref} className={cls} rows={rows} aria-invalid={invalid || undefined} {...rest} />;
});
Textarea.displayName = 'Textarea';
