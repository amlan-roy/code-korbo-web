import { TQuestionCategoryName } from "@/utils/types/category";
import { TQuestionDifficultyName } from "@/utils/types/difficulty";

export type TDetailsPageContent = {
  examples?: {
    inputText: string;
    outputText: string;
    explanation?: string;
    img?: string;
  }[];
  explanation?: string;
  constraints?: string;
  img?: string;
};

export type TSolution = {
  languageId: string;
  handlerFunction: string;
  starterCode: string;
  testCases: { stdin: string; stdout: string }[];
};

/**
 * id = id of the problem
 * availableLanguages = array of ids of the languages availabe for this problem
 * category = id of the question category
 * descriptionPageData = description page data (Object)
 * difficulty = id of the question difficulty
 * handlerFunction = base 64 encoded handler function
 * solutionPageData = description page data (Object)
 * solutionVideoUrl = solution video url
 * title = title of the problem
 *
 */
export type TQuestionDB = {
  id: string;
  category: string;
  descriptionPageData: TDetailsPageContent;
  difficulty: string;
  solutions: TSolution[];
  solutionPageData: TDetailsPageContent;
  solutionVideoUrl?: string;
  title: string;
  likes?: number;
  dislikes?: number;
};

export type TFormattedSolution = {
  languageId: string;
  languageName: string;
  handlerFunction: string;
  starterCode: string;
  testCases: { stdin: string; stdout: string }[];
};

export type TFormattedQuestion = {
  id: string;
  category: TQuestionCategoryName;
  descriptionPageData: TDetailsPageContent;
  disliked?: boolean;
  difficulty: TQuestionDifficultyName;
  solutions: TFormattedSolution[];
  isFav?: boolean;
  liked?: boolean;
  isSolved?: boolean;
  solutionPageData: TDetailsPageContent;
  solutionVideoUrl?: string;
  title: string;
  likes?: number;
  dislikes?: number;
};
