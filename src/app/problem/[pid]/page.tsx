"use client";

import AuthenticatedPage from "@/components/AuthenticatedPage/AuthenticatedPage";
import { auth } from "@/firebase/firebase";
import { getFormattedProblem } from "@/utils/functions/dataFetchers";
import { TFormattedQuestion } from "@/utils/types/question";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type ProblemPageProps = {
  params: {
    pid: string;
  };
};

const ProblemPage: React.FC<ProblemPageProps> = ({ params }) => {
  const [problem, setProblem] = useState<TFormattedQuestion>();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const id = decodeURIComponent(params.pid);
    const uid = user?.uid;
    if (uid && !!!problem)
      fetchData(id, uid).then((fetchedProblem) => {
        fetchedProblem && setProblem(fetchedProblem);
      });
  }, [user]);

  return (
    <AuthenticatedPage>
      <div className="flex w-full grow flex-col">Problems Page</div>;
    </AuthenticatedPage>
  );
};
export default ProblemPage;

async function fetchData(pid: string, uid?: string) {
  const problem = await getFormattedProblem(pid, uid);

  if (!problem) {
    return;
  }

  //decoding the base64 string to ascii string
  problem.solutions = problem.solutions.map(
    ({ handlerFunction, starterCode, ...rest }) => {
      return {
        handlerFunction: window.atob(handlerFunction ?? ""),
        starterCode: window.atob(starterCode ?? ""),
        ...rest,
      };
    }
  );

  return problem;
}
