"use client";

import React, { useEffect, useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import Confetti from "react-confetti";
import { useAuthState } from "react-firebase-hooks/auth";
import CodeEditor from "@/components/Workspace/CodeEditor/CodeEditor";
import EditorFooter from "@/components/Workspace/CodeEditor/EditorFooter";
import ProblemDescription from "@/components/Workspace/ProblemDescription/ProblemDescription";
import useApiCall from "@/hooks/useApiCall";
import useWindowSize from "@/hooks/useWindowSize";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { auth, firestore } from "@/firebase/firebase";
import { CODE_SUBMISSION_SUCCESSFUL_CODES } from "@/utils/constants/constants";
import { fetchUserData } from "@/utils/functions/dataFetchers";
import { TUserDB, TSubmissionSolutionState } from "@/utils/types/user";
import { TFormattedQuestion } from "@/utils/types/question";
import Console from "@/components/Workspace/Console/Console";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  contentNotScrollable?: boolean;
  className?: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, contentNotScrollable, className, ...other } =
    props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`workspace-tabpanel-${index}`}
      aria-labelledby={`workspace-tab-${index}`}
      className={`${value !== index && "hidden"} ${"h-full w-full flex-grow"} ${
        className || ""
      } ${!contentNotScrollable ? "overflow-y-auto" : ""}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

type WorkspaceProps = {
  problem: TFormattedQuestion;
};

const Workspace: React.FC<WorkspaceProps> = ({ problem }) => {
  const [user] = useAuthState(auth);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState(
    problem.solutions[0]
  );
  const [userCode, setUserCode] = useState<string>(
    `${selectedLanguage.starterCode}${"\n".repeat(15)}`
  );
  // When this is true, the execution is stored to the db.
  // This is true when submit is selected
  const [submitExecution, setSubmitExecution] = useState(false);

  const { width, height } = useWindowSize();

  const [showConfetti, setShowConfetti] = useState(false);

  const {
    status: overallExecutionStatus,
    data: resData,
    error: errorMessage,
    makeApiCalls: submitTestCases,
    cancelSubmission,
  } = useApiCall(
    selectedLanguage.handlerFunction,
    userCode,
    selectedLanguage.languageId,
    problem.solutions.find(
      (soln) => soln.languageId === selectedLanguage.languageId
    )?.testCases || [],
    true
  );

  const testCasesExecutionData =
    overallExecutionStatus === "Successful" ||
    overallExecutionStatus === "Unsuccesful"
      ? resData.map(({ data, IO }) => {
          const { stdin: input, stdout: expectedOutput } = IO;
          const actualOutput = data?.stdout || "";
          const testCasePassed = !!(
            data?.status?.id &&
            CODE_SUBMISSION_SUCCESSFUL_CODES.includes(data.status.id)
          );
          const failureMessage = data?.stderr;

          return {
            input,
            expectedOutput,
            actualOutput,
            testCasePassed,
            failureMessage,
          };
        })
      : [];

  useEffect(() => {
    // A function that returns a new user data object with its solved problems updated with the submission solution state
    function updateSolvedProblems(
      userData: TUserDB, // The user data array
      problemId: string, // The problem id
      langId: string, // The language id
      submissionSolutionState: TSubmissionSolutionState // The submission solution state
    ) {
      // Make a copy of the user data array
      const userNewData = { ...userData, updatedAt: Date.now() };

      // Check if the user has solved problems
      if (userNewData.solvedProblems) {
        // Make a copy of the solved problems array
        const newSolvedProblems = [...userNewData.solvedProblems];
        // Find the problem by problemId
        const problem = newSolvedProblems.find(
          (problem) => problem.id === problemId
        );
        if (problem) {
          // Make a copy of the solutions array
          const newSolutions = [...problem.solutions];
          // Find the solution by langId
          const solution = newSolutions.find(
            (solution) => solution.langId === langId
          );
          if (solution) {
            // Make a copy of the submitted solution states array
            const newSubmittedSolutionStates = [
              ...solution.submittedSolutionStates,
            ];
            // Push the submission solution state to the new array
            newSubmittedSolutionStates.push(submissionSolutionState);
            // Update the solution object with the new array
            solution.submittedSolutionStates = newSubmittedSolutionStates;
          } else {
            // Create a new solution object with the langId and the submission solution state array
            const newSolution = {
              langId: langId,
              submittedSolutionStates: [submissionSolutionState],
            };
            // Push the new solution to the new solutions array
            newSolutions.push(newSolution);
          }
          // Update the problem object with the new solutions array
          problem.solutions = newSolutions;
        } else {
          // Create a new problem object with the problemId and the solution array
          const newProblem = {
            id: problemId,
            solutions: [
              {
                langId: langId,
                submittedSolutionStates: [submissionSolutionState],
              },
            ],
          };
          // Push the new problem to the new solved problems array
          newSolvedProblems.push(newProblem);
        }
        // Update the user object with the new solved problems array
        userNewData.solvedProblems = newSolvedProblems;
      } else {
        // Create a new solved problems array with the problem object
        userNewData.solvedProblems = [
          {
            id: problemId,
            solutions: [
              {
                langId: langId,
                submittedSolutionStates: [submissionSolutionState],
              },
            ],
          },
        ];
      }
      // Return the new user array

      return userNewData;
    }

    // stores problem execution data (irrespective of if its solved, unsolved or error) in firebase database
    const setProblemSolutionData = async () => {
      const problemSolnData: TSubmissionSolutionState = {
        timestamp: Date.now(),
        solutionState: {
          userCode: btoa(userCode),
          state:
            overallExecutionStatus === "Successful"
              ? "successful"
              : overallExecutionStatus === "Unsuccesful"
              ? "unsuccesful"
              : "error",
        },
      };
      if (overallExecutionStatus === "Error")
        problemSolnData.solutionState.errorMessage = errorMessage;
      const userData = await fetchUserData(user?.uid);
      if (userData) {
        const updatedUserData = updateSolvedProblems(
          userData,
          problem.id,
          selectedLanguage.languageId,
          problemSolnData
        );
        if (user?.uid) {
          await setDoc(doc(firestore, "users", user.uid), updatedUserData);
        } else {
          throw Error("User ID Not found");
        }
      }
    };

    // If submit execution boolean is set true and overallExecutionStatus is not running or stopped
    // Then submit it
    if (submitExecution) {
      if (
        overallExecutionStatus !== "Running" &&
        overallExecutionStatus !== "Stopped"
      ) {
        setProblemSolutionData();
      }
    }

    if (overallExecutionStatus === "Successful") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [submitExecution, overallExecutionStatus, setShowConfetti]);

  function tabsA11yProps(index: number) {
    return {
      id: `workspace-tab-${index}`,
      "aria-controls": `workspace-tabpanel-${index}`,
    };
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
      <div className="border-b-2 border-gray-100 border-solid">
        <Tabs
          value={activeTabIndex}
          onChange={(event: React.SyntheticEvent, newValue: number) => {
            setActiveTabIndex(newValue);
          }}
          aria-label="basic tabs example"
          className="flex flex-wrap"
        >
          <Tab label="Description" {...tabsA11yProps(0)} />
          <Tab label="Code Editor" {...tabsA11yProps(1)} />
          <Tab label="Console" {...tabsA11yProps(2)} />
        </Tabs>
      </div>
      <CustomTabPanel value={activeTabIndex} index={0}>
        <ProblemDescription problem={problem} />
      </CustomTabPanel>
      <CustomTabPanel
        value={activeTabIndex}
        index={1}
        contentNotScrollable
        className="bg-dark-layer-1 flex justify-between flex-col h-full"
      >
        <CodeEditor
          problem={problem}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          setUserCode={setUserCode}
          userCode={userCode}
        />
        <EditorFooter
          setActiveTabIndex={setActiveTabIndex}
          submitTestCases={submitTestCases}
          setSubmitExecution={setSubmitExecution}
          handleCancel={cancelSubmission}
          isRunning={overallExecutionStatus === "Running"}
        />
      </CustomTabPanel>
      <CustomTabPanel
        value={activeTabIndex}
        index={2}
        className="bg-dark-layer-1 flex justify-between flex-col h-full overflow-y-auto"
      >
        <Console
          testCaseData={testCasesExecutionData}
          runResult={overallExecutionStatus}
          errorMessage={errorMessage}
          isExecutionSubmitted={submitExecution}
        />
        <EditorFooter
          setActiveTabIndex={setActiveTabIndex}
          submitTestCases={submitTestCases}
          setSubmitExecution={setSubmitExecution}
          handleCancel={cancelSubmission}
          isRunning={overallExecutionStatus === "Running"}
        />
        {overallExecutionStatus === "Successful" && (
          <Confetti
            gravity={0.3}
            tweenDuration={4000}
            width={width - 1}
            height={height - 1}
            recycle={showConfetti}
          />
        )}
      </CustomTabPanel>
    </div>
  );
};
export default Workspace;
