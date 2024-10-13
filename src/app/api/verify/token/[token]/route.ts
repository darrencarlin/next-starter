import db from "@/lib/db";
import {users, verificationTokens} from "@/lib/db/schema";
import {eq} from "drizzle-orm";
import {NextRequest, NextResponse} from "next/server";

export async function GET(
  request: NextRequest,
  {params}: {params: {token: string}},
) {
  const {token} = params;

  console.log("Verifying token:", token);

  try {
    // Find the verification record matching the provided token
    const t = await db.query.verificationTokens.findFirst({
      where: (table) => eq(table.token, token),
    });

    // If no matching token is found, return an error
    if (!t) {
      return NextResponse.json({
        success: false,
        message: "Invalid token",
      });
    }

    // Check if the token has expired
    if (t.expires < new Date()) {
      // Handle expired token logic here if needed
    }

    // Token is valid, update the user's verified status
    await db
      .update(users)
      .set({emailVerified: new Date(), updatedAt: new Date()})
      .where(eq(users.email, t.identifier));

    // Delete the used verification token
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, t.token));

    // Return success message
    return NextResponse.json({
      success: true,
      message: "User verified successfully",
    });
  } catch (error) {
    // Log and return any errors that occur during the process
    console.error("Error verifying token:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while verifying the token",
    });
  }
}
