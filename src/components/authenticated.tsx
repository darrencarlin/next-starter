import {auth} from "@/lib/auth";

interface Props {
  children: React.ReactNode;
}

const UnauthorizedMessage = () => (
  <p className="mb-4 w-fit border-2 border-dashed p-4">
    This is a private piece of content. Please sign in to view.
  </p>
);

export const Authenticated = async ({children}: Props) => {
  const session = await auth();

  if (!session?.user) {
    return <UnauthorizedMessage />;
  }

  return <>{children}</>;
};
