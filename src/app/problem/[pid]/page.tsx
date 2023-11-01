"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthenticatedPage from "@/components/AuthenticatedPage/AuthenticatedPage";
import Workspace from "@/components/Workspace/Workspace";
import { auth } from "@/firebase/firebase";
import useHasMounted from "@/hooks/useHasMounted";
import { getFormattedProblem } from "@/utils/functions/dataFetchers";
import { TFormattedQuestion } from "@/utils/types/question";

type ProblemPageProps = {
  params: {
    pid: string;
  };
};

const ProblemPage: React.FC<ProblemPageProps> = ({ params }) => {
  const hasMounted = useHasMounted();
  const [problem, setProblem] = useState<TFormattedQuestion>();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = decodeURIComponent(params.pid);
    const uid = user?.uid;
    if (uid && !!!problem)
      fetchData(id, uid).then((fetchedProblem) => {
        if (fetchedProblem) {
          setProblem(fetchedProblem);
          setLoading(false);
        }
      });
  }, [user]);

  return (
    <AuthenticatedPage childLoading={!hasMounted || !!!problem || loading}>
      <Workspace problem={problem as TFormattedQuestion} />
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
