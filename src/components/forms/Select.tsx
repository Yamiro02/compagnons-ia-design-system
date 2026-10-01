import { forwardRef } from 'react';
import type { JSX, SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';
import { useFieldDescribedBy } from './field-context';

/** Native select on the shared control rail, with a Lucide chevron.
 *  `forwardRef` : la ref atteint le <select> natif (react-hook-form, focus programmatique). */
export interface SelectOption { value: string; label: string }

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options?: SelectOption[];
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
   * L'INVITE — « Jour », « Mois », « Année » (v0.5.0). Une option vide et désactivée en tête,
   * affichée en --text-muted tant que rien n'est choisi ; les vraies options restent en
   * --foreground. Sans `value` ni `defaultValue`, l'invite est sélectionnée d'office —
   * sinon le navigateur afficherait la première vraie option. Désactivée : une fois un
   * choix fait, on ne revient pas à « rien ».
   */
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({
  options = [], invalid = false, surface = 'auto', placeholder, className = '',
  'aria-describedby': ariaDescribedBy, ...rest
}: SelectProps, ref): JSX.Element {
  /* Les messages du FormField parent (erreur, puis aide) — v0.5.0. */
  const describedBy = useFieldDescribedBy(undefined, ariaDescribedBy);
  const invite = placeholder !== undefined;
  const surInvite = invite && rest.value === undefined && rest.defaultValue === undefined ? { defaultValue: '' } : {};
  return (
    <span className={cn('ds-select', invite && 'ds-select--placeholder')}>
      <select
        ref={ref}
        className={cn('ds-input', surface === 'card' && 'ds-input--on-card', surface === 'page' && 'ds-input--on-page', invalid && 'is-error', className)}
        aria-invalid={invalid || undefined}
        {...surInvite}
        {...rest}
        aria-describedby={describedBy}
      >
        {invite ? <option value="" disabled>{placeholder}</option> : null}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {/* Sans taille : le créneau du déclencheur rend 1rem (patterns.css, v0.3.0). */}
      <Icon name="chevron-down" className="ds-select__chev" />
    </span>
  );
});
Select.displayName = 'Select';
