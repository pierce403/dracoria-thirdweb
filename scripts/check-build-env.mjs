if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID?.trim()) {
  throw new Error("NEXT_PUBLIC_THIRDWEB_CLIENT_ID is required for the frontend build");
}
