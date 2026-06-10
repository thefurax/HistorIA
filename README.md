# HistorIA Backend

MVP du backend HistorIA.

## Cartographie HistorIA

HistorIA utilise des `MapPreset` pour définir le contexte géographique et temporel.

### Sources cartographiques étudiées

| Source | Utilité | Licence |
| :--- | :--- | :--- |
| **Natural Earth** | Carte de base mondiale | Domaine Public |
| **geoBoundaries** | Frontières administratives | CC BY 4.0 |
| **OpenHistoricalMap** | Frontières historiques | CC BY-SA |

## Installation

```bash
npm install
docker compose up -d
npx prisma migrate dev
npx prisma db seed
npm run dev
npm test
```
