"use client";

import ErrorPage from "@/components/Pages/ErrorPage";

export default function Error() {
  return (
    <ErrorPage
      title="Oops, an error has occurred!"
      subtitle="Please try again later."
      imageUrl="/404-error.png"
    />
  );
}
