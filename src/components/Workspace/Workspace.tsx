"use client";

import { useState } from "react";
import { TFormattedQuestion } from "@/utils/types/question";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ProblemDescription from "./ProblemDescription/ProblemDescription";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  contentNotScrollable?: boolean;
  className?: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, contentNotScrollable, className, ...other } =
    props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`workspace-tabpanel-${index}`}
      aria-labelledby={`workspace-tab-${index}`}
      className={`${value !== index && "hidden"} ${"h-full w-full flex-grow"} ${
        className || ""
      } ${!contentNotScrollable ? "overflow-y-auto" : ""}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

type WorkspaceProps = {
  problem: TFormattedQuestion;
};

const Workspace: React.FC<WorkspaceProps> = ({ problem }) => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  function tabsA11yProps(index: number) {
    return {
      id: `workspace-tab-${index}`,
      "aria-controls": `workspace-tabpanel-${index}`,
    };
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
      <div className="border-b-2 border-gray-100 border-solid">
        <Tabs
          value={activeTabIndex}
          onChange={(event: React.SyntheticEvent, newValue: number) => {
            setActiveTabIndex(newValue);
          }}
          aria-label="basic tabs example"
          className="flex flex-wrap"
        >
          <Tab label="Description" {...tabsA11yProps(0)} />
          <Tab label="Code Editor" {...tabsA11yProps(1)} />
          <Tab label="Console" {...tabsA11yProps(2)} />
        </Tabs>
      </div>
      <CustomTabPanel value={activeTabIndex} index={0}>
        <ProblemDescription problem={problem} />
      </CustomTabPanel>
      <CustomTabPanel value={activeTabIndex} index={1}>
        Code Editor
      </CustomTabPanel>
      <CustomTabPanel value={activeTabIndex} index={2}>
        Console
      </CustomTabPanel>
    </div>
  );
};
export default Workspace;
