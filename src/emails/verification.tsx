import { Button, Html, Heading, Text, Font } from "@react-email/components";
import Head from "next/head";
import * as React from "react";

interface Props {
  token: string;
}

export const VerificationEmail = async ({ token }: Props) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Heading as="h1">Thank you for signing up</Heading>
      <Text>
        Click the link below to verify your email address and start using our
        service.
      </Text>
      <Button
        href={
          process.env.NODE_ENV === "development"
            ? `http://localhost:3000/verify/${token}`
            : `${process.env.BASE_URL}/verify/${token}`
        }
      >
        Verify Email
      </Button>
    </Html>
  );
};
