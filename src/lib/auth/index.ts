import {VerificationEmail} from "@/emails/verification";
import {prisma} from "@/lib/db";

import {resend} from "@/lib/resend";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {nanoid} from "nanoid";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const {handlers, auth, signIn, signOut} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "database",
  },
  events: {
    createUser: async ({user}) => {
      if (!user.email) {
        console.error("No email address provided for new user");
        return;
      }

      console.log("createUser", user);

      const identifier = user.email;

      console.log("identifier", identifier);

      if (!identifier) {
        console.log(user.email, user);
        console.error("No email address provided for new user");
        return;
      }
      // Create a verification token
      const token = nanoid();
      // Insert the token into the database

      await prisma.verificationToken.create({
        data: {
          identifier,
          token: token,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
        },
      });

      // Send verification email
      const {error: emailError} = await resend.emails.send({
        from: `Next Starter <${process.env.RESEND_EMAIL_ADDRESS}>`,
        to: user.email,
        subject: "Verify your email address",
        react: VerificationEmail({token: token}),
      });
      // Log any errors
      if (emailError) {
        console.error("Error sending email:", emailError);
        return;
      }
    },
  },
  callbacks: {
    session({session, user}) {
      return {
        ...session,
        user: {
          ...session.user,
          ...user, // Add the user object from DB to the session
        },
      };
    },
  },
});
