# LEARN MORE DATA – Paiement de la formation en Data

Page web interactive du centre de formation **LEARN MORE DATA** : l'apprenant saisit son e-mail, choisit son mode de paiement (Mobile Money en RDC ou carte / autres pays), puis dépose une capture d'écran comme preuve. Tous les montants sont en **dollars (USD)**.

---

## Parcours de paiement

### 1. Page d'accueil
- Titre : **« Payer pour la formation »**, avec un paragraphe de présentation de la formation en data.
- Saisie de l'e-mail, puis ouverture immédiate du module **« Effectuer un paiement »**.

### 2. Étape 1 : « Comment souhaitez-vous payer ? »
1. **🇨🇩 RDC** : Mobile Money (Orange Money, Airtel Money, Vodacom M-Pesa).
2. **🌍 Autres pays et cartes** : liste déroulante de tous les pays, paiement via Chariow.
- Rappel du total en USD, puis bouton **« Continuer vers le paiement »**.

### 3. Étape 2 : Paiement & preuve
- **RDC** : choix de l'opérateur, puis affichage du **numéro de dépôt** avec, entre parenthèses, le **nom associé** à ce numéro.
- **Autres pays et cartes** : pays sélectionné, montant en USD et bouton **« Payer via Chariow »**.
- **Mobile Money (RDC)** : téléversement obligatoire de la capture d'écran comme preuve, puis **« Soumettre ma preuve de paiement »**.
- **Chariow** : aucune capture demandée ; Chariow confirme lui-même le paiement. Ces paiements ne sont donc pas enregistrés dans Supabase.

### 4. Étape 3 : Confirmation
- Vérification simulée, puis écran **« Capture reçue ! »** avec un message indiquant que la capture est en cours de vérification et que la personne recevra un e-mail (informations de la formation et groupe).

---

## Configuration

Tout se règle en haut de [`app.js`](app.js) :

```javascript
const PAYMENT_CONFIG = {
  rdc: {
    orangeMoney: { name: "Orange Money",   number: "08 40 61 94 70", recipientName: "Elisha" },
    airtelMoney: { name: "Airtel Money",   number: "09 89 34 20 97", recipientName: "Elisha" },
    mPesa:       { name: "Vodacom M-Pesa", number: "08 20 39 16 55", recipientName: "James" }
  },
  chariowUrl: "https://nbceuxnh.mychariow.shop/prd_9t3aiy2q/checkout"
};

const TRAINING = { name: "Formation Data", priceUsd: 30.0 };
```

- `number` / `recipientName` : le numéro et le nom affichés entre parenthèses à côté.
- `priceUsd` : le prix de la formation en dollars.

---

## Backend (Supabase)

Les preuves de paiement sont stockées dans Supabase (bucket privé) et chaque demande est enregistrée dans la table `payments`.

1. Créez un projet Supabase, puis collez [`supabase/schema.sql`](supabase/schema.sql) dans *SQL Editor* et lancez-le.
2. Dans *Authentication > Users*, créez le compte administrateur (e-mail `teachingdep@gmail.com`, « Auto Confirm User »), puis relancez la dernière requête du fichier SQL pour lui donner les droits.
3. Renseignez `SUPABASE_URL` et `SUPABASE_ANON_KEY` dans [`config.js`](config.js) (*Project Settings > API*). Seule la clé publique `anon` y a sa place : jamais la clé `service_role` ni un jeton `sbp_...`.
4. Les paiements se valident sur [`admin.html`](admin.html) (connexion e-mail + mot de passe).

La sécurité repose sur les règles RLS : un visiteur peut seulement créer une demande « en attente » et envoyer une image ; seuls les administrateurs peuvent lire et valider.

---

## Lancer le projet

Aucune dépendance (HTML5, CSS3, JavaScript). Ouvrez simplement [`index.html`](index.html) dans un navigateur.
