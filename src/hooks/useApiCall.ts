import { useState, useEffect } from "react";
import {
  TCodeSubmissionResponse,
  getBatchSubmissionData,
  runBatchCode,
} from "@/utils/functions/codeSubmission";
import {
  CODE_SUBMISSION_ERROR_CODES,
  CODE_SUBMISSION_SUCCESSFUL_CODES,
  CODE_SUBMISSION_UNSUCCESSFUL_CODES,
  CODE_SUBMISSON_COMPLETED_STATUSES,
} from "@/utils/constants/constants";

// The overall code execution status
export type TOverallExecutionStatus =
  | "Stopped"
  | "Error"
  | "Successful"
  | "Unsuccesful"
  | "Running";

type TApiData = Array<{
  token: string;
  data: TCodeSubmissionResponse | undefined;
  IO: {
    stdin: string;
    stdout: string;
  };
}>;

// Define an interface for the return object
interface ReturnObject {
  status: TOverallExecutionStatus;
  data: TApiData;
  error: string | undefined;
  makeApiCalls: Function;
  cancelSubmission: () => void;
}

/**
 * A custom React hook that can be used to make API calls to a backend server to execute code and test cases.
 *
 * @param handlerCode The code to be executed on the backend server.
 * @param source_code The source code of the handler.
 * @param language_id The language of the source code.
 * @param testCases An array of test cases to be executed against the handler.
 * @param base64_encoded A boolean value indicating whether the source code should be base64 encoded before being sent to the backend server.
 *
 * @returns An object with the following properties:
 *  * status: The status of the API call.
 *  * data: An array of objects, each of which contains the following properties:
 *      * token: A unique token that identifies the API call.
 *      * data: The response data from the backend server.
 *      * IO: An object containing the input and output for the test case.
 *  * error: An error message if the API call failed.
 *  * makeApiCalls: A function that can be used to start the API call.
 *  * cancelSubmission: A function that can be used to cancel the API call.
 */
