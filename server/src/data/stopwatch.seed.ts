import { StopwatchPreset } from "../models/StopwatchPreset.model";

/**
 * Seed default public stopwatch presets
 * Public presets don't require a userId since they're system-wide
 */
export const seedStopwatchPresets = async () => {
  try {
    const existingCount = await StopwatchPreset.countDocuments({ isPublic: true });

    if (existingCount > 0) {
      console.log(`[Stopwatch Seed] ${existingCount} public presets already exist. Skipping seed.`);
      return;
    }

    // Create a system user ID for public presets (or use null userId for system presets)
    // Using a special system ObjectId for public presets
    const systemUserId = "000000000000000000000000";

    const defaultPresets = [
      {
        userId: systemUserId,
        name: "Tabata",
        workDuration: 20,
        restDuration: 10,
        rounds: 8,
        warmupDuration: 0,
        cooldownDuration: 0,
        type: "HIIT",
        isPublic: true,
      },
      {
        userId: systemUserId,
        name: "Boxing",
        workDuration: 180,
        restDuration: 60,
        rounds: 5,
        warmupDuration: 0,
        cooldownDuration: 0,
        type: "Boxing",
        isPublic: true,
      },
      {
        userId: systemUserId,
        name: "Rest 60s",
        workDuration: 60,
        restDuration: 0,
        rounds: 1,
        warmupDuration: 0,
        cooldownDuration: 0,
        type: "Rest",
        isPublic: true,
      },
      {
        userId: systemUserId,
        name: "Rest 90s",
        workDuration: 90,
        restDuration: 0,
        rounds: 1,
        warmupDuration: 0,
        cooldownDuration: 0,
        type: "Rest",
        isPublic: true,
      },
      {
        userId: systemUserId,
        name: "Rest 120s",
        workDuration: 120,
        restDuration: 0,
        rounds: 1,
        warmupDuration: 0,
        cooldownDuration: 0,
        type: "Rest",
        isPublic: true,
      },
    ];

    await StopwatchPreset.insertMany(defaultPresets);
    console.log(`[Stopwatch Seed] Successfully seeded ${defaultPresets.length} public presets`);
  } catch (error) {
    console.error("[Stopwatch Seed] Error seeding presets:", error);
  }
};
