import { useId, useRef } from 'react';
import type { HTMLAttributes, JSX, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useFieldDescribedBy } from './field-context';

/** Curseur de PLAGE — deux poignées sur une piste, une valeur `[a, b]`. Contrôlé.
 *  Chaque poignée est un `role="slider"` focusable ; le groupe est nommé par le libellé
 *  visible. Clavier : flèches (± step), Page↑/↓ (± un dixième de la plage), Début/Fin.
 *  Pointeur : glisser une poignée, ou cliquer la piste — la poignée la plus proche y va.
 *  Les deux poignées ne se croisent jamais. */
export interface RangeSliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Libellé visible, à gauche de l'en-tête — il nomme le groupe. */
  label: ReactNode;
  min: number;
  max: number;
  /** Pas de déplacement, défaut 1. */
  step?: number;
  value: [number, number];
  onChange?: (value: [number, number]) => void;
  /** Mise en forme d'UNE valeur : `aria-valuetext` des poignées et bornes par défaut. */
  formatValue?: (value: number) => string;
  /** La valeur affichée à droite de l'en-tête. Défaut : « a – b » via `formatValue`. */
  display?: ReactNode;
  /** Les bornes sous la piste. Défaut : `min` et `max` via `formatValue`. `false` les retire. */
  bounds?: [ReactNode, ReactNode] | false;
  /** Noms accessibles des deux poignées. */
  thumbLabels?: [string, string];
  disabled?: boolean;
}

export function RangeSlider({
  label, min, max, step = 1, value, onChange, formatValue = String, display, bounds,
  thumbLabels = ['Minimum', 'Maximum'], disabled = false, className = '', ...rest
}: RangeSliderProps): JSX.Element {
  const labelId = useId();
  /* Les messages d'un FormField parent (erreur, puis aide) — v0.5.0, posés sur chaque poignée. */
  const describedBy = useFieldDescribedBy();
  const track = useRef<HTMLDivElement>(null);
  const thumbs = useRef<(HTMLDivElement | null)[]>([]);
  /* La poignée tenue par le pointeur. `undefined` le temps du premier mouvement quand les
     deux sont confondues : c'est la DIRECTION qui décide, sinon la poignée du dessus
     resterait bloquée contre l'autre. */
  const drag = useRef<{ index: 0 | 1 | undefined; x: number } | null>(null);

  const [a, b] = value;
  const span = max - min || 1;
  const pct = (v: number) => ((v - min) / span) * 100;
  const snap = (v: number) => Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min));

  const poser = (index: 0 | 1, v: number) => {
    const borne = index === 0 ? Math.min(snap(v), b) : Math.max(snap(v), a);
    if (borne === value[index]) return;
    onChange?.(index === 0 ? [borne, b] : [a, borne]);
  };

  const depuisPointeur = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    return min + Math.min(1, Math.max(0, (clientX - r.left) / (r.width || 1))) * span;
  };

  const auClavier = (index: 0 | 1) => (e: KeyboardEvent<HTMLDivElement>) => {
    const grand = Math.max(step, Math.round(span / 10 / step) * step);
    const v = value[index];
    const cible = {
      ArrowRight: v + step, ArrowUp: v + step, ArrowLeft: v - step, ArrowDown: v - step,
      PageUp: v + grand, PageDown: v - grand,
      Home: index === 0 ? min : a, End: index === 0 ? b : max,
    }[e.key];
    if (cible === undefined) return;
    e.preventDefault();
    poser(index, cible);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    const v = depuisPointeur(e.clientX);
    const surPoignee = (e.target as HTMLElement).dataset.thumb;
    let index: 0 | 1 | undefined;
    if (a === b) index = surPoignee === undefined ? (v < a ? 0 : 1) : undefined;
    else if (surPoignee !== undefined) index = Number(surPoignee) as 0 | 1;
    else index = Math.abs(v - a) <= Math.abs(v - b) ? 0 : 1;
    e.preventDefault();
    track.current!.setPointerCapture(e.pointerId);
    drag.current = { index, x: e.clientX };
    if (index !== undefined) {
      thumbs.current[index]?.focus();
      if (surPoignee === undefined) poser(index, v);
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    if (d.index === undefined) {
      if (e.clientX === d.x) return;
      d.index = e.clientX < d.x ? 0 : 1;
      thumbs.current[d.index]?.focus();
    }
    poser(d.index, depuisPointeur(e.clientX));
  };

  const finDrag = () => { drag.current = null; };

  const bornes = bounds === undefined ? [formatValue(min), formatValue(max)] : bounds;

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className={cn('ds-range', disabled && 'is-disabled', className)}
      {...rest}
    >
      <div className="ds-range__head">
        <span id={labelId} className="ds-label">{label}</span>
        <span className="ds-range__value">{display ?? `${formatValue(a)} – ${formatValue(b)}`}</span>
      </div>
      <div
        ref={track}
        className="ds-range__track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finDrag}
        onPointerCancel={finDrag}
      >
        <span className="ds-range__rail" />
        <span className="ds-range__fill" style={{ left: pct(a) + '%', width: pct(b) - pct(a) + '%' }} />
        {([a, b] as const).map((v, i) => (
          <div
            key={i}
            ref={el => { thumbs.current[i] = el; }}
            data-thumb={i}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={thumbLabels[i]}
            aria-valuemin={i === 0 ? min : a}
            aria-valuemax={i === 0 ? b : max}
            aria-valuenow={v}
            aria-valuetext={formatValue(v)}
            aria-disabled={disabled || undefined}
            aria-describedby={describedBy}
            className="ds-range__thumb"
            style={{ left: pct(v) + '%' }}
            onKeyDown={disabled ? undefined : auClavier(i as 0 | 1)}
          />
        ))}
      </div>
      {bornes ? (
        <div className="ds-range__bounds" aria-hidden="true">
          <span className="caption">{bornes[0]}</span>
          <span className="caption">{bornes[1]}</span>
        </div>
      ) : null}
    </div>
  );
}
