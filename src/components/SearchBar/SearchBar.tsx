import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import FilterWithMenu from "./FilterWithMenu";
import { TQuestionCategoryName } from "@/utils/types/category";
import { TQuestionDifficultyName } from "@/utils/types/difficulty";
import { TQuestionStatusName } from "@/utils/types/solutionStatus";

export interface SearchBarForm {
  searchText: string;
  difficultyFilter: TQuestionDifficultyName[];
  categoryFilter: TQuestionCategoryName[];
  statusFilter: TQuestionStatusName[];
}

type SearchBarProps = {
  setData: (
    keyword: string,
    difficultyFilter: TQuestionDifficultyName[],
    categoryFilter: TQuestionCategoryName[],
    statusFilter: TQuestionStatusName[]
  ) => void;
};

export const allDifficultyOptions: TQuestionDifficultyName[] = [
  "easy",
  "hard",
  "medium",
];

export const allCategoryOptions: TQuestionCategoryName[] = [
  "Array",
  "Backtracking",
  "Binary Search",
  "Binary Tree",
  "Dynamic Programming",
  "Intervals",
  "Linked List",
  "Sliding Window",
  "Stack",
  "Two Pointer",
];

export const allStatusOptions: TQuestionStatusName[] = ["Solved", "Unsolved"];

const SearchBar: React.FC<SearchBarProps> = ({ setData }) => {
  const handleClickSearch: SubmitHandler<SearchBarForm> = () => {
    const { searchText, difficultyFilter, categoryFilter, statusFilter } =
      getValues();
    setData(searchText, difficultyFilter, categoryFilter, statusFilter);
  };

  const { register, handleSubmit, setValue, getValues, reset } =
    useForm<SearchBarForm>();

  useEffect(() => {
    const defaultValues: SearchBarForm = {
      searchText: "",
      difficultyFilter: [],
      categoryFilter: [],
      statusFilter: [],
    };
    reset(defaultValues);
  }, []);

  const onSelectButtonClick = (
    formControlName: keyof SearchBarForm,
    selectedOptions:
      | TQuestionStatusName[]
      | TQuestionDifficultyName[]
      | TQuestionCategoryName[]
  ) => {
    setValue(formControlName, selectedOptions);
  };
  const onClearButtonClick = (formControlName: keyof SearchBarForm) => {
    setValue(formControlName, []);
  };

  return (
    <form
      className="flex flex-row items-center gap-4 flex-wrap"
      onSubmit={handleSubmit(handleClickSearch)}
    >
      <TextField
        id="search-question"
        label="Search question"
        type="search"
        variant="outlined"
        autoComplete="on"
        className="mt-2"
        {...register("searchText")}
      />
      <FilterWithMenu
        id="difficulty-filter"
        buttonTitle="Difficulty"
        allOptions={allDifficultyOptions}
        formControlName="difficultyFilter"
        getSelectedOptions={() => getValues().difficultyFilter}
        onSelectButtonClick={onSelectButtonClick}
        onClearButtonClick={onClearButtonClick}
      />
      <FilterWithMenu
        id="category-filter"
        buttonTitle="Category"
        allOptions={allCategoryOptions}
        formControlName="categoryFilter"
        getSelectedOptions={() => getValues().categoryFilter}
        onSelectButtonClick={onSelectButtonClick}
        onClearButtonClick={onClearButtonClick}
      />
      <FilterWithMenu
        id="status-filter"
        buttonTitle="Status"
        allOptions={allStatusOptions}
        formControlName="statusFilter"
        getSelectedOptions={() => getValues().statusFilter}
        onSelectButtonClick={onSelectButtonClick}
        onClearButtonClick={onClearButtonClick}
      />
      <Button variant="contained" type="submit">
        Search
      </Button>
    </form>
  );
};
export default SearchBar;
