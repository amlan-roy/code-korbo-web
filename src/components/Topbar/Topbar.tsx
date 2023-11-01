import { auth } from "@/firebase/firebase";
import React, { useEffect, useState } from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import Navbar from "../Navbar/Navbar";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ReorderIcon from "@mui/icons-material/Reorder";
import { useRouter, useParams } from "next/navigation";
import { User } from "firebase/auth";
import { TFormattedQuestion } from "@/utils/types/question";
import { getFormattedProblems } from "@/utils/functions/dataFetchers";
import IconButton from "@mui/material/IconButton";
import Timer from "@/components/Timer/Timer";

type TopbarProps = {
  problemPage?: boolean;
};

/**
 * Component that is used to render the topbar and contains the logic
 *
 * @param problemPage : Boolean that decides if the component is used in problems page or not
 */
const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const TimerComponent = user && problemPage && <Timer />;

  return (
    <Navbar
      handleLogout={signOut}
      isLoggedIn={!!user}
      centerComponent={problemPage && <ToggleProblemsComponent user={user} />}
      userName={user?.displayName}
      rightComponent={TimerComponent}
    />
  );
};

const ToggleProblemsComponent = ({ user }: { user?: User | null }) => {
  const router = useRouter();
  const params = useParams();

  const [fetchedProblems, setFetchedProblems] = useState<
    TFormattedQuestion[] | undefined | null
  >(null);

  useEffect(() => {
    user &&
      getFormattedProblems(user.uid)
        .then((formattedProblems) => setFetchedProblems(formattedProblems))
        .catch(() => {
          setFetchedProblems(undefined);
          throw Error("Problem in fetching questions");
        });
  }, [user]);

  const handleProblemChange = (isForward: boolean) => {
    if (!fetchedProblems) return;
    const currProbIndex = fetchedProblems.findIndex(
      (prob) => prob.id === decodeURIComponent(params.pid as string)
    );
    const problemsList = [...fetchedProblems].slice(0, 10);
    const direction = isForward ? 1 : -1;

    const nextProblemIndex =
      currProbIndex > problemsList.length || currProbIndex < 0
        ? 0 + direction
        : currProbIndex + direction;

    const nextProblem = problemsList[nextProblemIndex];
    if (nextProblem) {
      router.push(`/problem/${nextProblem.id}`);
    }
  };

  return (
    user &&
    fetchedProblems && (
      <div className="flex items-center gap-4 flex-1 justify-center">
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => handleProblemChange(false)}
          edge="end"
        >
          <ChevronLeftIcon />
        </IconButton>
        <div className="flex items-center gap-2 font-medium max-w-[170px] text-dark-layer-2">
          <div>
            <ReorderIcon />
          </div>
          <p>Problem List</p>
        </div>
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => handleProblemChange(true)}
          edge="end"
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    )
  );
};

export default Topbar;
