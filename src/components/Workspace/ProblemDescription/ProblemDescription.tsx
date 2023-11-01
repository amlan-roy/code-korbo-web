import { auth, firestore } from "@/firebase/firebase";
import { fetchUserData, isProblemSolved } from "@/utils/functions/dataFetchers";
import { TFormattedQuestion, TQuestionDB } from "@/utils/types/question";
import { TUserDB } from "@/utils/types/user";
import { Typography } from "@mui/material";
import {
  arrayRemove,
  arrayUnion,
  doc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import ProblemFeedbacks from "./ProblemFeedbacks";
import Image from "next/image";

//TODO: Fix th like, dislike and star logic for the problems

type ProblemDescriptionProps = {
  problem: TFormattedQuestion;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  const [user] = useAuthState(auth);

  const [currentProblem, setCurrentProblem] = useState<
    TFormattedQuestion | undefined
  >(problem);

  const { likedState, dislikedState, solvedState, starredState } =
    useUserFeedback(problem.id);

  /**
   *
   * @param transaction : A set of read and write operations on one or more documents.
   * @returns {
   *  userDoc :  A DocumentSnapshot with the read data of the user's data
   *  problemsDoc : A DocumentSnapshot with the read data of the user's data
   *  userRef : DocumentReference instance that refers to the document at the specified absolute path of the user's data
   *  problemsRef : DocumentReference instance that refers to the document at the specified absolute path of the current Problem
   * }
   */
  const returnUserDataAndProblemData = async (transaction: any) => {
    const userRef = doc(firestore, "users", user!.uid);
    const problemsRef = doc(firestore, "commonInfo", "problems");
    const userDoc = await transaction.get(userRef);
    const problemsDoc = await transaction.get(problemsRef);
    return {
      userDoc,
      problemsDoc,
      userRef,
      problemsRef,
    };
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to like a problem", {
        position: "top-left",
        theme: "dark",
      });
      return;
    }

    // if likes loading, then do nothing
    if (likedState.loading) return;
    // else, set likes loading
    likedState.setState((prev) => ({ ...prev, loading: true }));

    //if dislike state is selected, set it loading
    if (dislikedState.selected)
      dislikedState.setState((prev) => ({ ...prev, loading: true }));

    /**
     *  Transaction: A set of read and write operations on one or more documents.
     *
     */
    await runTransaction(firestore, async (transaction) => {
      const { problemsDoc, userDoc, problemsRef, userRef } =
        await returnUserDataAndProblemData(transaction);

      const problemsDocData: TQuestionDB = problemsDoc.data().data;
      const userDocData: TUserDB = userDoc.data();

      if (userDoc.exists() && problemsDoc.exists() && problemsDocData) {
        if (likedState.selected) {
          // If problem is already liked

          // remove problem id from likedProblems on user document,
          transaction.update(userRef, {
            likedProblems: userDocData.likedProblems?.filter(
              (id: string) => id !== problem.id
            ),
          });

          // decrement likes on problem document
          const oldProblemsData = [...problemsDoc.data().data] as TQuestionDB[];
          const problemElemIndex = oldProblemsData.findIndex(
            (probData) => probData.id === problem.id
          );
          const newProblemElem = {
            ...oldProblemsData[problemElemIndex],
            likes: (oldProblemsData[problemElemIndex].likes || 1) - 1,
          };
          const newProblemsData: TQuestionDB[] = [...oldProblemsData];
          newProblemsData[problemElemIndex] = newProblemElem;

          transaction.update(problemsRef, { data: [...newProblemsData] });
          //

          // update the likes count of the local problems state
          setCurrentProblem((prev) =>
            prev
              ? { ...prev, likes: prev.likes ? prev.likes - 1 : 0 }
              : undefined
          );

          // set local state of liked to false and it's loading state as false
          likedState.setState((prev) => ({
            ...prev,
            selected: false,
            loading: false,
          }));
        } else if (dislikedState.selected) {
          // If problem is disliked
          // remove problem id from dislikedProblems and add problem id on likedProblems on user document
          transaction.update(userRef, {
            likedProblems: [...(userDocData.likedProblems || []), problem.id],
            dislikedProblems: userDocData.dislikedProblems?.filter(
              (id: string) => id !== problem.id
            ),
          });

          // decrement dislikes and increment likes on problem document
          const oldProblemsData = [...problemsDoc.data().data] as TQuestionDB[];
          const problemElemIndex = oldProblemsData.findIndex(
            (probData) => probData.id === problem.id
          );
          const newProblemElem = {
            ...oldProblemsData[problemElemIndex],
            likes: (oldProblemsData[problemElemIndex].likes || 0) + 1,
            dislikes: (oldProblemsData[problemElemIndex].dislikes || 1) - 1,
          };
          const newProblemsData: TQuestionDB[] = [...oldProblemsData];
          newProblemsData[problemElemIndex] = newProblemElem;
          transaction.update(problemsRef, { data: [...newProblemsData] });

          // update the likes and dislikes of the local problems state
          setCurrentProblem((prev) =>
            prev
              ? {
                  ...prev,
                  likes: prev.likes ? prev.likes + 1 : 1,
                  dislikes:
                    prev.dislikes && prev.dislikes > 0 ? prev.dislikes - 1 : 0,
                }
              : undefined
          );

          dislikedState.setState((prev) => ({
            ...prev,
            selected: false,
            loading: false,
          }));
          likedState.setState((prev) => ({
            ...prev,
            selected: true,
            loading: false,
          }));
        } else {
          transaction.update(userRef, {
            likedProblems: [...(userDocData.likedProblems || []), problem.id],
          });

          const oldProblemsData = [...problemsDoc.data().data] as TQuestionDB[];
          const problemElemIndex = oldProblemsData.findIndex(
            (probData) => probData.id === problem.id
          );
          const newProblemElem = {
            ...oldProblemsData[problemElemIndex],
            likes: (oldProblemsData[problemElemIndex].likes || 0) + 1,
          };
          const newProblemsData: TQuestionDB[] = [...oldProblemsData];
          newProblemsData[problemElemIndex] = newProblemElem;
          transaction.update(problemsRef, { data: [...newProblemsData] });

          setCurrentProblem((prev) =>
            prev
              ? { ...prev, likes: prev.likes ? prev.likes + 1 : 1 }
              : undefined
          );
          likedState.setState((prev) => ({
            ...prev,
            selected: true,
            loading: false,
          }));
        }
      }
    });
  };

  const handleDislike = async () => {
    if (!user) {
      toast.error("You must be logged in to dislike a problem", {
        position: "top-left",
        theme: "dark",
      });
      return;
    }

    // if dislikes loading, then do nothing
    // else, set dislikes loading
    if (dislikedState.loading) return;
    dislikedState.setState((prev) => ({ ...prev, loading: true }));
    if (likedState.selected)
      likedState.setState((prev) => ({ ...prev, loading: true }));

    await runTransaction(firestore, async (transaction) => {
      const { problemsDoc, userDoc, problemsRef, userRef } =
        await returnUserDataAndProblemData(transaction);

      const problemsDocData: TQuestionDB = problemsDoc.data().data;
      const userDocData: TUserDB = userDoc.data();

      if (userDoc.exists() && problemsDoc.exists() && problemsDocData) {
        // already disliked, already liked, not disliked or liked
        if (dislikedState.selected) {
          transaction.update(userRef, {
            dislikedProblems: userDoc
              .data()
              .dislikedProblems.filter((id: string) => id !== problem.id),
          });
          const oldProblemsData = [...problemsDoc.data().data] as TQuestionDB[];
          const problemElemIndex = oldProblemsData.findIndex(
            (probData) => probData.id === problem.id
          );
          const newProblemElem = {
            ...oldProblemsData[problemElemIndex],
            dislikes: (oldProblemsData[problemElemIndex].dislikes || 0) + 1,
          };
          const newProblemsData: TQuestionDB[] = [...oldProblemsData];
          newProblemsData[problemElemIndex] = newProblemElem;
          transaction.update(problemsRef, { data: [...newProblemsData] });
          setCurrentProblem((prev) =>
            prev
              ? {
                  ...prev,
                  dislikes:
                    prev.dislikes && prev.dislikes > 0 ? prev.dislikes - 1 : 0,
                }
              : undefined
          );
          dislikedState.setState((prev) => ({
            ...prev,
            selected: false,
            loading: false,
          }));
        } else if (likedState.selected) {
          transaction.update(userRef, {
            dislikedProblems: [
              ...(userDocData.dislikedProblems || []),
              problem.id,
            ],
            likedProblems: userDocData.likedProblems?.filter(
              (id: string) => id !== problem.id
            ),
          });

          const oldProblemsData = [...problemsDoc.data().data] as TQuestionDB[];
          const problemElemIndex = oldProblemsData.findIndex(
            (probData) => probData.id === problem.id
          );
          const newProblemElem = {
            ...oldProblemsData[problemElemIndex],
            likes: (oldProblemsData[problemElemIndex].likes || 1) - 1,
            dislikes: (oldProblemsData[problemElemIndex].dislikes || 0) + 1,
          };
          const newProblemsData: TQuestionDB[] = [...oldProblemsData];
          newProblemsData[problemElemIndex] = newProblemElem;
          transaction.update(problemsRef, { data: [...newProblemsData] });

          setCurrentProblem((prev) =>
            prev
              ? {
                  ...prev,
                  dislikes:
                    prev.dislikes && prev.dislikes > 0 ? prev.dislikes + 1 : 1,
                  likes: prev.likes && prev.likes > 0 ? prev.likes - 1 : 0,
                }
              : undefined
          );
          dislikedState.setState((prev) => ({
            ...prev,
            loading: false,
            selected: true,
          }));
          likedState.setState((prev) => ({
            ...prev,
            loading: false,
            selected: false,
          }));
        } else {
          transaction.update(userRef, {
            dislikedProblems: [
              ...(userDocData.dislikedProblems || []),
              problem.id,
            ],
          });
          const oldProblemsData = [...problemsDoc.data().data] as TQuestionDB[];
          const problemElemIndex = oldProblemsData.findIndex(
            (probData) => probData.id === problem.id
          );
          const newProblemElem = {
            ...oldProblemsData[problemElemIndex],
            dislikes: (oldProblemsData[problemElemIndex].dislikes || 0) + 1,
          };
          const newProblemsData: TQuestionDB[] = [...oldProblemsData];
          newProblemsData[problemElemIndex] = newProblemElem;
          transaction.update(problemsRef, { data: [...newProblemsData] });
          setCurrentProblem((prev) =>
            prev
              ? {
                  ...prev,
                  dislikes:
                    prev.dislikes && prev.dislikes > 0 ? prev.dislikes + 1 : 1,
                }
              : undefined
          );

          dislikedState.setState((prev) => ({
            ...prev,
            loading: false,
            selected: true,
          }));
        }
      }
    });
  };

  const handleStar = async () => {
    if (!user) {
      toast.error("You must be logged in to star a problem", {
        position: "top-left",
        theme: "dark",
      });
      return;
    }
    if (starredState.loading) return;
    starredState.setState((prev) => ({ ...prev, loading: true }));

    if (!starredState.selected) {
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        starredProblems: arrayUnion(problem.id),
      });
      starredState.setState((prev) => ({ ...prev, selected: true }));
    } else {
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        starredProblems: arrayRemove(problem.id),
      });
      starredState.setState((prev) => ({ ...prev, selected: false }));
    }

    starredState.setState((prev) => ({ ...prev, loading: false }));
  };

  return (
    <div className="flex flex-col py-4 h-full overflow-y-auto bg-[#F2F2F2] text-black px-5 w-full">
      {/* Problem heading */}
      <div className="flex space-x-4">
        <Typography variant="h4" fontWeight={"600"}>
          {problem?.title}
        </Typography>
      </div>

      {currentProblem && (
        <ProblemFeedbacks
          likedState={likedState}
          dislikedState={dislikedState}
          solvedState={solvedState}
          starredState={starredState}
          handleLike={handleLike}
          handleDislike={handleDislike}
          handleStar={handleStar}
          problemDifficulty={currentProblem.difficulty}
        />
      )}

      {/* Problem Statement(paragraphs) */}
      <div className=" text-sm">
        <div
          dangerouslySetInnerHTML={{
            __html:
              problem.descriptionPageData.explanation ??
              "Oops! an error occurred",
          }}
        />
      </div>

      {/* Examples */}
      <div className="mt-4 flex flex-col">
        {problem.descriptionPageData.examples?.map((example, index) => (
          <div key={`problem_description_example_${index}`}>
            <p className="font-medium  ">Example {index + 1}: </p>
            {example.img && <Image src={example.img} alt="" className="mt-3" />}
            <p className="bg-[#d3d3d3a7] rounded-lg my-4 p-4 font-mono break-words text-sm w-full max-w-5xl">
              <strong className="">Input: </strong> {example.inputText}
              <br />
              <strong>Output:</strong>
              {example.outputText} <br />
              {example.explanation && (
                <>
                  <strong>Explanation:</strong> {example.explanation}
                </>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Constraints */}
      {problem.descriptionPageData.constraints && (
        <div className="my-8 pb-4">
          <div className=" text-sm font-medium">Constraints:</div>
          <ul className=" ml-5 list-disc ">
            <div
              dangerouslySetInnerHTML={{
                __html: problem.descriptionPageData.constraints,
              }}
            />
          </ul>
        </div>
      )}
    </div>
  );
};
export default ProblemDescription;

function useUserFeedback(problemId: string) {
  type TFeedbackState = {
    selected: boolean;
    loading: boolean;
  };
  const [likedState, setLikedState] = useState<TFeedbackState>({
    selected: false,
    loading: false,
  });
  const [dislikedState, setDislikedState] = useState<TFeedbackState>({
    selected: false,
    loading: false,
  });
  const [solvedState, setSolvedState] = useState<TFeedbackState>({
    selected: false,
    loading: false,
  });
  const [starredState, setStarredState] = useState<TFeedbackState>({
    selected: false,
    loading: false,
  });

  const [user] = useAuthState(auth);

  useEffect(() => {
    const getUsersDataOnProblem = async () => {
      const userData = await fetchUserData(user?.uid);
      if (userData) {
        const {
          likedProblems = [],
          dislikedProblems = [],
          starredProblems = [],
        } = userData;

        setLikedState({
          selected: likedProblems.includes(problemId),
          loading: false,
        });
        setDislikedState({
          selected: dislikedProblems.includes(problemId),
          loading: false,
        });
        setStarredState({
          selected: starredProblems.includes(problemId),
          loading: false,
        });
        setSolvedState({
          selected: isProblemSolved(userData, problemId),
          loading: false,
        });
      }
    };

    if (user) getUsersDataOnProblem();
    return () => {
      setLikedState({
        selected: false,
        loading: false,
      });
      setDislikedState({
        selected: false,
        loading: false,
      });
      setStarredState({
        selected: false,
        loading: false,
      });
      setSolvedState({
        selected: false,
        loading: false,
      });
    };
  }, [problemId, user]);

  return {
    likedState: {
      selected: likedState.selected,
      loading: likedState.loading,
      setState: setLikedState,
    },
    dislikedState: {
      selected: dislikedState.selected,
      loading: dislikedState.loading,
      setState: setDislikedState,
    },
    starredState: {
      selected: starredState.selected,
      loading: starredState.loading,
      setState: setStarredState,
    },
    solvedState: {
      selected: solvedState.selected,
      loading: solvedState.loading,
      setState: setSolvedState,
    },
  };
}
