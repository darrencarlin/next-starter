import {Button} from "@/components/ui/button";
import {auth, signIn, signOut} from "@/lib/auth";
import {Home, LogOut, User} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {GoogleIcon} from "./svg-icons/google-icon";
import {ThemeSwitcher} from "./theme-changer";

interface Props {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  avatar?: string;
}

const NavButton = ({href, icon: Icon, label, avatar}: Props) => {
  if (avatar) {
    return (
      <Link href={href} aria-label={label}>
        <Image
          src={avatar}
          alt="Avatar"
          width={100}
          height={100}
          className="size-8 rounded-full"
        />
      </Link>
    );
  }

  return (
    <Link href={href}>
      <Button variant="outline" size="icon" aria-label={label}>
        <Icon size={16} />
      </Button>
    </Link>
  );
};

export const SignOutButton = () => (
  <form
    action={async () => {
      "use server";
      await signOut();
    }}
  >
    <Button type="submit" variant="outline" size="icon" aria-label="Sign Out">
      <LogOut size={16} />
    </Button>
  </form>
);

const SignInButton = () => (
  <>
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button
        className="flex w-fit gap-2 p-2"
        variant="outline"
        size="icon"
        type="submit"
        aria-label="Signin with Google"
      >
        Google <GoogleIcon />
      </Button>
    </form>
  </>
);

export const Navigation = async () => {
  const session = await auth();
  return (
    <nav className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <NavButton href="/" icon={Home} label="Home" />
        <ThemeSwitcher />
      </div>
      <div className="flex items-center gap-4">
        {session?.user ? (
          <>
            <NavButton
              href="/profile"
              icon={User}
              label="Profile"
              avatar={session.user.image ?? undefined}
            />
            <SignOutButton />
          </>
        ) : (
          <SignInButton />
        )}
      </div>
    </nav>
  );
};

export default Navigation;
