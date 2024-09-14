# Connect 9

## Setup

```bash
npm install
```

## Development Server

1. Setup ```.env``` variables.
2. Start the development server on http://localhost:3000  using ```npm run dev```.

## Prisma

Generate Prisma client 

```bash
npx prisma generate
```

Create Prisma migration

```bash
npx prisma migrate dev --name init
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

