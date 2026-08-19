// import dns from "node:dns";
// dns.setServers(["1.1.1.1", "1.0.0.1"]);
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/fitora");
const db = client.db('fitora-auth');

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),

    user: {
        additionalFields: {
            preference: {
                type: "string",
                defaultValue: "Maintenance"
            }
        }
    },

    emailAndPassword: {
        enabled: true,
    },

});