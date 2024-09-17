import {verifyToken} from "@/actions/verification";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function VerifyPage({params}: {params: {token: string}}) {
  // Verify the token
  const {success, message} = await verifyToken(params.token);

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
