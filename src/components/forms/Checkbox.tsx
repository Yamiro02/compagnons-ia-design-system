import { forwardRef, useEffect, useId, useRef } from 'react';
import type { InputHTMLAttributes, JSX, ReactNode, Ref } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';
import { useFieldDescribedBy } from './field-context';

/** Checkbox with a Lucide check (stroke-width 3). Box radius = half of --radius-sm.
 *  `forwardRef` : la ref atteint l'<input type="checkbox"> natif (react-hook-form).
 *  `indeterminate` : l'état « à moitié coché » d'une case d'en-tête de sélection multiple.
 *  C'est une PROPRIÉTÉ DOM, pas un attribut — elle se pose via une ref, composée avec la
 *  ref externe. Rendu : un trait (minus) à la place de la coche, aria-checked="mixed". */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  indeterminate?: boolean;
  /**
   * Le message d'erreur de la case (v0.5.0) — « Coche cette case pour continuer. » Rendu en
   * .ds-error SOUS la case, aligné sur le texte du libellé ; la case reçoit aria-invalid et
   * cite le message dans son aria-describedby. Sans `error`, le DOM ne change pas.
   */
  error?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({
  label, checked, defaultChecked, indeterminate = false, disabled = false, error, className = '',
  'aria-describedby': ariaDescribedBy, ...rest
}: CheckboxProps, refExterne: Ref<HTMLInputElement>): JSX.Element {
  const errorId = `${useId()}-error`;
  /* Son propre message d'abord, puis celui du FormField parent, puis celui de l'appelant. */
  const describedBy = useFieldDescribedBy(error ? errorId : undefined, ariaDescribedBy);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const poserRefs = (node: HTMLInputElement | null): void => {
    inputRef.current = node;
    if (node) node.indeterminate = indeterminate;
    if (typeof refExterne === 'function') refExterne(node);
    else if (refExterne) (refExterne as { current: HTMLInputElement | null }).current = node;
  };
  const choix = (
    <label className={cn('ds-choice', indeterminate && 'is-indeterminate', disabled && 'is-disabled', className)}>
      <input
        ref={poserRefs}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : undefined}
        aria-invalid={error ? true : undefined}
        {...rest}
        aria-describedby={describedBy}
      />
      <span className="ds-choice__box">
        {/* Sans taille : le créneau .ds-choice__box svg rend 0.8125rem (patterns.css). */}
        <Icon name={indeterminate ? 'minus' : 'check'} strokeWidth={3} />
      </span>
      {/* .ds-choice__label : la case s'aligne sur la PREMIÈRE ligne d'un libellé long. */}
      {label ? <span className="ds-choice__label">{label}</span> : null}
    </label>
  );
  if (!error) return choix;
  return (
    <span className="ds-choice-field">
      {choix}
      <span id={errorId} className="ds-error ds-choice__error"><Icon name="circle-alert" strokeWidth={2.5} />{error}</span>
    </span>
  );
});
Checkbox.displayName = 'Checkbox';
