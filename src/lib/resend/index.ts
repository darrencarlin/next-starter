import {Resend} from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is required");
}

if (!process.env.RESEND_EMAIL_ADDRESS) {
  throw new Error("RESEND_EMAIL_ADDRESS is required");
}

export const resend = new Resend(process.env.RESEND_API_KEY);
