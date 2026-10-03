# Plan MVP Agro RDC (Web First) + Paiement intégré

## 1. Objectif
Créer une plateforme web qui met en relation producteurs agricoles et acheteurs en RDC, avec paiement intégré pour garantir la monétisation de la plateforme et réduire les transactions hors système.

## 2. Périmètre MVP Web First
- Web application responsive (desktop + mobile web)
- Comptes Producteur, Acheteur, Admin
- Publication d'annonces (produit, quantité, prix, localisation, photo)
- Recherche et filtres
- Chat interne
- Commande et suivi de statut
- Paiement intégré Mobile Money
- Gestion des litiges simple

## 3. Paiement intégré: workflow recommandé

### 3.1 États de commande
- Brouillon
- En attente de paiement
- Payé (fonds sécurisés)
- En préparation
- Livré
- Confirmé
- Litige
- Remboursé (si applicable)
- Clôturé

### 3.2 Flux de paiement
1. L'acheteur confirme la commande.
2. L'acheteur paie via Mobile Money depuis l'application.
3. La plateforme reçoit la confirmation de paiement (callback/provider).
4. Les fonds sont marqués "sécurisés" (non libérés immédiatement au vendeur).
5. Le vendeur livre.
6. L'acheteur confirme la réception.
7. La plateforme prélève sa commission.
8. Le solde vendeur est libéré.

### 3.3 Commission plateforme
- Commission fixe suggérée MVP: 5% à 8% par transaction.
- Option minimum par transaction (ex: 0.20 USD) pour petites ventes.
- La commission est prélevée automatiquement avant reversement vendeur.

## 4. Anti-contournement (vendeur/acheteur hors plateforme)

### 4.1 Règle produit
- Rencontre physique autorisée.
- Paiement obligatoire dans l'application pour transaction protégée et validée.

### 4.2 Mesures techniques
- Masquage du numéro de téléphone avant commande payée.
- Chat interne obligatoire pour la négociation initiale.
- Détection de partage de numéro dans le chat (alerte + modération).
- Historique et réputation uniquement sur transactions in-app.

### 4.3 Mesures business
- CGU: transactions hors plateforme non couvertes (litige/remboursement).
- Pénalités progressives: avertissement -> suspension temporaire -> blocage.
- Avantages fidélité pour transactions in-app (frais réduits, visibilité).

## 5. Backlog MVP en 6 sprints (web first)

### Sprint 1: Socle
- Auth téléphone (OTP)
- Gestion des rôles (producteur/acheteur/admin)
- Base données initiale
- Logging basique

### Sprint 2: Catalogue
- Création annonce produit
- Upload photo
- Listing et filtres de recherche

### Sprint 3: Transaction
- Création commande
- États de commande
- Tableau de bord commande vendeur/acheteur

### Sprint 4: Paiement intégré
- Intégration passerelle Mobile Money
- Webhooks de confirmation
- Ledger transaction simple
- Commission automatique

### Sprint 5: Confiance et litiges
- Chat interne
- Ouverture/gestion litige
- Modération admin
- Règles anti-contournement

### Sprint 6: Stabilisation
- Tests fonctionnels
- Corrections
- Monitoring
- Préparation pilote terrain

## 6. Budget de développement complet (plafond 10 000 USD)

Hypothèse: équipe légère hybride (freelance/part-time), MVP web first sur 10-12 semaines.

### 6.1 Répartition par poste
- Product management & cadrage: 900 USD
- UX/UI design: 900 USD
- Développement frontend web: 2 200 USD
- Développement backend + API: 2 600 USD
- Intégration paiement Mobile Money: 1 300 USD
- QA & tests: 700 USD
- DevOps / déploiement / monitoring: 600 USD
- Support pilote et formation opérationnelle: 400 USD
- Réserve imprévus (environ 4%): 400 USD

Total: 10 000 USD

### 6.2 Répartition temporelle (indicative)
- Semaine 1-2: cadrage + design (1 800 USD)
- Semaine 3-6: dev socle + catalogue + commande (4 000 USD)
- Semaine 7-8: paiement intégré (1 700 USD)
- Semaine 9-10: chat, litiges, admin (1 500 USD)
- Semaine 11-12: QA, déploiement, pilote (1 000 USD)

## 7. Coûts mensuels d'exploitation (après MVP)
- Hébergement + DB + stockage: 120 à 300 USD
- SMS/OTP + notifications: 80 à 250 USD
- Maintenance corrective légère: 200 à 500 USD
- Support opérationnel minimum: 150 à 350 USD

Total mensuel estimé: 550 à 1 400 USD

## 8. KPI de validation MVP
- Producteurs actifs hebdomadaires
- Acheteurs actifs hebdomadaires
- Taux annonce -> contact
- Taux contact -> commande
- Taux commande payée
- Délai moyen de vente produit périssable
- Valeur brute des transactions (GMV)
- Revenu net plateforme (commissions)

## 9. Plan d'activation terrain (60 jours)

### Jours 1-15
- Cibler 2-3 marchés pilotes
- Onboarder 30-50 producteurs
- Onboarder 20-30 acheteurs

### Jours 16-30
- Lancer transactions réelles avec support terrain
- Suivre litiges et points de friction
- Ajuster UX rapidement

### Jours 31-45
- Renforcer acquisition par coopératives et relais locaux
- Lancer programme confiance (badges vendeurs actifs)

### Jours 46-60
- Stabiliser opérations
- Mesurer KPI
- Décider passage à phase mobile native

## 10. Décision Go/No-Go vers mobile
Passer à l'application mobile native si, sur 60 jours:
- taux commande payée >= 25%
- rétention acheteurs 30 jours >= 20%
- revenus commission couvrent au moins les coûts variables

Si ces seuils ne sont pas atteints, itérer encore sur la version web.
