import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * Segmented tab group on the control rail. The bar ALWAYS contrasts with its host
 * surface: --card on the page; inside a Card the bar deduces --background by itself
 * (patterns.css) — set `onCard` only for other containers that need the recessed regime,
 * `onPage` for the reverse (a cream island inside a Card that should stay white).
 * PILL bar and PILL tabs, since the project's rounded doctrine — --tabs-radius is
 * redeclared to --radius-pill in the brand file so the tab never overflows its corners.
 */
export interface TabItem { value: string; label: ReactNode }

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items?: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
  /** The bar sits on a Card — swaps the background to --background for contrast. */
  onCard?: boolean;
  /**
   * L'échappatoire INVERSE, jumelle de `surface="page"` des boutons : la barre est DANS
   * une carte mais doit rester BLANCHE — le cas d'un îlot crème posé dans la carte. La
   * barre remonte à --card, l'onglet actif redescend sur --background.
   */
  onPage?: boolean;
}

export function Tabs({ items = [], value, onChange, onCard = false, onPage = false, className = '', ...rest }: TabsProps): JSX.Element {
  return (
    <div className={cn('ds-tabs', onCard && 'ds-tabs--on-card', onPage && 'ds-tabs--on-page', className)} role="tablist" {...rest}>
      {items.map(it => (
        <button
          key={it.value}
          type="button"
          role="tab"
          className="ds-tab"
          aria-selected={value === it.value}
          onClick={() => onChange && onChange(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
