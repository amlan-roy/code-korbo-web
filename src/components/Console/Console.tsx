import React, { useEffect, useState } from "react";
import { TFormattedQuestion } from "@/utils/types/question";
import { Button, Typography } from "@mui/material";
import TestCase, { TTestCaseData } from "./TestCase";
import { TOverallExecutionStatus } from "@/hooks/useApiCall";

type ConsoleProps = {
  testCaseData: TTestCaseData[];
  runResult: TOverallExecutionStatus;
  errorMessage?: string;
  isExecutionSubmitted?: boolean;
};

const Console: React.FC<ConsoleProps> = ({
  testCaseData,
  runResult,
  errorMessage = "Oops. An error occurred. Please recheck your code and submit again.",
  isExecutionSubmitted,
}) => {
  const loading = runResult === "Running";

  return (
    <div className="w-full px-5 bg-dark-layer-1 flex-1">
      {/* testcase heading */}
      <Typography
        variant="h5"
        fontWeight={500}
        className={`${
          loading
            ? "text-gray-100"
            : runResult === "Successful"
            ? "text-green-300"
            : runResult === "Stopped"
            ? "text-gray-100"
            : "text-red-300"
        } my-2`}
      >
        Test Cases
      </Typography>

      {/* Testcases sub heading */}
      <Typography
        variant="h6"
        fontWeight={400}
        className={`whitespace-pre-wrap ${
          loading
            ? "text-gray-50 animate-pulse"
            : runResult === "Successful"
            ? "text-green-200"
            : runResult === "Stopped"
            ? "text-gray-100"
            : "text-red-200"
        } my-2`}
      >
        {loading
          ? "Loading..."
          : runResult === "Successful"
          ? `All test cases passed! :)${
              isExecutionSubmitted ? "\nAnd your code has been submitted." : ""
            }`
          : runResult === "Unsuccesful"
          ? `All test cases did not pass :(${
              isExecutionSubmitted ? "\nAnd your code has been submitted." : ""
            }`
          : runResult === "Stopped"
          ? `Run/Submit your test cases to view output`
          : `An error occurred! :( ${
              isExecutionSubmitted ? "\nAnd your code has been submitted." : ""
            }`}
      </Typography>

      {/* Loading State */}
      {loading ? (
        <>
          <TestCase loading count={1} />
          <TestCase loading count={2} />
          <TestCase loading count={3} />
        </>
      ) : (
        <>
          {/* Error Message */}
          {runResult === "Error" && (
            <div className="w-full bg-[#ff1d1d19] my-8 rounded">
              <Typography variant="body1" className="text-white p-2">
                {errorMessage}
              </Typography>
            </div>
          )}
          {(runResult === "Unsuccesful" || runResult === "Successful") && (
            <div className="flex flex-col w-full my-4 gap-2">
              {testCaseData.map((data, index) => (
                <TestCase
                  data={data}
                  count={index}
                  key={`test-case-tab-${index}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Console;
