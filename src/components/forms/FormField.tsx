import { useId } from 'react';
import type { JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';
import { FieldContext } from './field-context';

/**
 * Label + control + error + help wrapper. An error is always colour + icon + text — never
 * colour alone.
 *
 * ERREUR ET AIDE, ENSEMBLE — v0.5.0. Quand les deux sont fournies, l'erreur vient d'abord,
 * collée au champ qu'elle qualifie : c'est l'information NOUVELLE, elle se lit en premier.
 * L'aide suit, à sa place habituelle : c'est le RAPPEL stable de la règle (« 8 caractères
 * minimum… »), qui dit comment corriger. Avant la v0.5.0 l'erreur REMPLAÇAIT l'aide — et
 * l'utilisateur perdait la règle au moment exact où il en avait besoin.
 *
 * LES MESSAGES SONT RELIÉS AU CONTRÔLE — v0.5.0. Leurs ids (`${htmlFor}-error`,
 * `${htmlFor}-help`, ou générés sans `htmlFor`) passent au contrôle par contexte : Input,
 * Textarea, Select, DatePicker, Checkbox et RangeSlider les posent dans leur
 * aria-describedby, erreur d'abord.
 */
export interface FormFieldProps {
  label?: ReactNode;
  htmlFor?: string;
  help?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /**
   * Un GROUPE de contrôles sous un seul libellé — la date en trois Select, une liste de
   * cases (v0.5.0). La racine devient `role="group"` nommé par le libellé (un `<span>`,
   * plus un `<label>` : il ne vise aucun contrôle unique). Chaque contrôle du groupe reçoit
   * l'erreur et l'aide dans son aria-describedby, et porte son propre nom (`aria-label`).
   */
  group?: boolean;
  className?: string;
  children?: ReactNode;
}

export function FormField({
  label, htmlFor, help, error, required = false, group = false, className = '', children,
}: FormFieldProps): JSX.Element {
  const auto = useId();
  const base = htmlFor ?? auto;
  const errorId = error ? `${base}-error` : undefined;
  const helpId = help ? `${base}-help` : undefined;
  const labelId = `${base}-label`;
  const describedBy = [errorId, helpId].filter(Boolean).join(' ') || undefined;
  const texte = label ? <>{label}{required ? <span className="ds-label__required"> *</span> : null}</> : null;
  return (
    <div
      className={cn('ds-field', className)}
      role={group ? 'group' : undefined}
      aria-labelledby={group && label ? labelId : undefined}
    >
      {label ? (group
        ? <span id={labelId} className="ds-label">{texte}</span>
        : <label className="ds-label" htmlFor={htmlFor}>{texte}</label>
      ) : null}
      <FieldContext.Provider value={{ describedBy }}>{children}</FieldContext.Provider>
      {/* L'icône d'erreur est SANS taille : le créneau .ds-error svg rend 0.875rem. */}
      {error ? (
        <span id={errorId} className="ds-error"><Icon name="circle-alert" strokeWidth={2.5} />{error}</span>
      ) : null}
      {help ? <span id={helpId} className="ds-help">{help}</span> : null}
    </div>
  );
}
