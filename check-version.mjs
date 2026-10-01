#!/usr/bin/env node
/**
 * Filet de COHÉRENCE DE VERSION — quatre choses qui doivent dire le même numéro.
 *
 * LE DÉFAUT QU'IL FERME. Il n'y a pas de registre : chaque app épingle une version par un
 * tag git. Quatre endroits portent donc le numéro, et ils doivent concorder :
 *
 *     package.json       "version"                ce que le paquet dit être
 *     package-lock.json  "version" ET             ce que le lock croit installer — DEUX
 *                        packages[""].version     champs, que `npm version` réécrit et
 *                                                 qu'un bump à la main oublie
 *     README.md          la ligne `npm i …#v`     ce qu'on dit aux gens d'installer
 *     git tag            v<version>               ce qui existe réellement à installer
 *
 * Le lock a dérivé SANS BRUIT jusqu'à 0.2.0 pendant que le paquet passait 0.3.0, 0.3.1 et
 * 0.4.0 : un bump à la main touche package.json, jamais le lock, et rien ne le voyait.
 *
 * Si le tag manque, la ligne du README ne résout pas : `npm i …#v0.4.1` échoue chez
 * l'utilisateur, avec un message git qui ne dit pas que c'est un oubli de publication.
 *
 * POURQUOI IL EXISTE. La procédure est écrite dans GOVERNANCE.md — « la ligne
 * d'installation du README se met à jour EN MÊME TEMPS que le tag » — et elle a
 * échoué TROIS FOIS DE SUITE : 0.3.0, 0.4.0, 0.4.1. Une procédure écrite ne tient pas.
 * Ce contrôle-ci tient. C'est tout l'argument.
 *
 * Usage : node check-version.mjs
 * En CI il est BLOQUANT. En local, `git tag` peut manquer si le dépôt vient d'être copié
 * sans son historique : le contrôle le dit et n'échoue pas sur ce cas-là.
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = pkg.version;
const attendu = 'v' + version;

/* ── 1 · la ligne d'installation du README ────────────────────────────────── */
const readme = fs.readFileSync('README.md', 'utf8');
const lignes = readme.split('\n');
const idx = lignes.findIndex(l => /^npm i .*#v[\d.]+\s*$/.test(l.trim()));
if (idx === -1) {
  console.error(`
✗ version — aucune ligne d'installation trouvée dans README.md.
  Le contrôle cherche une ligne de la forme :  npm i <source>#v<version>
  Si la façon d'installer a changé, adapte ce script — ne le supprime pas.
`);
  process.exit(1);
}
const ligne = lignes[idx].trim();
const dansReadme = /#(v[\d.]+)\s*$/.exec(ligne)[1];

/* ── 2 · le lock — ses DEUX champs de version ─────────────────────────────── */
/* Absent, ce n'est pas une incohérence (une copie sans lock, un dépôt qui n'en commite pas) :
   avertissement. Présent, il doit dire la version de package.json aux deux endroits. */
let lock = null;
try {
  lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}

/* ── 3 · le tag ───────────────────────────────────────────────────────────── */
let tags = null;
try {
  tags = execFileSync('git', ['tag', '--list'], { encoding: 'utf8' }).split('\n').map(t => t.trim()).filter(Boolean);
} catch { /* pas un dépôt git, ou git absent */ }

/* ── verdict ──────────────────────────────────────────────────────────────── */
const erreurs = [];
if (dansReadme !== attendu) erreurs.push(
  `README.md:${idx + 1} annonce ${dansReadme}, package.json dit ${version}.\n      ${ligne}`);
let lockVerifie = false;
if (lock === null) {
  console.warn('⚠ version — pas de package-lock.json : sa version n\'a pas pu être vérifiée.');
} else {
  const champs = [
    ['"version" (racine)', lock.version],
    ['packages[""].version', lock.packages?.['']?.version],
  ];
  for (const [nom, valeur] of champs) {
    if (valeur !== version) erreurs.push(
      `package-lock.json → ${nom} vaut ${valeur === undefined ? '(absent)' : valeur}, package.json dit ${version}.\n`
      + `      Corrige ce champ à ${version} — ou relance \`npm install --package-lock-only\`, qui réécrit les deux.`);
  }
  lockVerifie = champs.every(([, v]) => v === version);
}
let tagVerifie = false;
if (tags === null) {
  console.warn('⚠ version — pas de dépôt git lisible : l\'existence du tag n\'a pas pu être vérifiée.');
} else if (tags.length === 0) {
  // Dépôt créé depuis un template GitHub : git est là, mais l'historique repart de zéro
  // et aucun tag n'existe encore. Le projet n'a simplement rien publié — ce n'est pas
  // une incohérence, c'est un avertissement.
  console.warn('⚠ version — dépôt git présent mais aucun tag posé : rien n\'a encore été publié.');
} else if (!tags.includes(attendu)) {
  erreurs.push(
    `le tag ${attendu} N'EXISTE PAS. Derniers tags posés : ${tags.slice(-3).join(', ')}\n`
    + `      Un README qui envoie sur un tag absent produit une installation qui échoue.`);
} else {
  tagVerifie = true;
}

if (erreurs.length) {
  console.error(`\n✗ version — ${erreurs.length} incohérence(s) :\n`);
  for (const e of erreurs) console.error('    · ' + e);
  console.error(`
  La procédure : on bump package.json ET package-lock.json (\`npm install --package-lock-only\`),
  on met à jour la ligne du README, on commite, PUIS
  on pose le tag annoté sur ce commit et on pousse avec --follow-tags. Tout d'un coup,
  jamais l'un sans les autres.
`);
  process.exit(1);
}
console.log(`✓ version — ${version} · README ${dansReadme}`
  + (lockVerifie ? ` · lock ${version} (×2)` : ` · lock non vérifié`)
  + (tagVerifie ? ` · tag ${attendu} présent` : ` · tag non vérifié`));
