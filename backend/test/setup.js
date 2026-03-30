import "dotenv/config";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { afterAll, afterEach, beforeAll } from "vitest";

let mongoServer;
let usingMemoryServer = false;
const testDbName = `fittrack_test_${process.env.VITEST_POOL_ID || process.pid}`;

process.env.SECRET_KEY ??= "test-secret-key";
process.env.REFRESH ??= "test-refresh-secret";
process.env.JWT_VERIFY ??= "test-jwt-verify-secret";
process.env.RESEND_API_KEY ??= "re_test_key";
process.env.RESEND_FROM_EMAIL ??= "test@example.com";
process.env.RESEND_FROM_NAME ??= "FitTrack Tests";

beforeAll(async () => {
  const configuredUri = process.env.TEST_MONGODB_URI || process.env.MONGODB_URI;

  if (configuredUri) {
    await mongoose.connect(configuredUri, { dbName: testDbName });
    return;
  }

  usingMemoryServer = true;
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri);
}, 180000);

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
  }

  await mongoose.disconnect();

  if (usingMemoryServer && mongoServer) {
    await mongoServer.stop();
  }
});
