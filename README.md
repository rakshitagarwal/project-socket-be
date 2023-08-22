# BIGDEAL

## Table of Contents

-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [ENV Setup](#envsetup)
    -   [Database Migrations](#dbmigration)
    -   [Start Server](#startserver)

## Getting Started

BigDeal is an auction house in which you can create as many auction and player can participate in the auctions and wins the product at very affordable costs.

### Prerequisites

List the software, tools, and technologies that users need to have installed before they can use your project.

-   Node.js (version >=16.0.0)
-   npm (version 9.8.0)
-   postgres (version 14.1.0)
-   redis (version 2.30.0)

### Installation

1. Clone the repository:

    ```bash
    git clone git@bitbucket.org:GlobalVox/bdl_admin_be.git
    cd bdl_admin_be
    ```

### ENV Setup

2. Setup the ENV

    ```bash
    touch .env
    copy .example.env .env
    ```

### Database Migrations

3. Setup the prisma

    ```bash

    # create DB migrations(it will run along with seed)
        npx prisma migrate dev

    # Implement the DB migrations
        npx prisma generate

    # Reset the DB(it will run along with seed)
        npx prisma migrate reset

    # format the `schema.prisma`
        npx prisma format

    # solve the migration problem in PRODUCTION
        npx prisma migrate resolve --applied "MIGRATION_ID"
    ```

### Start Server

4. Starting the Node Server

    ```bash

        # START THE DEVELOPMENT LOCAL SERVER
            npm run start:dev

        # START THE PRODUCTION SERVER
            npm run start:prod

        # VERIFY THE LINT IN SERVER
            npm run lint

        # CREATE BUILD FOR THE SERVER
            npm run build
    ```
