"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";
import { LogOut } from "lucide-react";

export const SignOutButton = () => {
  return (
    <Button
      variant="outline"
      size="icon"
      type="button"
      onClick={async () => {
        await signOut();
      }}
    >
      <LogOut size={16} />
    </Button>
  );
};
