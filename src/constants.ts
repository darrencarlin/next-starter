export const R2_PUBLIC_URL =
  process.env.NODE_ENV === "production"
    ? "https://pub-72d38359f4494335ba3f1e6c4cea2d81.r2.dev"
    : "https://pub-72d38359f4494335ba3f1e6c4cea2d81.r2.dev";

export const FILE_SIZE_LIMIT = 1024 * 1024 * 100; // 100 MB;

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
