"use client";

import { auth } from "@/firebase/firebase";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/Pages/LoadingPage";
import { Typography } from "@mui/material";
import ErrorPage from "@/components/Pages/ErrorPage";

export default function Home() {
  const [user, loading, authError] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) redirect("/auth");
  }, [user, loading]);

  if (loading) {
    return <LoadingPage />;
  }
  if (authError) {
    return (
      <ErrorPage
        title="Oops, an error occurred!"
        subtitle={authError.message}
      />
    );
  }

  return (
    <div className="flex w-full grow flex-col">
      <Typography variant="h3" align="center" mx={2} mt={5}>
        Practice Kar Le Bhai!!!
      </Typography>
      <div className="relative overflow-x-auto mx-auto px-6 pb-10 w-full h-full">
        {/* Questions table will come here */}
      </div>
    </div>
  );
}
