import { createContext, useContext } from 'react';

/* LE LIEN ENTRE UN FormField ET SON CONTRÔLE — v0.5.0.
   FormField rend l'erreur et l'aide ; le contrôle, lui, doit les CITER dans son
   aria-describedby, sinon un lecteur d'écran annonce « invalide » sans dire pourquoi.
   FormField publie les identifiants par ce contexte, et chaque contrôle du socle (Input,
   Textarea, Select, DatePicker, Checkbox, RangeSlider) les lit. Un contrôle maison peut
   pointer les mêmes ids à la main : `${htmlFor}-error` et `${htmlFor}-help`. */
export interface FieldContextValue {
  /** Les ids de l'erreur puis de l'aide du FormField parent, séparés par un espace. */
  describedBy?: string;
}

export const FieldContext = createContext<FieldContextValue>({});

/** L'aria-describedby d'un contrôle : `avant` (son propre message, s'il en porte un), puis
 *  la description du FormField parent, puis `apres` (celui que l'appelant a passé). */
export function useFieldDescribedBy(avant?: string, apres?: string): string | undefined {
  const { describedBy } = useContext(FieldContext);
  return [avant, describedBy, apres].filter(Boolean).join(' ') || undefined;
}
