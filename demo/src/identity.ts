import { BRAND_MONOGRAM, BRAND_NAME, BRAND_WORDMARK_LINES } from '@acme/ds';

/* L'IDENTITÉ DU PROJET — pas celle du design system.
   Un mot-marque, un lieu, un prénom d'exemple : ce sont des CONTENUS d'application, pas
   des jetons. Le socle n'en porte aucun ; ce fichier tient le rôle du projet qui les
   fournit, et reprend ce que `src/brand.ts` déclare.
   C'EST UN FICHIER À ÉDITER quand vous montez un projet : `rebrand` met à jour
   `src/brand.ts`, mais le lieu et le prénom d'exemple ci-dessous sont du contenu. */
export const IDENTITY = {
  wordmark: BRAND_WORDMARK_LINES,
  monogram: BRAND_MONOGRAM,
  prenom: 'Alex',
  personne: BRAND_NAME,
  lieu: 'Ville · Pays',
  titre: BRAND_NAME + ' — Design System',
};
