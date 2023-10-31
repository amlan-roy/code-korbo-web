import "./globals.css";

import ErrorPage from "@/components/Pages/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage
      title="Page Not Found"
      subtitle="Hey, please check the url that you've entered."
    />
  );
}
