import type { CSSProperties, HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { BRAND_MONOGRAM, BRAND_WORDMARK_LINES } from '../../brand';

/**
 * La marque, rendue en CSS : capitales de `--font-display` + une pastille carrée à
 * coins arrondis en dégradé (côté ~0.21em, rayon 25 %, lueur `--shadow-logo-dot` —
 * voir tokens/base.css). La pastille garde le dégradé de marque sur tous les fonds ;
 * seules les lettres s'inversent.
 *
 * PARAMÉTRÉ POUR LE TEMPLATE. Le mot-marque, le monogramme, la pastille et le libellé
 * accessible sont des props ; aucun nom n'est codé en dur dans une règle CSS.
 *
 *     <Logo wordmark={['Acme','Studio']} />
 *     <Logo wordmark="Acme" dot={false} />
 *     <Logo wordmark="Acme" dot={<img src="/mark.svg" alt="" height={12} />} />
 *
 * LES DÉFAUTS VIENNENT DE `src/brand.ts` — le seul endroit du paquet où une identité
 * textuelle est écrite. Un projet client remplace ce fichier-là, pas celui-ci.
 *
 * Ne jamais fausse-grasser, contourer ni interlettrer le mot-marque : la casse et la
 * graisse suivent --heading-transform / --heading-weight, comme tout le titrage.
 */
export interface LogoProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'wordmark' | 'stacked' | 'monogram';
  /**
   * Force la couleur des LETTRES : `dark` = lettres sombres (sur une surface claire),
   * `light` = lettres claires (sur une surface sombre). Omise, elles suivent le
   * `--foreground` de la surface et s'inversent toutes seules — c'est le défaut.
   *
   * Elle s'appelait autrement en v0.4, avec des valeurs qui nommaient une matière.
   * Renommée en v0.5.0, sur trois motifs : l'ancienne valeur sombre ne renvoyait plus à
   * aucun jeton depuis que les neutres se nomment
   * `--tone-dark` / `--tone-light` ; `tone` portait deux sens dans l'API publique —
   * sémantique sur Badge, Toast, Banner et Pastille, matière ici ; et `letters="light"`
   * n'a qu'une lecture possible, là où `tone="light"` sur un logo peut se lire
   * « mode sombre ».
   */
  letters?: 'dark' | 'light';
  /** Longueur CSS, toujours en rem — hauteur totale de la marque (le font-size en découle). */
  height?: string;
  /**
   * Le mot-marque. Une chaîne, ou un mot par ligne pour la variante `stacked`.
   * Défaut : `BRAND_WORDMARK_LINES` de `src/brand.ts`.
   */
  wordmark?: string | readonly string[];
  /** Le monogramme. Défaut : `BRAND_MONOGRAM` de `src/brand.ts`, ou les initiales si un
   *  autre mot-marque est passé. */
  monogram?: string;
  /** La pastille. `false` la retire ; un nœud la remplace. Défaut : la pastille CSS en dégradé. */
  dot?: ReactNode | false;
  /** Libellé accessible. Défaut : le mot-marque, mots joints par une espace. */
  label?: string;
}

export function Logo({
  variant = 'wordmark', letters, height = '1.75rem',
  wordmark = BRAND_WORDMARK_LINES, monogram, dot, label,
  className = '', style, ...rest
}: LogoProps): JSX.Element {
  const words = typeof wordmark === 'string' ? [wordmark] : [...wordmark];
  const name = label ?? words.join(' ');
  /* Le monogramme se DÉRIVE des initiales dès qu'un appel fournit son propre mot-marque ;
     celui de `src/brand.ts` a le sien, écrit — des initiales déduites ne sont pas toujours
     celles qu'une marque emploie. */
  const initials = monogram
    ?? (wordmark === BRAND_WORDMARK_LINES ? BRAND_MONOGRAM : words.map((w) => w.slice(0, 1)).join(''));
  const color = letters === 'light' ? 'var(--tone-light)' : letters === 'dark' ? 'var(--tone-dark)' : 'var(--foreground)';
  /* `dot === undefined` = la pastille par défaut ; `false` = aucune ; sinon le nœud fourni. */
  const mark = dot === false ? null
    : dot === undefined ? <span aria-hidden="true" className="ds-logo__dot" />
    : dot;
  const base: CSSProperties = { fontSize: 'calc(' + height + ' * 1.25)', color, ...style };

  if (variant === 'monogram') {
    return (
      <span className={cn('ds-logo', className)} style={base} aria-label={name} {...rest}>
        {initials}{mark}
      </span>
    );
  }
  if (variant === 'stacked') {
    return (
      <span
        className={cn('ds-logo', className)}
        style={{ ...base, flexDirection: 'column', alignItems: 'flex-start', gap: '0.08em' }}
        aria-label={name}
        {...rest}
      >
        {words.slice(0, -1).map((w) => <span key={w}>{w}</span>)}
        <span style={{ display: 'inline-flex', alignItems: 'flex-end' }}>{words[words.length - 1]}{mark}</span>
      </span>
    );
  }
  return (
    <span className={cn('ds-logo', className)} style={base} aria-label={name} {...rest}>
      {words.join(' ')}{mark}
    </span>
  );
}
