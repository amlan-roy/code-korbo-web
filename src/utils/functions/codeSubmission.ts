import axios from "axios";
import { CODE_EXECUTION_DOMAIN } from "@/utils/constants/constants";

export type TCodeSubmissionResponse = {
  stdout: string;
  time?: number;
  memory?: number;
  stderr?: string;
  token?: string;
  compile_output?: string;
  message?: string;
  status?: {
    id: number;
    description: string;
  };
};

/**
 *
 * @param source_code
 * @param language_id
 * @param stdin
 * @param stdout
 * @param base64_encoded
 * @returns token: string, returns the token of the submisson which can be used to get the submission status
 */
export const runCode = async (
  source_code: string,
  language_id: string | number,
  stdin: string,
  stdout: string,
  base64_encoded: boolean = true
) => {
  const url = `${CODE_EXECUTION_DOMAIN}submissions${
    base64_encoded ? "?base64_encoded=true" : ""
  }`;

  const data = {
    source_code: base64_encoded ? btoa(source_code) : source_code,
    language_id,
    stdin: base64_encoded ? btoa(stdin) : stdin,
    expected_output: base64_encoded ? btoa(stdout) : stdout,
    base64_encoded,
    wait: true, // Wait for the submission to finish
  };

  const {
    data: { token },
  }: { data: { token: string } } = await axios.post(url, data);

  return token;
};

export const getSubmissionData = async (
  token: string,
  receive_base64_encoded_data: boolean = false
) => {
  const url = `${CODE_EXECUTION_DOMAIN}submissions/${token}`;

  const { data }: { data: TCodeSubmissionResponse } = await axios.get(url);
  return data;
};

export const runBatchCode = async (
  handlerCode: string,
  userCode: string,
  language_id: string | number,
  testCases: { stdin: string; stdout: string }[],
  base64_encoded: boolean = true
) => {
  let source_code = "";
  const CODE_INSERTION_IDENTIFIER = "add user code below this";
  const codeInsertionIndex = handlerCode.indexOf(CODE_INSERTION_IDENTIFIER);
  if (codeInsertionIndex !== -1) {
    // The index of the first "\n" after the substring
    const newlineIndex = handlerCode.indexOf("\n", codeInsertionIndex);
    if (newlineIndex !== -1) {
      const before = handlerCode.slice(0, newlineIndex + 1); // Include the newline in the first part
      const after = handlerCode.slice(newlineIndex + 1); // Exclude the newline in the second part
      source_code = before + userCode + "\n" + after;
    } else {
      throw "An error occured while submitting the code.\nReport this error to us so that we can fix it!";
    }
  } else {
    throw "An error occured while submitting the code.\nReport this error to us so that we can fix it!";
  }

  const url = `${CODE_EXECUTION_DOMAIN}submissions/batch${
    base64_encoded ? "?base64_encoded=true" : ""
  }`;

  const data = testCases.map(({ stdin, stdout }) => ({
    source_code: base64_encoded ? btoa(source_code) : source_code,
    language_id,
    stdin: base64_encoded ? btoa(stdin) : stdin,
    expected_output: base64_encoded ? btoa(stdout) : stdout,
    base64_encoded,
    wait: true, // Wait for the submission to finish
  }));

  const { data: tokensList }: { data: { token: string }[] } = await axios.post(
    url,
    { submissions: data }
  );

  return tokensList;
};

export const getBatchSubmissionData = async (
  tokens: string[],
  receive_base64_encoded_data: boolean = false
) => {
  const url = `${CODE_EXECUTION_DOMAIN}submissions/batch?tokens=${tokens.join()}&base64_encoded=${!!receive_base64_encoded_data}`;

  const {
    data: { submissions },
  }: { data: { submissions: TCodeSubmissionResponse[] } } = await axios.get(
    url
  );
  return submissions;
};
