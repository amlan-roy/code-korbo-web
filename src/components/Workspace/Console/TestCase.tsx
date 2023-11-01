import { Button, Typography } from "@mui/material";
import React, { useState } from "react";

export type TTestCaseData = {
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  testCasePassed?: boolean;
  failureMessage?: string;
};

type TestCaseProps = {
  data?: TTestCaseData;
  loading?: boolean;
  count: number;
};

const TestCase: React.FC<TestCaseProps> = ({
  data,
  loading = false,
  count,
}) => {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  // If loading is true, display the loading UI
  if (loading)
    return (
      <div className="bg-dark-fill-3 w-full rounded my-2">
        <div className="animate-pulse text-slate-400 m-2 my-5">
          Test cases running
        </div>
      </div>
    );

  // If loading is not passed, do not show anything
  // TODO: Add UI for this case
  if (!data) return;

  const {
    input,
    expectedOutput,
    actualOutput,
    testCasePassed = false,
    failureMessage,
  } = data;

  return (
    <>
      <Button
        color={testCasePassed ? "success" : "error"}
        className="w-full rounded p-2 m2 flex justify-between"
        variant="contained"
        onClick={() => setIsDetailsVisible((prev) => !prev)}
      >
        {`Test case ${count}`}
        <strong>{testCasePassed ? "Passed" : "Failed"}</strong>
      </Button>
      {isDetailsVisible && (
        <div className="my-2 w-full bg-dark-fill-3 rounded p-2">
          <div>
            <Typography
              variant="body1"
              fontWeight={600}
              className="text-slate-50"
            >
              Input:
            </Typography>
            <Typography
              variant="body1"
              fontWeight={400}
              className="text-slate-50"
            >
              {input}
            </Typography>
          </div>
          <div>
            <Typography
              variant="body1"
              fontWeight={600}
              className="text-slate-50"
            >
              Expected Output:
            </Typography>
            <Typography
              variant="body1"
              fontWeight={400}
              className="text-slate-50"
            >
              {expectedOutput}
            </Typography>
          </div>
          <div>
            <Typography
              variant="body1"
              fontWeight={600}
              className="text-slate-50"
            >
              Actual Output:
            </Typography>
            <Typography
              variant="body1"
              fontWeight={400}
              className="text-slate-50"
            >
              {actualOutput || ""}
            </Typography>
          </div>
          {failureMessage && (
            <div>
              <Typography
                variant="body1"
                fontWeight={600}
                className="text-slate-50"
              >
                Error:
              </Typography>
              <Typography
                variant="body1"
                fontWeight={400}
                className="text-slate-50"
              >
                {failureMessage}
              </Typography>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default TestCase;
