# BigDeal Admin Panel

## Start server(development)

npm run start:dev

## Start server(Production)

npm run start:prod

## When you pull Code form any branch do following steps

npx prisma migrate dev

npx prisma generate

## When PR merge, migrations for new change

npx prisma migrate reset

npx prisma generate
