# AgroConnect RDC — MVP Web

Application web Next.js pour connecter producteurs et acheteurs en RDC.

## Démarrage local

```bash
cd web
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Comptes de démo (seed)

- Producteur: `+243900000001`
- Acheteur: `+243900000002`
- Admin: `+243900000003`

En développement, le code OTP s'affiche à l'écran après demande de connexion.

## Fonctionnalités MVP implémentées

- Auth OTP téléphone + onboarding rôle
- Catalogue produits + recherche
- Publication annonce (producteur)
- Commande + statuts
- Paiement Mobile Money simulé (endpoint prêt pour intégration réelle)
- Commission plateforme calculée à la commande
- Masquage contact vendeur avant paiement
- Admin minimal (stats + commandes)

## Variables d'environnement

Copie `.env.example` vers `.env` et adapte:

- `DATABASE_URL` (SQLite en dev, PostgreSQL en prod)
- `SESSION_SECRET`
- `PLATFORM_COMMISSION_RATE` (ex: `0.06`)
