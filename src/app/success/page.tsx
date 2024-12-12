import {Success} from "@/components/success";
import {auth} from "@/lib/auth";

import {redirect} from "next/navigation";

export default async function SuccessPage() {
  const session = await auth();

  // Redirect to the home page if the user is not signed in
  if (!session?.user) {
    return redirect("/");
  }

  return (
    <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4">
      <Success />
    </div>
  );
}
