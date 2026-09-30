import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * Bulle de conversation. `them` = le persona (carte blanche, à gauche) ; `me` =
 * l'utilisateur (dégradé de marque, à droite). Le parent est une colonne flex : la bulle
 * s'aligne d'elle-même (`align-self`). Le texte est du CONTENU — l'emoji y est permis.
 *
 * `typing` rend l'indicateur de saisie — trois points à la place du contenu, dans une
 * région `role="status"`. Il n'a de sens que côté persona (`from="them"`). Le nom du
 * persona est du contenu d'app : passe `aria-label` (« Claire écrit »), sinon le défaut
 * générique s'applique.
 */
export interface ChatBubbleProps extends HTMLAttributes<HTMLDivElement> {
  from: 'them' | 'me';
  /** Rend les trois points de saisie à la place de `children`. */
  typing?: boolean;
  children?: ReactNode;
}

export function ChatBubble({ from, typing = false, className = '', children, ...rest }: ChatBubbleProps): JSX.Element {
  const cls = cn('ds-bubble', from === 'me' ? 'ds-bubble--me' : 'ds-bubble--them', typing && 'ds-typing', className);
  if (typing) {
    return (
      <div role="status" aria-label="En train d'écrire" className={cls} {...rest}>
        <span className="ds-typing__dot" />
        <span className="ds-typing__dot" />
        <span className="ds-typing__dot" />
      </div>
    );
  }
  return <div className={cls} {...rest}>{children}</div>;
}
