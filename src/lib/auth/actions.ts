"use server";

import {VerificationEmail} from "@/emails/verification";
import {db} from "@/lib/db";
import {userTable, verificationTable} from "@/lib/db/schema";
import {resend} from "@/lib/resend";
import {getErrorMessage} from "@/lib/utils";
import {ResponseType} from "@/types/";
import {SignInSchema, SignUpSchema} from "@/types/form-schemas";
import * as argon2 from "argon2";
import {eq} from "drizzle-orm";
import {Session, User} from "lucia";
import {nanoid} from "nanoid";
import {cookies} from "next/headers";
import {cache} from "react";
import {z} from "zod";
import {lucia} from ".";

export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId)
    return {
      user: null,
      session: null,
    };

  const {user, session} = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }
  return {
    user,
    session,
  };
});

export const signUp = async (
  values: z.infer<typeof SignUpSchema>,
): Promise<
  ResponseType<
    | {userId: string; session: Session; user: User | null}
    | {userId: string; session: null; user: null}
  >
> => {
  try {
    // Validate input
    SignUpSchema.parse(values);

    const existingUser = await db.query.userTable.findFirst({
      where: (table) => eq(table.email, values.email),
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email already in use, please sign in",
        data: {
          userId: "",
          session: null,
          user: null,
        },
      };
    }

    const hashedPassword = await argon2.hash(values.password);
    const userId = nanoid(15);
    const verificationToken = nanoid(); // Verification token

    // Insert user
    await db.insert(userTable).values({
      id: userId,
      email: values.email,
      hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create session
    const session = await lucia.createSession(userId, {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    const {user} = await validateRequest();

    // Create verification token

    await db.insert(verificationTable).values({
      userId,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    });

    // Send verification email
    const {error: emailError} = await resend.emails.send({
      from: `Next Starter <${process.env.RESEND_EMAIL_ADDRESS}>`,
      to: values.email,
      subject: "Verify your email address",
      react: VerificationEmail({token: verificationToken}),
    });

    if (emailError) {
      console.error("Failed to send verification email:", emailError);
      return {
        success: true,
        data: {userId, session, user},
        message:
          "User created, but failed to send verification email. Please try to resend the verification email later.",
      };
    }

    return {
      success: true,
      data: {userId, session, user},
      message: "Account created successfully, please verify your email",
    };
  } catch (error) {
    console.error("Error during sign up:", error);

    return {
      success: false,
      message: getErrorMessage(error),
      data: {
        userId: "",
        session: null,
        user: null,
      },
    };
  }
};

export const signIn = async (
  values: z.infer<typeof SignInSchema>,
): Promise<
  ResponseType<
    | {userId: string; session: Session; user: User | null}
    | {userId: ""; session: null; user: null}
    | void
  >
> => {
  try {
    // Validate input
    SignInSchema.parse(values);

    const existingUser = await db.query.userTable.findFirst({
      where: (table) => eq(table.email, values.email),
    });

    if (!existingUser || !existingUser.hashedPassword) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    const isValidPassword = await argon2.verify(
      existingUser.hashedPassword,
      values.password,
    );

    if (!isValidPassword) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Create session
    const session = await lucia.createSession(existingUser.id, {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    const {user} = await validateRequest();

    return {
      success: true,
      message: "Logged in successfully",
      data: {
        userId: existingUser.id,
        session,
        user,
      },
    };
  } catch (error) {
    console.error("Error during sign in:", error);
    return {
      success: false,
      message: getErrorMessage(error),
      data: {
        userId: "",
        session: null,
        user: null,
      },
    };
  }
};

export const signOut = async (): Promise<ResponseType> => {
  try {
    const {session} = await validateRequest();

    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};
