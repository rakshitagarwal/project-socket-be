import { PrismaClient } from "@prisma/client";

async function startSeed() {
    const prismaClient = new PrismaClient();
    const roles = await prismaClient.masterRole.findMany({});
    const productCategory = await prismaClient.masterAuctionCategory.findMany(
        {}
    );
    const auctionCategory = await prismaClient.masterAuctionCategory.findMany(
        {}
    );
    const users = await prismaClient.user.findMany({});
    if (
        !roles.length &&
        !productCategory.length &&
        !auctionCategory.length &&
        !users.length
    ) {
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
                password: "admin@12345",
                country: "India",
                is_verified:true,
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
