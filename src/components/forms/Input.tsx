import { forwardRef, useEffect } from 'react';
import type { InputHTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useFieldDescribedBy } from './field-context';

declare const process: { env: { NODE_ENV?: string } };

/** L'action d'un champ — UNE, et qui n'agit que sur la valeur du champ lui-même
 *  (afficher / masquer un mot de passe, effacer). v0.5.0. */
export interface InputAction {
  /** Un `<Icon>` nu : le créneau rend 1.25rem, en --text-muted. */
  icon: ReactNode;
  /** Nom accessible du bouton (aria-label ET title). Obligatoire : le bouton n'a que son icône. */
  label: string;
  onClick: () => void;
  /** Passé, le bouton devient une BASCULE (aria-pressed) — l'œil du mot de passe. */
  pressed?: boolean;
}

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
  /**
   * Un glyphe posé DANS le champ, à gauche — la loupe d'une recherche, l'enveloppe d'un
   * e-mail. Passez un `<Icon>` nu : l'enveloppe, la position et le créneau (1rem) lui sont
   * posés ici. Il est `aria-hidden` et ne se clique pas : c'est un repère, pas un bouton —
   * une action DANS un champ passe par `action`, jamais par ce slot.
   * Combinable avec `unit` et avec `action` : les enveloppes s'imbriquent, le champ reçoit
   * ses deux paddings.
   */
  icon?: ReactNode;
  /**
   * Un BOUTON DANS LE CHAMP, à droite (v0.5.0) — distinct de `unit`, qui reste un repère
   * aria-hidden. Un vrai `<button type="button">` : il ne soumet jamais le formulaire, il a
   * son nom (`label`), son focus, et `aria-pressed` quand `pressed` est passé. 40 dans un
   * champ md, 32 dans un champ sm, 44 au doigt dans les deux ; la hauteur du champ ne bouge
   * pas. Désactivé avec le champ.
   * LA DOCTRINE : une action DANS un champ n'agit que sur la valeur du champ lui-même —
   * afficher / masquer, effacer. Tout le reste (envoyer, rechercher, copier ailleurs) est un
   * `IconButton` posé À CÔTÉ. `unit` et `action` occupent la même place : passés ensemble,
   * `action` l'emporte (avertissement en développement).
   */
  action?: InputAction;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  size = 'md', invalid = false, surface = 'auto', unit, icon, action, className = '',
  'aria-describedby': ariaDescribedBy, ...rest
}: InputProps, ref): JSX.Element {
  /* Les messages du FormField parent (erreur, puis aide) — v0.5.0. */
  const describedBy = useFieldDescribedBy(undefined, ariaDescribedBy);
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (unit && action) {
      console.warn('[ds] Input: `unit` et `action` occupent la même place, à droite du champ — '
        + '`action` est rendu, `unit` est ignoré. Une unité se dit alors dans le libellé.');
    }
  }, [unit, action]);
  /* La déduction de patterns.css couvre le cas normal : un champ dans une Card, une Modal,
     une ActionSheet, un Dropdown, le pop d'un DatePicker ou la Navbar passe en --background
     tout seul. `surface` n'est là que pour les conteneurs qu'elle ne connaît pas. */
  /* Le rail passe par des classes, jamais par un style inline : sm 40, md 48, lg 52
     (site vitrine uniquement) — v0.4.0, --control-sm est redevenu une vraie taille. */
  const cls = cn(
    'ds-input',
    size !== 'md' && 'ds-input--' + size,
    surface === 'card' && 'ds-input--on-card',
    surface === 'page' && 'ds-input--on-page',
    invalid && 'is-error',
    className,
  );
  const nu = <input ref={ref} className={cls} aria-invalid={invalid || undefined} {...rest} aria-describedby={describedBy} />;
  /* Les enveloppes n'existent QUE si leur prop est passée : sans elles, le DOM d'hier — un
     <input> nu — ne bouge pas d'un nœud. Elles s'imbriquent dans cet ordre, l'icône à
     l'extérieur, pour que le champ reçoive ses deux paddings sans que l'une décale l'autre. */
  const droite = action ? (
    <span className="ds-input-action">
      {nu}
      <button
        type="button"
        className="ds-input-action__btn"
        aria-label={action.label}
        title={action.label}
        aria-pressed={action.pressed}
        disabled={rest.disabled}
        onClick={action.onClick}
      >
        {action.icon}
      </button>
    </span>
  ) : unit ? (
    <span className="ds-input-unit">
      {nu}
      <span className="ds-input-unit__label" aria-hidden="true">{unit}</span>
    </span>
  ) : nu;
  if (!icon) return droite;
  return (
    <span className="ds-input-icon">
      {droite}
      <span className="ds-input-icon__glyph" aria-hidden="true">{icon}</span>
    </span>
  );
});
Input.displayName = 'Input';
