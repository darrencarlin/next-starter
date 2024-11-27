"use client";

import {Button} from "@/components/ui/button";
import {useAppDispatch, useAppSelector} from "@/lib/store/hooks";
import {setLoading} from "@/lib/store/slices/app-slice";

export const UserPreferences = () => {
  const dispatch = useAppDispatch();
  const app = useAppSelector((state) => state.app);

  return (
    <div className="flex flex-col">
      <pre className="mb-4 bg-neutral-100 p-4 dark:bg-neutral-900">
        <code>{JSON.stringify({app}, null, 2)}</code>
      </pre>
      <Button
        className="w-fit"
        onClick={() => dispatch(setLoading(!app.isLoading))}
      >
        Toggle Loading
      </Button>
    </div>
  );
};
