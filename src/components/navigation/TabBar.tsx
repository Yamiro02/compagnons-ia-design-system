import { useEffect } from 'react';
import type { ElementType, HTMLAttributes, JSX, MouseEventHandler, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/* Remplacé par le bundler de l'app (Vite, webpack…), donc le bloc disparaît en
   production. `declare` local plutôt qu'une dépendance @types/node ajoutée au paquet —
   même parade que dans ActionSheet. */
declare const process: { env: { NODE_ENV?: string } };

/**
 * Bottom tab bar — the shell of a mobile PWA. A FLOATING white pill capsule, detached
 * from the edges (side + bottom margins, safe area included), --border hairline and
 * --shadow-lg. Labels are always visible under their icon; the active item sits in its
 * own --accent pill, icon and label in --primary-readable semibold.
 *
 * QUATRE ONGLETS, PAS CINQ. Sur 390 px, un cinquième onglet fait passer chaque cible sous
 * 78 px de large et le libellé se tronque — la barre cesse d'être lisible d'un coup d'œil.
 * Ce qui ne rentre pas dans quatre destinations n'appartient pas à la coque : ça vit
 * derrière l'une d'elles. Un cinquième item est RENDU quand même (couper une navigation en
 * silence serait pire), mais signalé en console en développement.
 *
 * ⚠️ CIBLE TACTILE — écart assumé. L'item mesure 2.25rem (36 px) de haut, sous le rail
 * 44 px du reste du système : une capsule flottante à 44 px mange le contenu qu'elle
 * survole. La cible RÉELLE au doigt vaut 44 px marges comprises (36 + 4 + 4) et rien
 * d'autre n'est cliquable entre deux items — le manque est optique, pas fonctionnel.
 * Voir `docs/accessibilite.md`.
 *
 * Ne pas la confondre avec `Tabs`, qui FILTRE un contenu en place. Ici on NAVIGUE : d'où
 * le `<nav>`, le rendu en `<a>` dès qu'il y a une destination, et `aria-current="page"`.
 */
export interface TabBarItem {
  label: string;
  /** Le tracé, obligatoire — un onglet de coque sans icône n'existe pas. */
  icon: ReactNode;
  /** Destination. Présente, l'onglet est un `<a>` ; absente, un `<button>`. */
  href?: string;
  active?: boolean;
  onSelect?: MouseEventHandler;
}

export interface TabBarProps extends HTMLAttributes<HTMLElement> {
  /** Les destinations de la coque — QUATRE au plus (voir la doc du composant). */
  items?: TabBarItem[];
  /**
   * Enveloppe la barre dans `.ds-tabbar-dock` — la coque de l'app : `position:fixed`,
   * collée en bas de l'écran, au niveau de la navbar. C'est le rendu de PRODUCTION.
   * Sans lui, la barre est rendue dans le flux — ce que veut un spécimen de vitrine ou
   * un aperçu dans un cadre.
   */
  dock?: boolean;
}

const MAX_ONGLETS = 4;

export function TabBar({
  items = [], dock = false, className = '',
  'aria-label': ariaLabel = 'Navigation principale', ...rest
}: TabBarProps): JSX.Element {
  /* Filet de développement — la troncature des libellés est un défaut MUET : la barre
     rend, elle est juste illisible sur le mobile de référence. */
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (items.length > MAX_ONGLETS) {
      console.warn(
        `[ds] TabBar: ${items.length} onglets pour ${MAX_ONGLETS} au maximum. Sur 390 px les `
        + 'libellés se tronquent et les cibles passent sous la largeur utile. Ce qui ne rentre '
        + 'pas dans quatre destinations vit DERRIÈRE l\'une d\'elles, pas dans la coque.',
      );
    }
  }, [items.length]);

  const barre = (
    <nav className={cn('ds-tabbar', className)} aria-label={ariaLabel} {...rest}>
      {items.map(it => {
        /* Sans destination on rend un `<button>` : un `<a>` sans href n'est pas un lien,
           et un lecteur d'écran l'annoncerait comme du texte. */
        const Tag = (it.href ? 'a' : 'button') as ElementType;
        const destination = it.href ? { href: it.href } : { type: 'button' as const };
        return (
          <Tag
            key={it.label}
            {...destination}
            className={cn('ds-tabbar__item', it.active && 'is-active')}
            aria-current={it.active ? 'page' : undefined}
            onClick={it.onSelect}
          >
            {it.icon}
            <span>{it.label}</span>
          </Tag>
        );
      })}
    </nav>
  );

  return dock ? <div className="ds-tabbar-dock">{barre}</div> : barre;
}
