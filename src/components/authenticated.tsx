import {validateRequest} from "@/lib/auth/actions";

interface Props {
  children: React.ReactNode;
}

const UnauthorizedMessage = () => (
  <p className="mb-4 w-fit rounded border-2 border-dashed p-4">
    This is a private piece of content. Please sign in to view.
  </p>
);

export const Authenticated = async ({children}: Props) => {
  const {user} = await validateRequest();

  if (!user) {
    return <UnauthorizedMessage />;
  }

  return <>{children}</>;
};
