"use client";

import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {useSearchParams} from "next/navigation";

export const Success = () => {
  // Get the session ID from the URL
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Success</CardTitle>
        <CardDescription>
          Thank you for subscribing! Your session ID is: {sessionId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline">
          <Link href="/profile">Go to profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
