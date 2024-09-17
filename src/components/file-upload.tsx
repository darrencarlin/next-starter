"use client";

import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useToast} from "@/hooks/use-toast";
import {uploadFile} from "@/lib/r2/actions";
import {getErrorMessage} from "@/lib/utils";
import {fileUploadSchema} from "@/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {Loader2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Video} from "./video";

export const FileUpload = () => {
  const router = useRouter();
  const {toast} = useToast();
  const [isFileSubmitting, setIsFileSubmitting] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof fileUploadSchema>>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const onFileUpload = async (values: z.infer<typeof fileUploadSchema>) => {
    if (!values.file) return;

    setIsFileSubmitting(true);

    const formData = new FormData();
    formData.append("file", values.file);

    try {
      const {success, message, data} = await uploadFile(formData);

      if (success && data?.url) {
        setUrl(data.url);
        // Reset the form, which clears the file input
        formRef.current?.reset();
      }

      toast({
        title: message,
      });
    } catch (error: unknown) {
      console.error(error);
      toast({
        title: getErrorMessage(error),
      });
    } finally {
      setIsFileSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onFileUpload)}
        className="mb-4 flex max-w-3xl items-end gap-4"
      >
        <FormField
          control={form.control}
          name="file"
          render={({field: {onChange, value, ...field}}) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isFileSubmitting || !form.formState.isValid}
        >
          {isFileSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isFileSubmitting ? "Uploading..." : "Upload"}
        </Button>
      </form>

      {url && (
        <Button
          variant="link"
          onClick={() => router.push(url)}
          className="mb-4"
        >
          {url}
        </Button>
      )}

      {url && <Video src={url} />}
    </Form>
  );
};
