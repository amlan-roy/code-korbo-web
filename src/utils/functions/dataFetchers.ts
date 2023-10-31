import { TQuestionCategory } from "../types/category";
import { TQuestionDifficulty } from "../types/difficulty";
import { TQuestionLanguage } from "../types/language";
import { TFormattedQuestion, TQuestionDB } from "../types/question";
import { TUserDB } from "../types/user";
import { CODE_EXECUTION_DOMAIN } from "@/utils/constants/constants";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import axios from "axios";

/**
 * Async function that fetches all the problem categories
 *
 */
export const fetchCategories = async () => {
  const docRef = doc(firestore, "commonInfo", "categories");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const categories: TQuestionCategory[] = docSnap.data().data;
    return categories;
  }
};

/**
 * Async function that fetches all the problem difficulties
 *
 */
export const fetchDifficulties = async () => {
  const docRef = doc(firestore, "commonInfo", "difficulties");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const categories: TQuestionDifficulty[] = docSnap.data().data;
    return categories;
  }
};

/**
 * Async function that fetches all the problem languages
 *
 */
export const fetchLanguages = async () => {
  const targetUrl = `${CODE_EXECUTION_DOMAIN}/languages/all`;
  const res = await axios.get(targetUrl);
  const response: Array<TQuestionLanguage> = res.data;
  return response;
};
/**
 * Async function that fetches all the problems
 */
export const fetchProblems = async () => {
  const docRef = doc(firestore, "commonInfo", "problems");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const problems: TQuestionDB[] = docSnap.data().data;
    return problems;
  }
};

/**
 * takes a user data and a problem ID as parameters
 * returns
 *    true: if the problem is solved by the user
 *    false: otherwise
 *
 */
export function isProblemSolved(userData: TUserDB, problemId: string): boolean {
  if (userData.solvedProblems) {
    for (let solvedProblem of userData.solvedProblems) {
      if (solvedProblem.id === problemId) {
        for (let solution of solvedProblem.solutions) {
          for (let submission of solution.submittedSolutionStates) {
            if (submission.solutionState.state === "successful") {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
}

/**
 * Returns the formatted problems (the language, difficulties, and categories fields have actual mapped names instead of objects)
 */
export const getFormattedProblems = async (uid: string | undefined) => {
  if (!uid) return;
  const unformattedProblems = await fetchProblems();
  const languages = await fetchLanguages();
  const difficulties = await fetchDifficulties();
  const categories = await fetchCategories();

  const userData = await fetchUserData(uid);

  const formattedProblemsPromise = unformattedProblems?.map(async (problem) => {
    const { difficulty, category, solutions, ...rest } = problem;

    const isSolved = !!userData && isProblemSolved(userData, problem.id);

    const formattedProblem: TFormattedQuestion = {
      ...rest,
      isSolved,
      difficulty:
        difficulties?.find(({ id }) => id === difficulty)?.name || "easy",
      category: categories?.find(({ id }) => id === category)?.name || "Array",
      solutions: solutions.map(({ languageId, ...rest }) => {
        const languageName = languages.find(
          ({ id }) => languageId === id.toString()
        )?.name;
        return {
          languageId,
          languageName: languageName || "Javascript",
          ...rest,
        };
      }),
    };
    return formattedProblem;
  });

  if (formattedProblemsPromise) {
    const formattedProblems = await Promise.all(formattedProblemsPromise);
    return formattedProblems;
  }
};

export const getFormattedProblem = async (problemId: string, uid?: string) => {
  const formattedProblems = await getFormattedProblems(uid);
  return formattedProblems?.find(({ id }) => problemId === id);
};

export const fetchUserData = async (uid?: string) => {
  if (!uid) return;
  const userRef = doc(firestore, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data() as TUserDB;
    return data;
  }
};
