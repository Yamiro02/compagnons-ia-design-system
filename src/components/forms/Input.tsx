import { forwardRef } from 'react';
import type { InputHTMLAttributes, JSX } from 'react';
import { cn } from '../../lib/cn';

/**
 * Single-line text field on the shared control rail, aligned with Button and the Select trigger.
 * Focus = the border turns --ring — ONE border, never an extra ring. PILL, since the project's
 * rounded doctrine: what gets pressed or filled is pill (patterns.css).
 * `forwardRef` : la ref atteint l'<input> natif — c'est ce qui rend le champ utilisable
 * avec une bibliothèque de formulaires (register() de react-hook-form pose une ref).
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  /** Red border + 3px destructive ring. Always pair with an error message. */
  invalid?: boolean;
  /**
   * La surface porteuse — l'échappatoire à la DÉDUCTION de patterns.css, jumelle exacte
   * du `surface` de Button. `auto` (défaut) laisse la déduction décider : blanc (--card)
   * sur la mise en page, crème (--background) dans une carte, une modale, une feuille,
   * un popover ou la navbar. `page` force le BLANC là où la déduction aurait mis du crème
   * (un îlot crème posé dans une carte) ; `card` force le crème hors d'une vraie .ds-card,
   * pour un conteneur qui n'en a que l'apparence.
   */
  surface?: 'auto' | 'page' | 'card';
  /**
   * L'unité du champ — « kg », « € », « min » — posée DANS le champ, à droite, en
   * sourdine (v0.3.0). Trois caractères au plus : le
   * padding réservé est fixe (--space-7) ; plus long, c'est un suffixe de libellé, pas
   * une unité. `aria-hidden` : c'est au libellé du FormField de la nommer.
   */
  unit?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  size = 'md', invalid = false, surface = 'auto', unit, className = '', ...rest
}: InputProps, ref): JSX.Element {
  /* La déduction de patterns.css couvre le cas normal : un champ dans une Card, une Modal,
     une ActionSheet, un Dropdown, le pop d'un DatePicker ou la Navbar passe en --background
     tout seul. `surface` n'est là que pour les conteneurs qu'elle ne connaît pas. */
  /* Le rail passe par des classes, jamais par un style inline : `--control-sm`
     aliase `--control-md` depuis le rail unique, mais la classe reste pour l'API
     et pour le jour où le rail redivergerait. */
  const cls = cn(
    'ds-input',
    size !== 'md' && 'ds-input--' + size,
    surface === 'card' && 'ds-input--on-card',
    surface === 'page' && 'ds-input--on-page',
    invalid && 'is-error',
    className,
  );
  const champ = <input ref={ref} className={cls} aria-invalid={invalid || undefined} {...rest} />;
  if (!unit) return champ;
  /* L'enveloppe n'existe QUE si `unit` est passé : sans elle, le DOM d'hier — un <input>
     nu — ne bouge pas d'un nœud. */
  return (
    <span className="ds-input-unit">
      {champ}
      <span className="ds-input-unit__label" aria-hidden="true">{unit}</span>
    </span>
  );
});
Input.displayName = 'Input';
