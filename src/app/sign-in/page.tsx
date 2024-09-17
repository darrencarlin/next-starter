import {SignInForm} from "@/components/sign-in";
import {validateRequest} from "@/lib/auth/actions";
import {redirect} from "next/navigation";

export default async function SignUpPage() {
  const {user} = await validateRequest();

  // Redirect to the home page if the user is already signed in
  if (user) {
    return redirect("/");
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <SignInForm />
    </div>
  );
}
