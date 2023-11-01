// points to locally hosted (using docker) jude0 instance for now
// Need to update it once judge0 API is integrated here
export const CODE_EXECUTION_DOMAIN = "http://localhost:2358/";

// These are mapped from the judge0 API
// https://ce.judge0.com/#statuses-and-languages-language-get

export const CODE_EDITOR_SUPPORTED_LANG_IDS = {
    JAVA: [62, 28, 27, 26],
    JAVASCRIPT: [63, 30, 29],
    CPP: [4, 5, 6, 7, 8, 9, 48, 75],
    C: [10, 11, 12, 13, 14, 15, 52, 53, 54, 76],
    PYTHON: [37, 70, 71, 36, 35, 34],
  };
  
  export const CODE_SUBMISSION_IN_PROGRESS_STATUSES = [1, 2];
  
  export const CODE_SUBMISSION_SUCCESSFUL_CODES = [3];
  
  export const CODE_SUBMISSION_UNSUCCESSFUL_CODES = [4];
  
  export const CODE_SUBMISSION_ERROR_CODES = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  
  export const CODE_SUBMISSON_COMPLETED_STATUSES = [
    ...CODE_SUBMISSION_SUCCESSFUL_CODES,
    ...CODE_SUBMISSION_UNSUCCESSFUL_CODES,
    ...CODE_SUBMISSION_ERROR_CODES,
  ];
  