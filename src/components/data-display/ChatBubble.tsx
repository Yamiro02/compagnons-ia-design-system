import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * Bulle de conversation. `them` = le persona (carte blanche, à gauche) ; `me` =
 * l'utilisateur (dégradé de marque, à droite). Le parent est une colonne flex : la bulle
 * s'aligne d'elle-même (`align-self`). Le texte est du CONTENU — l'emoji y est permis.
 *
 * `typing` rend l'indicateur de saisie — trois points à la place du contenu, dans une
 * région `role="status"`. Il n'a de sens que côté persona (`from="them"`). Son nom
 * accessible est du contenu d'app — et une langue : passe `typingLabel` (« Claire écrit »,
 * « Claire is typing »), sinon le défaut français générique s'applique.
 */
export interface ChatBubbleProps extends HTMLAttributes<HTMLDivElement> {
  from: 'them' | 'me';
  /** Rend les trois points de saisie à la place de `children`. */
  typing?: boolean;
  /**
   * Le nom accessible de l'indicateur `typing` (v0.6.0) — c'est par lui que l'app traduit et
   * nomme le persona : « Claire écrit », « Claire is typing ». Défaut : « En train
   * d'écrire ». Un `aria-label` passé directement reste prioritaire.
   */
  typingLabel?: string;
  children?: ReactNode;
}

export function ChatBubble({
  from, typing = false, typingLabel = "En train d'écrire", className = '', children, ...rest
}: ChatBubbleProps): JSX.Element {
  const cls = cn('ds-bubble', from === 'me' ? 'ds-bubble--me' : 'ds-bubble--them', typing && 'ds-typing', className);
  if (typing) {
    return (
      <div role="status" aria-label={typingLabel} className={cls} {...rest}>
        <span className="ds-typing__dot" />
        <span className="ds-typing__dot" />
        <span className="ds-typing__dot" />
      </div>
    );
  }
  return <div className={cls} {...rest}>{children}</div>;
}
