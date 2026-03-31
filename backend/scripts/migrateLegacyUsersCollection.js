import "dotenv/config";
import mongoose from "mongoose";

const legacyCollectionName = "Registeration Data";
const targetCollectionName = "users";
const dbName = process.env.MONGODB_DB_NAME;

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

async function migrateLegacyUsersCollection() {
  await mongoose.connect(
    process.env.MONGODB_URI,
    dbName ? { dbName } : undefined,
  );

  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const hasLegacyCollection = collections.some(
      (collection) => collection.name === legacyCollectionName,
    );

    if (!hasLegacyCollection) {
      console.log("No legacy user collection found. Nothing to migrate.");
      return;
    }

    const legacyUsers = await db
      .collection(legacyCollectionName)
      .find({})
      .toArray();

    if (legacyUsers.length === 0) {
      console.log("Legacy user collection is empty. Nothing to migrate.");
      return;
    }

    const targetCollection = db.collection(targetCollectionName);

    for (const legacyUser of legacyUsers) {
      const { _id, ...legacyUserWithoutId } = legacyUser;
      const normalizedEmail = legacyUser.email?.trim().toLowerCase();

      if (!normalizedEmail) {
        continue;
      }

      await targetCollection.updateOne(
        { email: normalizedEmail },
        {
          $set: {
            ...legacyUserWithoutId,
            email: normalizedEmail,
          },
        },
        { upsert: true },
      );
    }

    console.log(
      `Migrated ${legacyUsers.length} user record(s) from "${legacyCollectionName}" to "${targetCollectionName}".`,
    );
  } finally {
    await mongoose.disconnect();
  }
}

migrateLegacyUsersCollection().catch((error) => {
  console.error("Legacy user migration failed:", error);
  process.exit(1);
});
