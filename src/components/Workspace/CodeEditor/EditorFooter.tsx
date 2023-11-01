import React, { Dispatch, SetStateAction } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";

type EditorFooterProps = {
  setActiveTabIndex: Dispatch<SetStateAction<number>>;
  submitTestCases: Function;
  setSubmitExecution: Dispatch<SetStateAction<boolean>>;
  isRunning?: boolean;
  handleCancel?: () => void;
};

const EditorFooter: React.FC<EditorFooterProps> = ({
  setActiveTabIndex,
  submitTestCases,
  setSubmitExecution,
  isRunning,
  handleCancel,
}) => {
  const handleRun = () => {
    // set console as the active tab (console is the 3rd tab)
    setActiveTabIndex(2);
    submitTestCases();
    setSubmitExecution(false);
  };

  const handleSubmit = () => {
    // set console as the active tab (console is the 3rd tab)
    setActiveTabIndex(2);
    submitTestCases();
    setSubmitExecution(true);
  };

  return (
    <div className="flex bg-dark-layer-1 w-full">
      <div className="mx-5 my-[10px] flex justify-end w-full">
        <div className="ml-auto flex items-center space-x-4">
          {isRunning ? (
            <Button
              onClick={() => handleCancel && handleCancel()}
              variant="contained"
              color="error"
            >
              Stop
            </Button>
          ) : (
            <>
              <Button onClick={handleRun} variant="contained" color="warning">
                Run
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="success"
              >
                Submit
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default EditorFooter;
