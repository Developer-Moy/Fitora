import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB Atlas");

  const User = mongoose.model(
    "User",
    new mongoose.Schema(
      {
        name: String,
        email: String,
        role: String,
        isMasterProtected: Boolean,
      },
      { strict: false },
    ),
  );

  // 1. Update the official Master Admin
  const masterUpdate = await User.findOneAndUpdate(
    { email: "master@fitora.com" },
    {
      $set: {
        name: "Master Admin",
        role: "master_admin",
        isMasterProtected: true,
      },
    },
    { new: true },
  );
  console.log(
    "Master Admin updated:",
    masterUpdate?.name,
    masterUpdate?.email,
    masterUpdate?.role,
  );

  // 2. Demote admin.operations@fitora.com to branch_admin
  const opsUpdate = await User.findOneAndUpdate(
    { email: "admin.operations@fitora.com" },
    {
      $set: {
        name: "Nusrat Jahan (Operations Admin)",
        role: "branch_admin",
        isMasterProtected: false,
      },
    },
    { new: true },
  );
  if (opsUpdate) {
    console.log(
      "Demoted operations admin to branch_admin:",
      opsUpdate.name,
      opsUpdate.email,
      opsUpdate.role,
    );
  }

  // 3. Demote alfaazahmed010@gmail.com to premium_user (plan is Pro Athlete)
  const alfaazUpdate = await User.findOneAndUpdate(
    { email: "alfaazahmed010@gmail.com" },
    {
      $set: {
        role: "premium_user",
        isMasterProtected: false,
      },
    },
    { new: true },
  );
  if (alfaazUpdate) {
    console.log(
      "Demoted Alfaaz to premium_user:",
      alfaazUpdate.name,
      alfaazUpdate.email,
      alfaazUpdate.role,
    );
  }

  // 4. Check for any other user with role: "master_admin" who is not master@fitora.com
  const otherMasters = await User.find({
    role: "master_admin",
    email: { $ne: "master@fitora.com" },
  });

  if (otherMasters.length > 0) {
    console.log(
      `Found ${otherMasters.length} other master admins, demoting them...`,
    );
    for (const u of otherMasters) {
      await User.updateOne(
        { _id: u._id },
        { $set: { role: "branch_admin", isMasterProtected: false } },
      );
      console.log(`Demoted ${u.email} to branch_admin`);
    }
  }

  // 5. Final audit
  const allMasters = await User.find({ role: "master_admin" });
  console.log(`Total Master Admins in DB: ${allMasters.length}`);
  allMasters.forEach((m) => {
    console.log(` - ${m.name} (${m.email}) [role: ${m.role}]`);
  });

  await mongoose.disconnect();
  console.log("Disconnected. Database migration complete.");
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
