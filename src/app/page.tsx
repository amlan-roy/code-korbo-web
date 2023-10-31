"use client";

import { auth } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/Pages/LoadingPage";
import { Typography } from "@mui/material";
import ErrorPage from "@/components/Pages/ErrorPage";
import SearchBar from "@/components/SearchBar/SearchBar";
import { TFormattedQuestion } from "@/utils/types/question";
import { TQuestionDifficultyName } from "@/utils/types/difficulty";
import { TQuestionCategoryName } from "@/utils/types/category";
import { TQuestionStatusName } from "@/utils/types/solutionStatus";
import QuestionsTable from "@/components/QuestionsTable/QuestionsTable";

export default function Home() {
  const [fetchedProblems, setFetchedProblems] =
    useState<Array<TFormattedQuestion>>();
  const [user, loading, authError] = useAuthState(auth);
  const [data, setData] = useState(fetchedProblems);

  const filterData = (
    keyword: string,
    difficulty: TQuestionDifficultyName[],
    category: TQuestionCategoryName[],
    status: TQuestionStatusName[]
  ) => {
    let filteredData = [...(fetchedProblems || [])];
    if (!filteredData.length) filteredData;

    const noKeyword = keyword.length === 0;
    const noDifficulty = difficulty.length === 0;
    const noCategory = category.length === 0;
    const noStatus = status.length === 0;
    const noFilters = noKeyword && noDifficulty && noStatus && noCategory;
    if (noFilters) setData(filteredData);

    filteredData = filteredData.filter((problem) => {
      // Check if the keyword is a substring of the title
      const keywordMatch = noKeyword
        ? true
        : problem.title.toLowerCase().includes(keyword.toLowerCase());
      // Check if the difficulty matches the selected filter
      const difficultyMatch = noDifficulty
        ? true
        : difficulty.includes(problem.difficulty);
      // Check if the category matches the selected filter
      const categoryMatch = noCategory
        ? true
        : category.includes(problem.category);
      // Check if the status matches the selected filter
      const statusMatch = noStatus
        ? true
        : (status.includes("Solved") && problem.isSolved) ||
          (status.includes("Unsolved") && !problem.isSolved);
      // Return true if all the conditions are met
      return keywordMatch && difficultyMatch && categoryMatch && statusMatch;
    });
    setData(filteredData);
  };

  useEffect(() => {
    if (!loading && !user) redirect("/auth");
  }, [user, loading]);

  if (loading) {
    return <LoadingPage />;
  }
  if (authError) {
    return (
      <ErrorPage
        title="Oops, an error occurred!"
        subtitle={authError.message}
      />
    );
  }

  return (
    <div className="flex w-full grow flex-col">
      <Typography variant="h3" align="center" mx={2} mt={5} mb={2}>
        Practice Kar Le Bhai!!!
      </Typography>
      <div className="relative overflow-x-auto mx-auto px-6 pb-10 w-full h-full">
        <SearchBar setData={filterData} />
        <QuestionsTable
          data={data || fetchedProblems}
          setFetchedProblems={setFetchedProblems}
          uid={user?.uid}
          loading={!!!fetchedProblems}
        />
      </div>
    </div>
  );
}