export default function useApiCall(
  handlerCode: string,
  source_code: string,
  language_id: string | number,
  testCases: {
    stdin: string;
    stdout: string;
  }[],
  base64_encoded: boolean = true
): ReturnObject {
  const [apiData, setApiData] = useState<TApiData>([]);

  const [apiStatus, setApiStatus] =
    useState<TOverallExecutionStatus>("Stopped");

  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  //Every time this is true, all previous executions stop and a new execution is started
  const [makeApiCalls, setMakeApiCalls] = useState(false);

  const [intervalId, setIntervalId] =
    useState<ReturnType<typeof setInterval>>();

  const makePostCalls = () => {
    resetData();
    setMakeApiCalls(true);
    if (apiStatus !== "Running") {
      setApiStatus((prev) => "Running");

      // Here we are assuming that the order of tokens for code execution is same as the order of submission of the code
      runBatchCode(
        handlerCode,
        source_code,
        language_id,
        testCases,
        base64_encoded
      )
        .then((tokens) => {
          setApiData(
            tokens.map(({ token }, index) => ({
              token,
              data: undefined,
              IO: testCases[index],
            }))
          );
        })
        .catch((e: unknown) => {
          let errMessage = "An error occurred while submitting the code";
          if (typeof e === "string") {
            errMessage = e.toUpperCase();
          } else if (e instanceof Error) {
            errMessage = e.message;
          }

          setErrorMsg(errMessage);
          setApiStatus((prev) => "Error");
          return;
        });
    }
  };

  useEffect(() => {
    // Define a counter variable to keep track of how many times we make GET requests
    let counter = 0;
    // Define a function that makes GET requests for each token in apiData
    const makeGetRequests = () => {
      if (apiStatus === "Running" && counter < 10) {
        const codeSubmissionCompleted = apiData.every((element, index) => {
          const oldId = element.data?.status?.id;
          return !!oldId && CODE_SUBMISSON_COMPLETED_STATUSES.includes(oldId);
        });
        if (shouldMakeApiCall(counter, 10, !!!codeSubmissionCompleted)) {
          const tokens = apiData.map(({ token }) => token);
          getBatchSubmissionData(tokens)
            .then((responseData) => {
              responseData.forEach((individualResData, index) => {
                const newId = individualResData.status?.id;
                const newDescription =
                  individualResData.status?.description ||
                  "Oops! An error occurred!";
                if (!!!newId || CODE_SUBMISSION_ERROR_CODES.includes(newId)) {
                  setApiStatus((prev) => "Error");
                  setErrorMsg(newDescription);
                  stopLoop();
                } else {
                  const newData = [...apiData];
                  newData[index].data = individualResData;
                  setApiData((prev) => newData);

                  const { overallFinishedResponse, errorMessage } =
                    checkOverallResponseStatus(newData);

                  if (overallFinishedResponse === "error") {
                    setApiStatus((prev) => "Error");
                    setErrorMsg(errorMessage);
                    stopLoop();
                  } else if (overallFinishedResponse === "successful") {
                    setApiStatus((prev) => "Successful");
                    stopLoop();
                  } else if (overallFinishedResponse === "unsuccesful") {
                    setApiStatus((prev) => "Unsuccesful");
                    stopLoop();
                  }
                }
              });
            })
            .catch((e: unknown) => {
              let errMessage =
                "An error occurred while fetchnig the submissions status";
              if (typeof e === "string") {
                errMessage = e.toUpperCase();
              } else if (e instanceof Error) {
                errMessage = e.message;
              }

              setErrorMsg(errMessage);
              setApiStatus((prev) => "Error");
              stopLoop();
            });
        } else {
          stopLoop();
        }
      } else {
        stopLoop();
      }
      counter++;
    };

    // Call the makeGetRequests function only after the tokens for all the test cases submissions are available
    if (
      apiData.length === testCases.length &&
      !intervalId &&
      makeApiCalls &&
      apiStatus === "Running"
    ) {
      counter = 0;

      const intervalId = setInterval(makeGetRequests, 5000);
      setIntervalId(intervalId);
    }
  }, [apiData]);

  useEffect(() => {
    if (apiStatus === "Error") {
      stopLoop();
      setMakeApiCalls((prev) => false);
      setApiData((prev) => []);
      setIntervalId((prev) => undefined);
    }
  }, [apiStatus]);

  const checkOverallResponseStatus = (respData: TApiData) => {
    var overallFinishedResponse:
      | "error"
      | "successful"
      | "unsuccesful"
      | "running" = "running";
    let errorMessage = "Oops! An error occurred!";
    if (respData.length === testCases.length) {
      if (
        // All the code submissons have completed
        respData.every((dat) => {
          const id = dat.data?.status?.id;
          return id && CODE_SUBMISSON_COMPLETED_STATUSES.includes(id);
        })
      ) {
        //If all the results are successful
        if (
          respData.every((dat) => {
            const id = dat.data?.status?.id;
            if (!id) {
              overallFinishedResponse = "error";
              return false;
            }
            return id && CODE_SUBMISSION_SUCCESSFUL_CODES.includes(id);
          })
        ) {
          overallFinishedResponse = "successful";
        } else if (
          // if any result is unsuccesful
          respData.some((dat) => {
            const id = dat.data?.status?.id;
            if (!id) {
              overallFinishedResponse = "error";
              return false;
            }
            return id && CODE_SUBMISSION_UNSUCCESSFUL_CODES.includes(id);
          })
        ) {
          overallFinishedResponse = "unsuccesful";
        }
      }
    } else {
      overallFinishedResponse = "error";
    }

    return {
      overallFinishedResponse,
      errorMessage,
    };
  };

  const shouldMakeApiCall = (
    currCount: number,
    maxCount: number,
    customCondition?: boolean
  ) => {
    return (
      makeApiCalls &&
      currCount < maxCount &&
      (customCondition ?? true) &&
      apiStatus === "Running"
    );
  };

  const stopLoop = () => {
    setMakeApiCalls((prev) => false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(undefined);
    }
  };

  const resetData = () => {
    stopLoop();
    setApiStatus((prev) => "Stopped");
    setApiData((prev) => []);
    setIntervalId((prev) => undefined);
    setErrorMsg((prev) => undefined);
  };

  // Return an object with status, data, and error properties
  return {
    status: apiStatus,
    data: apiData,
    error: errorMsg,
    makeApiCalls: () => {
      makePostCalls();
    },
    cancelSubmission: () => {
      resetData();
    },
  };
}
