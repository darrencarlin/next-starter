"use client";

import {useAppSelector} from "@/lib/store/hooks";

export const Loading = () => {
  const {isLoading} = useAppSelector((state) => state.app);

  if (!isLoading) {
    return null;
  }

  return <div className="loader fixed bottom-4 right-4" />;
};
