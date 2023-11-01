import { TQuestionDifficultyName } from "@/utils/types/difficulty";
import Chip from "@mui/material/Chip";
import React, { Dispatch, SetStateAction } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CircularProgress from "@mui/material/CircularProgress";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

type TFeedbackState = {
  selected: boolean;
  loading: boolean;
};

type TFeedback = {
  selected: boolean;
  loading: boolean;
  setState: Dispatch<SetStateAction<TFeedbackState>>;
};

type ProblemFeedbacksProps = {
  likedState: TFeedback;
  dislikedState: TFeedback;
  solvedState: TFeedback;
  starredState: TFeedback;
  handleLike: () => Promise<void>;
  handleDislike: () => Promise<void>;
  handleStar: () => Promise<void>;
  problemDifficulty: TQuestionDifficultyName;
};

const ProblemFeedbacks: React.FC<ProblemFeedbacksProps> = ({
  likedState,
  dislikedState,
  solvedState,
  starredState,
  handleLike,
  handleDislike,
  handleStar,
  problemDifficulty,
}) => {
  return (
    <div className="flex items-center my-3">
      <Chip
        color={
          problemDifficulty === "easy"
            ? "success"
            : problemDifficulty === "medium"
            ? "warning"
            : "error"
        }
        label={problemDifficulty}
      />
      <div
        className="flex items-center cursor-pointer  space-x-1 rounded p-[3px]  ml-2 text-lg transition-colors duration-200 text-dark-gray-6"
        onClick={handleLike}
      >
        {likedState.loading ? (
          <div className=" ml-2 text-lg">
            <CircularProgress size={24} />
          </div>
        ) : likedState.selected ? (
          <div className=" ml-2 text-lg text-blue-600">
            <ThumbUpIcon />
          </div>
        ) : (
          <div className=" ml-2 text-lg text-blue-400">
            <ThumbUpOffAltIcon />
          </div>
        )}
      </div>
      <div
        className="flex items-center cursor-pointer  space-x-1 rounded p-[3px]  ml-2 text-lg transition-colors duration-200 text-green-s text-dark-gray-6"
        onClick={handleDislike}
      >
        {dislikedState.loading ? (
          <div className=" ml-2 text-lg">
            <CircularProgress size={24} />
          </div>
        ) : dislikedState.selected ? (
          <div className="text-blue-600  ml-2 text-lg">
            <ThumbDownIcon />
          </div>
        ) : (
          <div className=" ml-2 text-lg text-blue-400">
            <ThumbDownOffAltIcon />
          </div>
        )}
        <span className="text-xs"></span>
      </div>
      <div
        className="cursor-pointer   rounded  ml-2 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 "
        onClick={handleStar}
      >
        {starredState.loading ? (
          <div className=" ml-2 text-lg">
            <CircularProgress size={24} />
          </div>
        ) : starredState.selected ? (
          <div className=" text-yellow-500 ml-2 text-lg">
            <StarIcon />
          </div>
        ) : (
          <div className="text-yellow-500  ml-2 text-lg">
            <StarBorderIcon />
          </div>
        )}
      </div>
      {solvedState.selected && !solvedState.loading ? (
        <div className="rounded  ml-2 text-lg transition-colors duration-200 text-green-s text-dark-green-s">
          <CheckCircleOutlineIcon titleAccess="Solved" />
        </div>
      ) : (
        solvedState.loading && (
          <div className=" ml-2 text-lg">
            <CircularProgress size={24} />
          </div>
        )
      )}
    </div>
  );
};
export default ProblemFeedbacks;
