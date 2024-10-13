import {Authenticated} from "@/components/authenticated";
import {FileUpload} from "@/components/file-upload";
import {auth} from "@/lib/auth";

import {HomePage} from "@/components/home-page";
import {UserPreferences} from "@/components/user-preferences";

export default async function Home() {
  const session = await auth();

  return (
    <main className="mx-auto flex max-w-3xl flex-col space-y-6 p-6">
      <HomePage />
      <Authenticated>
        <FileUpload />
      </Authenticated>
      {session?.user ? (
        <pre>
          <code>{JSON.stringify({session: session?.user}, null, 2)}</code>
        </pre>
      ) : (
        <p>No Session found, please sign in</p>
      )}
      <UserPreferences />
    </main>
  );
}
