import {Button} from "@/components/ui/button";
import {validateRequest} from "@/lib/auth/actions";
import {Home, User} from "lucide-react";
import Link from "next/link";
import React from "react";
import {SignOutButton} from "./sign-out";
import {ThemeSwitcher} from "./theme-changer";

interface Props {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
}

const NavButton = ({href, icon: Icon, label}: Props) => (
  <Link href={href}>
    <Button variant="outline" size="icon" aria-label={label}>
      <Icon size={16} />
    </Button>
  </Link>
);

const AuthButtons = () => (
  <>
    <Link href="/sign-in">
      <Button variant="outline">Sign In</Button>
    </Link>
    <Link href="/sign-up">
      <Button variant="outline">Sign Up</Button>
    </Link>
  </>
);

export const Navigation = async () => {
  const {user} = await validateRequest();

  return (
    <nav className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <NavButton href="/" icon={Home} label="Home" />
        <ThemeSwitcher />
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <NavButton href="/profile" icon={User} label="Profile" />
            <SignOutButton />
          </>
        ) : (
          <AuthButtons />
        )}
      </div>
    </nav>
  );
};

export default Navigation;
