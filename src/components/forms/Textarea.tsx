import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import type { JSX, Ref, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { useFieldDescribedBy } from './field-context';

/** Multi-line field. Auto height (no min-height), vertical resize only. Radius --radius-lg,
 *  the documented exception to the rounded doctrine: a pill would bend its first and last line.
 *  `forwardRef` : la ref atteint le <textarea> natif (react-hook-form, focus programmatique). */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  /** Lignes visibles — le plancher. Défaut 4 en `md`, 1 en `sm`. */
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
  /**
   * `sm` (v0.6.0) — la barre de saisie du chat : **40 sur une ligne**, la taille
   * `--control-sm` de la règle 48 / 40, alignée sur un `IconButton size="sm"`. `rows`
   * vaut alors 1 par défaut. `md` (défaut) : le rendu d'avant, inchangé.
   */
  size?: 'sm' | 'md';
  /**
   * Le champ suit son contenu (v0.6.0) — de `rows` lignes à `maxRows`, puis il défile.
   * En JavaScript, pas en `field-sizing: content` : Safari iOS ne le prend pas en charge.
   * La poignée de redimensionnement est retirée — c'est le contenu qui décide.
   */
  autoResize?: boolean;
  /** Le plafond de lignes d'un champ `autoResize`. Sans lui, le champ grandit sans limite. */
  maxRows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
  invalid = false, rows, surface = 'auto', size = 'md', autoResize = false, maxRows,
  className = '', onInput, 'aria-describedby': ariaDescribedBy, ...rest
}: TextareaProps, refExterne: Ref<HTMLTextAreaElement>): JSX.Element {
  /* Les messages du FormField parent (erreur, puis aide) — v0.5.0. */
  const describedBy = useFieldDescribedBy(undefined, ariaDescribedBy);
  const interne = useRef<HTMLTextAreaElement | null>(null);
  const poserRefs = (node: HTMLTextAreaElement | null): void => {
    interne.current = node;
    if (typeof refExterne === 'function') refExterne(node);
    else if (refExterne) (refExterne as { current: HTMLTextAreaElement | null }).current = node;
  };

  /* LA HAUTEUR SUIT LE CONTENU. On remet le champ à sa hauteur naturelle (celle de `rows`,
     le plancher), on lit ce que le contenu demande (scrollHeight, padding compris, bordure
     non), on plafonne à `maxRows` lignes, et on ne laisse défiler que passé le plafond. La
     hauteur écrite en style est une MESURE du contenu, recalculée à chaque frappe — pas un
     défaut de design : le style inline est légitime ici (docs/PROMPTS.md, en tête). */
  const ajuster = useCallback((): void => {
    const el = interne.current;
    if (!el || !autoResize) return;
    el.style.height = 'auto';
    const cs = getComputedStyle(el);
    const bordures = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const paddings = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const voulu = el.scrollHeight + bordures;
    const plafond = maxRows ? maxRows * parseFloat(cs.lineHeight) + paddings + bordures : Infinity;
    el.style.height = Math.min(voulu, plafond) + 'px';
    el.style.overflowY = voulu > plafond ? 'auto' : 'hidden';
  }, [autoResize, maxRows]);

  /* Valeur contrôlée qui change sans frappe (envoi du message → champ vidé) : on réajuste
     avant le rendu à l'écran, sinon le champ garde un instant la hauteur du texte envoyé. */
  useLayoutEffect(ajuster, [ajuster, rest.value]);

  /* La largeur change le nombre de lignes (rotation, clavier, panneau latéral). On ne suit
     que la LARGEUR : la hauteur, c'est nous qui l'écrivons — la suivre bouclerait. */
  useEffect(() => {
    const el = interne.current;
    if (!el || !autoResize || typeof ResizeObserver === 'undefined') return;
    let largeur = el.clientWidth;
    const obs = new ResizeObserver(() => {
      if (el.clientWidth !== largeur) { largeur = el.clientWidth; ajuster(); }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [autoResize, ajuster]);

  const cls = cn(
    'ds-input', 'ds-textarea',
    size === 'sm' && 'ds-textarea--sm',
    autoResize && 'ds-textarea--auto',
    surface === 'card' && 'ds-input--on-card', surface === 'page' && 'ds-input--on-page',
    invalid && 'is-error', className,
  );
  return (
    <textarea
      ref={poserRefs}
      className={cls}
      rows={rows ?? (size === 'sm' ? 1 : 4)}
      aria-invalid={invalid || undefined}
      onInput={e => { ajuster(); onInput?.(e); }}
      {...rest}
      aria-describedby={describedBy}
    />
  );
});
Textarea.displayName = 'Textarea';
