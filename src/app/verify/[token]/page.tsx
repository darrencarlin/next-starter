import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {fetchApi} from "@/lib/utils";
import {ResponseType} from "@/types";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{token: string}>;
}) {
  const {token} = await params;
  // Verify the token
  const {success, message} = await fetchApi<ResponseType>(
    "/api/verify/token/" + token,
  );

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>{message}</CardTitle>
          <CardDescription>
            {success
              ? "You can now fully access your account"
              : "The token you provided is invalid or has expired"}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
