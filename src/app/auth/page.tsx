"use client";

import { authPageState } from "@/atoms/authModalAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Typography } from "@mui/material";
import Login from "@/components/Auth/Login";
import Signup from "@/components/Auth/Signup";
import ResetPassword from "@/components/Auth/ResetPassword";
import CircularProgress from "@mui/material/CircularProgress";

type AuthPageProps = {};

const AuthPage: React.FC<AuthPageProps> = () => {
  const authPage = useRecoilValue(authPageState);
  const [user, loading, error] = useAuthState(auth);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (user) redirect("/");
    if (!loading && !user) setPageLoading(false);
  }, [user, loading]);

  if (pageLoading) return null;

  return (
    <div className="max-w-[1440px] mx-auto flex w-full grow">
      <div className="w-full sm:w-1/2 bg-slate-50 flex flex-col justify-center items-center p-4">
        {authPage == "login" ? (
          <Login />
        ) : authPage == "register" ? (
          <Signup />
        ) : (
          <ResetPassword />
        )}
      </div>
      <div className="w-1/2 bg-slate-800 hidden sm:flex flex-col items-center justify-center p-4 rounded-lg">
        <Image
          src={"/hi-image.png"}
          alt={"Hero Image"}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "75%", height: "auto" }} // optional
          className="mb-5"
        />
        <div>
          <Typography color={"white"} variant="h5">
            Welcome to Code Korbo
          </Typography>
          <Typography color={"white"} fontWeight={200}>
            Practice coding and be the best version of yourself
          </Typography>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
