export type TQuestionCategoryName =
  | "Array"
  | "Linked List"
  | "Dynamic Programming"
  | "Stack"
  | "Binary Search"
  | "Two Pointer"
  | "Intervals"
  | "Binary Tree"
  | "Sliding Window"
  | "Backtracking";

export type TQuestionCategory = {
  id: string;
  name: TQuestionCategoryName;
};
