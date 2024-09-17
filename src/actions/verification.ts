import {db} from "@/lib/db";
import {userTable, verificationTable} from "@/lib/db/schema";
import {ResponseType} from "@/types";
import {eq} from "drizzle-orm";

export const verifyToken = async (token: string): Promise<ResponseType> => {
  try {
    // Find the verification record matching the provided token
    const t = await db.query.verificationTable.findFirst({
      where: (table) => eq(table.token, token),
    });

    // If no matching token is found, return an error
    if (!t) {
      return {
        success: false,
        message: "Invalid token",
      };
    }

    // Check if the token has expired
    if (t.expiresAt < new Date()) {
      // Handle expired token logic here if needed
    }

    // Token is valid, update the user's verified status
    await db
      .update(userTable)
      .set({verified: true, updatedAt: new Date()})
      .where(eq(userTable.id, t.userId));

    // Delete the used verification token
    await db.delete(verificationTable).where(eq(verificationTable.id, t.id));

    // Return success message
    return {
      success: true,
      message: "User verified successfully",
    };
  } catch (error) {
    // Log and return any errors that occur during the process
    console.error("Error verifying token:", error);
    return {
      success: false,
      message: "An error occurred while verifying the token",
    };
  }
};
