import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { connectDB } from "../config/db";
import Branch from "../models/Branch.model";
import { User } from "../models/User.model";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const divisions: Record<string, string[]> = {
    Dhaka: ["Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur", "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur", "Tangail"],
    Chattogram: ["Bandarban", "Brahmanbaria", "Chandpur", "Chattogram", "Cumilla", "Cox's Bazar", "Feni", "Khagrachhari", "Lakshmipur", "Noakhali", "Rangamati"],
    Rajshahi: ["Bogura", "Chapainawabganj", "Joypurhat", "Naogaon", "Natore", "Pabna", "Rajshahi", "Sirajganj"],
    Khulna: ["Bagerhat", "Chuadanga", "Jashore", "Jhenaidah", "Khulna", "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira"],
    Barishal: ["Barguna", "Barishal", "Bhola", "Jhalokathi", "Patuakhali", "Pirojpur"],
    Sylhet: ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
    Rangpur: ["Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Rangpur", "Thakurgaon"],
    Mymensingh: ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"],
};

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const seed = async () => {
    const defaultPassword = process.env.SEED_DEFAULT_PASSWORD || "Fitora@2026";
    const masterEmail = process.env.SEED_MASTER_EMAIL || "master@fitora.com";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    let branchNumber = 0;
    let memberTotal = 0;

    await User.updateOne(
        { email: masterEmail.toLowerCase() },
        {
            $setOnInsert: {
                name: "Fitora Master Admin",
                email: masterEmail.toLowerCase(),
                passwordHash,
                role: "master_admin",
                plan: "VIP Ultimate",
                status: "active",
                totalPaidBDT: 0,
            },
        },
        { upsert: true },
    );

    for (const [division, districts] of Object.entries(divisions)) {
        for (const district of districts) {
            branchNumber += 1;
            const branchId = `BD-${String(branchNumber).padStart(2, "0")}`;
            const districtSlug = slugify(district);
            const managerEmail = `manager.${districtSlug}@fitora.com`;
            const managerName = `${district} Branch Manager`;
            const memberCount = 18 + ((branchNumber * 7) % 25);

            await Branch.updateOne(
                { branchId },
                {
                    $set: {
                        name: `Fitora ${district} Branch`,
                        division,
                        district,
                        address: `Main Fitness Avenue, ${district}, Bangladesh`,
                        managerName,
                        managerEmail,
                        managerPhone: `+880 1700-${String(100000 + branchNumber).slice(-6)}`,
                        maxCapacity: 250 + ((branchNumber * 13) % 251),
                        status: "active",
                    },
                },
                { upsert: true },
            );

            await User.updateOne(
                { email: managerEmail },
                {
                    $set: { name: managerName, assignedBranch: branchId, role: "branch_admin", status: "active" },
                    $setOnInsert: { email: managerEmail, passwordHash, plan: "Pro Athlete", totalPaidBDT: 0 },
                },
                { upsert: true },
            );

            for (let memberNumber = 1; memberNumber <= memberCount; memberNumber += 1) {
                const memberEmail = `member.${districtSlug}.${memberNumber}@seed.fitora.com`;
                await User.updateOne(
                    { email: memberEmail },
                    {
                        $set: { name: `${district} Athlete ${memberNumber}`, assignedBranch: branchId, role: "athlete", status: "active" },
                        $setOnInsert: { email: memberEmail, passwordHash, plan: memberNumber % 5 === 0 ? "Pro Athlete" : "Basic Pass", totalPaidBDT: memberNumber % 5 === 0 ? 2500 : 1200 },
                    },
                    { upsert: true },
                );
            }
            memberTotal += memberCount;
        }
    }

    console.log(`[Seeder] Seeded ${branchNumber} branches across ${Object.keys(divisions).length} divisions with ${memberTotal} athletes.`);
    console.log(`[Seeder] Master login: ${masterEmail} / ${defaultPassword}`);
    console.log("[Seeder] Branch manager login pattern: manager.<district-slug>@fitora.com / configured seed password");
};

const run = async () => {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
        throw new Error("MongoDB connection is required to run the seeder");
    }
    await seed();
    await mongoose.disconnect();
};

run().catch(async (error) => {
    console.error("[Seeder] Failed:", error);
    await mongoose.disconnect();
    process.exitCode = 1;
});
