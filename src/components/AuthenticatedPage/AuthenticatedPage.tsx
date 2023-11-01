"use client";

import { auth } from "@/firebase/firebase";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingPage from "../Pages/LoadingPage";

type AuthenticatedPageProps = {
  children: React.ReactNode;
  loadingUI?: React.ReactNode;
  childLoading?: boolean;
};

const AuthenticatedPage: React.FC<AuthenticatedPageProps> = ({
  children,
  loadingUI = <LoadingPage />,
  childLoading,
}) => {
  const [user, loading, authError] = useAuthState(auth);
  const shouldRedirect = authError || (!loading && !!!user);

  useEffect(() => {
    if (shouldRedirect) redirect("/auth");
  }, [shouldRedirect]);
  return shouldRedirect || loading || childLoading ? loadingUI : children;
};
export default AuthenticatedPage;
