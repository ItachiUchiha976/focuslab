# DESIGN.md — Système de design FocusLab (focuslabboutique.fr)

> **À LIRE AVANT TOUTE ÉDITION DU SITE.** Ce document décrit le système de design **réellement en production** (extrait de `styles.css`, `bos-modern.css`, `bos-promo.js`, `bos-reveal.js`, `bos-retractation.js` et des pages produit le 17/07/2026). Tout nouvel élément doit réutiliser ces tokens et composants — ne rien inventer, ne rien dupliquer.

**Identité** : FocusLab = boutique d'accessoires **productivité / deep-work** (bureau, concentration, méthode Pomodoro). Âme visuelle : « **deep-work chaleureux** » — base froide sérieuse (navy/bleu) réchauffée par l'ambre (#f59e0b / #d97706 / #fffbeb), épurée, honnête, sans agressivité commerciale.

---

## 1. Palette (tokens CSS — `styles.css :root`)

| Token | Hex | Rôle |
|---|---|---|
| `--blue` | `#2563eb` | Couleur primaire : liens actifs, prix, icônes features, boutons primaires |
| `--blue-dark` | `#1d4ed8` | Hover des boutons bleus, dégradé CTA banner |
| `--blue-light` | `#3b82f6` | Dégradés d'appoint |
| `--blue-pale` | `#eff6ff` | Fonds de pills/tags bleus, encarts « Achat rapide », icônes |
| `--amber` | `#f59e0b` | **Couleur d'accent signature** : CTA d'achat, badges produit, étoiles, prix sticky |
| `--amber-dark` | `#d97706` | Hover CTA ambre, texte sur fond ambre pâle, bordure des descriptions produit |
| `--amber-pale` | `#fffbeb` | Fond des encarts chaleureux (description produit, bénéfice, alertes) |
| `--dark` | `#0f172a` | Navy profond : topbar, footer, menu mobile, sections sombres |
| `--dark-med` | `#1e293b` | Variante du navy (hover, page-hero) |
| `--text` | `#111827` | Titres, texte fort |
| `--text-med` | `#374151` | Corps de texte |
| `--text-light` | `#6b7280` | Texte secondaire, notes, breadcrumb |
| `--border` | `#e5e7eb` | Bordures de cartes et inputs |
| `--bg` | `#f8fafc` | Fond de page |
| `--bg-light` | `#f1f5f9` | Sections alternées, fonds d'images produit |
| `--white` | `#ffffff` | Cartes |
| `--success` | `#10b981` | Checks de réassurance, badge économie, toasts |
| `--danger` | `#ef4444` | Suppression panier, erreurs |

**Dégradés récurrents (exacts) :**
- Hero : `linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e3a8a 100%)` + voile radial `rgba(37,99,235,.25)`.
- Reflet animé du mot-clé du titre hero (`.hero-title em`) : `#FCD34D → #FEF3C7 → #D97706 → #FEF3C7 → #FCD34D`.
- CTA banner (newsletter) : `linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)`, texte d'appoint `#bfdbfe`.
- Bandeau promo (`bos-promo.js`) : violet `#6366f1 → #8b5cf6 → #a855f7` (délibérément distinct de la palette boutique = signal « annonce transverse BOS »).
- Pastille/modale rétractation : indigo `rgba(30,27,75,.82)`, titres `#312e81`, bouton `#6366f1 → #8b5cf6`.
- Bouton Stripe inline : `#635BFF` (couleur marque Stripe — ne pas la changer).
- Fonds d'images produit par gradient : `.img-lamp`, `.img-timer`, `.img-stand`, `.img-deskmat`, `.img-lightbar`, `.img-posture`, `.img-earplugs` (voir fin de `styles.css`).

## 2. Typographies

Chargées via Google Fonts (`preconnect` + `css2`) :

| Famille | Token | Graisses | Rôle |
|---|---|---|---|
| **Outfit** | `--f-title` | 400–800 | Titres h1–h4, logo `Focus<em>Lab</em>` |
| **Inter** | `--f-body` | 400–600 | Corps, boutons, formulaires (body par défaut) |
| **Work Sans** | — | 400–500 | **Typo distinctive des descriptions produit** (`.product-page__desc`, ajoutée le 17/07/2026, commit `c72ce16`) |

- `.product-page__desc` (le paragraphe descriptif principal des fiches) : `font-family:'Work Sans', var(--f-body)` ; `1.03rem / 1.7` ; encart **ambre pâle** (`--amber-pale`) avec `border-left: 3px solid var(--amber-dark)`, radius 8px, padding `1rem 1.25rem`. Il se distingue volontairement du bloc bénéfice `.bos-kit-benefit` (même famille de couleurs mais bordure `--amber` claire et padding différent) — **ne pas fusionner les deux**.
- Sur toute page qui utilise `.product-page__desc`, le lien Google Fonts doit inclure `family=Work+Sans:wght@400;500` (les pages non-produit chargent seulement Outfit + Inter).
- Échelle des titres (fluide) : h1 `clamp(1.9rem,5vw,3.2rem)` w800 · h2 `clamp(1.5rem,4vw,2.2rem)` w700 · h3 `clamp(1.1rem,3vw,1.45rem)` w600 · h4 `1rem` w600. Body `line-height:1.6`, paragraphes `1.75`.
- Pills/tags : `.72–.8rem`, w700, `letter-spacing:.05–.08em`, souvent `text-transform:uppercase`.

## 3. Tokens de forme, ombre, mouvement, layout

```css
--shadow:  0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06);   /* cartes au repos */
--shadow2: 0 4px 6px rgba(0,0,0,.07), 0 10px 30px rgba(0,0,0,.1);   /* hover simple */
--shadow3: 0 20px 60px rgba(37,99,235,.18);                          /* hover CTA bleu */
--r:  10px;   /* radius standard (boutons, encarts) */
--r2: 20px;   /* radius large (cartes, images produit) */
--t:  .22s ease;  /* transition standard */
--max-w: 1180px;  /* .container, padding latéral 1.25rem */
```
Autres radius en usage : `12px` (bouton panier, toast), `99px` (pills), `8px` (miniatures, encart desc), `24px` (hero-visual, cta-banner).

**Échelle d'espacement observée** : `.section` = `4.5rem 0` (desktop) → `3rem 0` (≤768px) ; gaps de grilles `1.5rem` (produits/témoignages) et `2rem` (features) ; padding cartes `1.4–2rem` ; hero `5rem 0 4rem` → `3.5rem 0 3rem`.

**Breakpoints** : `1024px` (grilles 2→1 col, hero empilé image d'abord), `768px` (hamburger + menu mobile, sections resserrées), `480px` (tout en 1 colonne, CTAs empilés). Mobile-first, `overflow-x:hidden` sur html+body (anti-débordement du menu off-canvas — ne pas retirer).

## 4. Composants récurrents

- **Boutons `.btn`** : padding `.85rem 1.75rem`, radius `--r`, w600. Variantes : `--primary` (bleu), `--secondary` (contour bleu 2px), `--amber` (**le CTA d'achat**), `--dark`, `--ghost` (sur fonds sombres), tailles `--lg` / `--sm` / `--full`. Hover = `translateY(-2px)` + ombre. `bos-modern.css` ajoute un **reflet balayant** (`::after` skewX, .6s) sur `.btn--amber` et `#add-to-cart-btn`.
- **`#add-to-cart-btn`** : pleine largeur (max 440px), ambre, `padding:16px 32px`, radius 12px. Porte les `data-product-id/-name/-price/-img-class` lus par `cart.js` **et** par la barre sticky mobile — ne jamais renommer ces attributs.
- **Cartes produit `.product-card`** : blanc, radius `--r2`, bordure `--border`, image carrée `aspect-ratio:1/1` avec zoom `scale(1.06)` au hover ; `bos-modern.css` approfondit le hover (`translateY(-8px)` + double ombre navy/ambre + voile bas). Badge `.product-card__badge` = pill ambre en haut-gauche.
- **Badges / pills** : `.section-tag` (bleu pâle), `.hero-badge` (ambre translucide sur navy), `.product-page__tag` (ambre pâle), `.tag--blue/--amber/--green`. Toujours radius `99px`.
- **Barre promo `bos-promo.js`** : bandeau sticky top violet « **−10 % sur le produit le plus cher de votre commande** — appliquée automatiquement au panier, sans code ». Remise **PERMANENTE et honnête** (conformité DGCCRF, refonte 13/07/2026). **Source de vérité unique du calcul = `window.BOS_PROMO.discount(cart)`** (arrondi au centime fait LÀ et nulle part ailleurs), consommée par `cart.js`, `bos-paypal.js` ET `bos-stripe.js` → l'affichage panier est toujours égal au montant facturé. Le bandeau ne s'affiche que sur les pages avec panier.
- **Pastille rétractation `bos-retractation.js`** : lien « ↩ Droit de rétractation » **flottant bas-gauche uniquement sur les pages d'achat** (fiche/panier/CGV/merci), se masque en descendant au scroll ; ailleurs = simple lien texte dans le footer. Ouvre une modale (formulaire → API VPS `api.tonargentexplique.fr/retractation`). Obligation légale (art. L221-18) — ne jamais la supprimer.
- **Barre d'achat sticky mobile `.bos-sticky-atc`** (construite par `bos-reveal.js`, stylée dans `bos-modern.css`) : mobile only, apparaît quand `#add-to-cart-btn` sort de l'écran, fond `rgba(15,23,42,.96)` + liseré ambre, prix ambre w800. Elle **proxifie le clic du vrai bouton** (zéro duplication de logique). `body.bos-atc-open` réserve 76px en bas et remonte la pastille rétractation à `bottom:88px` (conflit visuel résolu le 16/07 — préserver).
- **Header** : sticky, fond `rgba(248,250,252,.97)` + blur, **auto-masquant au scroll** (`.bos-nav-hidden`, descente = caché, remontée = visible, jamais caché si menu mobile ouvert). Topbar navy au-dessus (livraison offerte · 12–20 j ouvrés).
- **Menu mobile `.mobile-menu`** : off-canvas plein écran navy, `translateX(100%)→0`, `z-index:2000` (> header 1000), `overflow-y:auto` (règle §12.36 — liens toujours atteignables). Mêmes entrées de nav sur toutes les pages.
- **CTA newsletter `.cta-banner`** : dégradé bleu, formulaire Web3Forms (email + **case de consentement obligatoire** + note anti-spam), lien chaîne YouTube « Mindset Brut ».
- **Réassurance** : `.hero-trust` (checks verts), section `#garanties` (4 `feature-card` : satisfait ou remboursé 14 j, paiement sécurisé, livraison suivie 12–20 j, « Exactement la photo »), FAQ en `<details>` natifs, encarts « 📦 Ce que vous recevez » et « ✨ Pourquoi vous allez l'adorer ».
- **Toast `.toast`** : navy, bas-droite, ajout panier.

## 5. Animations & mouvement

- **Reveal au scroll** (`bos-reveal.js` + `[data-reveal]` dans `bos-modern.css`) : fade-up 26px, `.7s`, cascade `data-reveal-delay` 1–3 (+.08s/.16s/.24s) dans les grilles. Triple filet anti-contenu-invisible : (1) les éléments déjà visibles au chargement sont révélés **avant le premier repaint** (aucun flash), (2) passe de sécurité au scroll (tout élément dépassé est révélé), (3) **backstop dur à 5 s** — tout élément encore masqué est révélé coûte que coûte. En cas d'erreur JS, le `catch` révèle tout. **Toute nouvelle animation d'apparition doit garder ces filets.**
- **Hero vivant** (`bos-modern.css`) : halo ambre respirant (`bosGlow` 6s), flottement du produit (`bosFloat` 7s, ±14px), champ d'étoiles scintillant (`bosTwinkle` 5s), reflet doré balayant le mot en `em` du titre (`bosShine` 6.5s).
- **Animations SVG produit** : chaque fiche produit porte une **mini-animation SVG inline** (~82px, coin haut-droit de l'image, `aria-hidden="true"`, classe `bos-anim-produit` + variante par produit : `bos-anim-timer`, `-sunrise`, `-bar`, `-cable`, `-stand`, `-mat`, `-drawer`). Keyframes définies dans un `<style>` inline juste au-dessus. Discrètes, en boucle lente (6 s typ.), `pointer-events:none`. Tout nouveau produit doit recevoir la sienne, sur ce modèle.
- **`prefers-reduced-motion: reduce` est respecté PARTOUT** : hero, boutons, reveal (`opacity:1` forcé), reveal JS (early return), SVG produit. **Chaque nouvelle animation doit avoir sa règle reduced-motion.**
- Micro-interactions : hover cartes `-4/-8px`, header/pastille qui se masquent en `.25–.3s`, swap de miniatures avec fondu `.15s`.

## 6. Ton de voix (français)

- **Vocabulaire deep-work** : « deep work », « rituel », « concentration », « blocs de 25 minutes », « performers », « esprits qui veulent performer ». Bénéfice concret d'abord, spec ensuite.
- **Fiches produit = vouvoiement** (« Retournez simplement le cube », « Ce que vous recevez »). **Newsletter/hero communautaire = tutoiement** (« Ton email », « Inscris-toi », « Reste informé(e) ») avec formes inclusives « (e) ».
- **Honnêteté systématique** : délai réel annoncé partout (« Livraison estimée 12 à 20 jours ouvrés — expédition internationale »), « Exactement la photo », « Nouveauté — soyez parmi les premiers » (jamais de faux compteurs d'avis), rétractation 14 j visible, « Pas de spam. Désinscription en 1 clic. »
- **Français impeccable avec TOUS les accents** (é, è, à, ç…) y compris dans les meta descriptions et attributs `alt` — un texte sans accents trahit l'automatisation.

## 7. Pile BOS — ordre de chargement (ne pas casser)

```html
<head> : fonts → styles.css → bos-modern.css?v=N → bos-promo.js (tôt : bandeau sticky)
fin de <body> : cart.js → umami (data-website-id d0fa94fe-…) → bos-consent.js →
bos-trust.js → bos-stripe.js → bos-sticky-cta.js → /bos-retractation.js?v=N → bos-reveal.js?v=N
(fiches : bos-paypal.js selon page ; panier : bos-paypal-cart.js)
```
Les query strings `?v=N` servent de cache-busting : **incrémenter** quand on modifie le fichier correspondant.

## 8. ⛔ INTERDITS (non négociables)

1. **JAMAIS de compte à rebours, de chrono, ni de fausse urgence** (« l'offre expire dans 59:12 » sur une remise permanente = pratique commerciale trompeuse, art. L121-2 Code conso — le chrono a été supprimé le 13/07/2026, ne JAMAIS le réintroduire).
2. **JAMAIS de prix barré** ni de fausse réduction. Les classes `.product-price-old` / `.product-page__price-old` existent dans le CSS hérité mais sont **utilisées nulle part** dans le HTML — les laisser mortes. La seule remise = la −10 % permanente du bandeau, calculée par `BOS_PROMO.discount()`.
3. **JAMAIS de lien `github.io` brut en public** : tout lien affiché/partagé = `https://focuslabboutique.fr/...` (ou l'autre domaine officiel concerné).
4. **Ne jamais casser la chaîne de paiement** : ne pas renommer/supprimer `data-bos-key`, `data-bos-cb`, `data-bos-price`, `bosProductCB(...)`, `bosBuyNow(...)`, les `data-product-id/-name/-price` du bouton panier, ni les fichiers `bos-stripe.js` / `bos-paypal.js` / `cart.js`. Les prix sont revalidés côté VPS — un `data-bos-key` inconnu = checkout cassé.
5. **Une seule source de vérité pour la remise** : `window.BOS_PROMO.discount(cart)`. Interdit de recalculer ou re-arrondir la remise ailleurs (affichage ≠ facturé = trompeur).
6. **Contraste AA minimum** (WCAG 2.1) : texte normal ≥ 4.5:1, grand texte ≥ 3:1. Sur navy `#0f172a`, utiliser `#cbd5e1`/`#94a3b8` et plus clair ; jamais de texte ambre sur fond blanc en petit corps (utiliser `--amber-dark`).
7. **Accents français corrects partout** — aucune réponse/texte public sans accents ; genre masculin quand le marchand parle de lui.
8. **Ne pas supprimer** : pastille/lien rétractation (obligation légale), case de consentement newsletter, mentions de livraison honnête 12–20 j, `bos-consent.js`, script Umami.
9. **Toute animation nouvelle** doit respecter `prefers-reduced-motion` ET ne jamais pouvoir laisser du contenu invisible (suivre le modèle backstop de `bos-reveal.js`).
10. **Pas de framework, pas de CDN JS externe** : le site est 100 % statique (GitHub Pages + CNAME `focuslabboutique.fr`), HTML/CSS/JS vanilla. Rester dans ce budget.

---
*Document généré le 17/07/2026 à partir du code en production. En cas de divergence code ↔ doc, le code fait foi — puis mettre ce fichier à jour.*
