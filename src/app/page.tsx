import {Authenticated} from "@/components/authenticated";
import {FileUpload} from "@/components/file-upload";

import {HomePage} from "@/components/home-page";
import {UserPreferences} from "@/components/user-preferences";

export default async function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col space-y-6 p-6">
      <HomePage />
      <Authenticated>
        <FileUpload />
      </Authenticated>
      <UserPreferences />
    </main>
  );
}
