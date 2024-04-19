"use server";

import { getNeonDrizzleDb } from "@/lib/database";
import { lockers } from "db/schema";
import { eq } from "drizzle-orm";

/**
 * Update lockers.encryptSessionKey with the serialized session key
 * @param serializedSessionKey
 * @param lockerId
 */
export const saveSessionKey = async (
  serializedSessionKey: string,
  lockerId: number,
) => {
  const db = getNeonDrizzleDb();
  await db
    .update(lockers)
    .set({ encryptedSessionKey: serializedSessionKey })
    .where(eq(lockers.id, lockerId));
};
