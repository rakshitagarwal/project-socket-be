import { PrismaClient } from "@prisma/client";
import fs from "fs";
async function startSeed() {
    const prismaClient = new PrismaClient();
    const roles = await prismaClient.masterRole.findMany({});
    const productCategory = await prismaClient.masterAuctionCategory.findMany(
        {}
    );
    const auctionCategory = await prismaClient.masterAuctionCategory.findMany(
        {}
    );
    const countryDetails = await prismaClient.countries.findMany({});
    const users = await prismaClient.user.findMany({});
    if (
        !roles.length &&
        !productCategory.length &&
        !auctionCategory.length &&
        !users.length &&
        !countryDetails.length
    ) {
        const countries = JSON.parse(
            fs.readFileSync("assets/data/countries.json") as unknown as string
        );

        await prismaClient.countries.createMany({ data: countries });
        await prismaClient.masterRole.createMany({
            data: [
                {
                    title: "Admin",
                },
                {
                    title: "Player",
                },
            ],
        });
        const roleAdmin = await prismaClient.masterRole.findFirst({
            where: {
                title: "Admin",
            },
        });
        await prismaClient.masterProductCategory.create({
            data: {
                title: "Mobile & Accessories",
            },
        });
        await prismaClient.masterAuctionCategory.create({
            data: {
                title: "English action",
            },
        });
        await prismaClient.user.create({
            data: {
                first_name: "admin",
                last_name: "admin",
                email: "admin929@yopmail.com",
                password: "$2b$10$IR35ignf5e9DJuRQkrYhP.okwg0nOC1sUgzL3reshqQ4QUeemcPB6",
                referral_code: "admin23",
                country: "India",
                is_verified: true,
                avatar: "assets/avatar/1.png",
                role_id: roleAdmin?.id as string,
            },
        });
        return "Db Seeding Compeleted.";
    }
    return "Db Already Seeded";
}

startSeed()
    .then((msg) => {
        console.log(msg);
    })
    .catch((error) => {
        console.log(error);
    });
