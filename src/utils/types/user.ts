export type TSubmissionSolutionState = {
  timestamp: number;
  solutionState: {
    userCode: string;
    state: "error" | "successful" | "unsuccesful";
    errorMessage?: string;
  };
};

export type TSolvedProblem = {
  id: string;
  solutions: {
    langId: string;
    submittedSolutionStates: TSubmissionSolutionState[];
  }[];
};

/**
 * uid = User Id
 * createdAt = created at timestamp
 * displayName = full display name
 * email = email id
 * likedProblems = array of ids of liked problems
 * solvedProblems = array of ids of solved problems
 * starredProblems = array of ids of starred problems
 * updatedAt = data updated at
 */
export type TUserDB = {
  uid: string;
  createdAt: string;
  displayName: string;
  email: string;
  likedProblems?: string[];
  dislikedProblems?: string[];
  solvedProblems?: TSolvedProblem[];
  starredProblems?: string[];
  updatedAt: string;
};
