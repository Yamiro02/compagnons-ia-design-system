import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Pastille } from '../data-display/Pastille';
import { Halo } from '../brand/Halo';

/** Dashed-border empty slot: <Pastille size="panneau" tone="brand" outlined> tile, titre H4 en face display, one next step. */
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Un glyphe nu — la Pastille par défaut (panneau · brand · outlined) l'enveloppe. */
  icon?: ReactNode;
  /**
   * LA TUILE COMPLÈTE, quand celle par défaut ne convient pas — v0.3.0 : la Pastille était FIGÉE, aucun moyen d'en changer le ton ou la
   * taille. Passer ici sa propre <Pastille> (ou tout nœud) ; `icon` est alors ignoré.
   */
  tile?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /**
   * Le cadre tireté. `true` (défaut) : l'emplacement vide se DÉSIGNE, il a une frontière —
   * c'est le cas dans une grille, où il tient la place d'une carte manquante. `false` :
   * plus de bordure ni de fond, seulement le padding. À utiliser quand le vide occupe déjà
   * un contenant qui a sa propre frontière (une carte, un panneau, un écran entier) : deux
   * cadres emboîtés se lisent comme une erreur de mise en page.
   */
  framed?: boolean;
  /** Un halo de marque derrière le contenu — le vide d'un écran entier, qu'on veut chaleureux plutôt que clinique. */
  halo?: boolean;
}

export function EmptyState({
  icon, tile, title, description, action, framed = true, halo = false, className = '', ...rest
}: EmptyStateProps): JSX.Element {
  return (
    <div className={cn('ds-empty', !framed && 'ds-empty--bare', halo && 'ds-empty--halo', className)} {...rest}>
      {halo ? <Halo placement="center" /> : null}
      {tile ?? (icon ? <Pastille size="panneau" tone="brand" outlined>{icon}</Pastille> : null)}
      <div className="ds-empty__main">
        <h4 className="ds-empty__title">{title}</h4>
        {description ? <p className="ds-empty__desc">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
