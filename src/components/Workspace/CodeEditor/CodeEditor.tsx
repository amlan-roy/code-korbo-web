import React, {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { TFormattedQuestion, TFormattedSolution } from "@/utils/types/question";
import PreferenceNav from "./PreferenceNav";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";

type CodeEditorProps = {
  problem: TFormattedQuestion;
  selectedLanguage: TFormattedSolution;
  setSelectedLanguage: Dispatch<SetStateAction<TFormattedSolution>>;
  setUserCode: Dispatch<SetStateAction<string>>;
  userCode: string;
};

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  problem,
  selectedLanguage,
  setSelectedLanguage,
  setUserCode,
  userCode,
}) => {
  const [user] = useAuthState(auth);
  const localCodeStorageKey = `code-${user?.uid}-${problem.id}-${selectedLanguage.languageId}`;
  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");

  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  });

  useEffect(() => {
    const item = window.localStorage.getItem(localCodeStorageKey);
    if (item) {
      setUserCode(item);
    }
  }, []);

  const getLanguageExtension = (selectedLanguage: TFormattedSolution) => {
    const langName = selectedLanguage.languageName
      .replace(/\(.*?\)/, "")
      .trim()
      .toLowerCase();

    return langName === "c++" ? "cpp" : langName;
  };

  const selectedLangName = getLanguageExtension(selectedLanguage);

  const onChange = (value: string | undefined) => {
    setUserCode(value || "");
    localStorage.setItem(localCodeStorageKey, value || "");
  };

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    fontSize: parseInt(settings.fontSize) || 16,
    automaticLayout: true,
  };

  const onResetCode: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    const resetCode = `${selectedLanguage.starterCode}${"\n".repeat(15)}`;
    setUserCode(resetCode);
    localStorage.setItem(localCodeStorageKey, resetCode);
  };

  useEffect(() => {
    const localCodeSnippet = localStorage.getItem(localCodeStorageKey);
    const code =
      localCodeSnippet || `${selectedLanguage.starterCode}${"\n".repeat(15)}`;
    localStorage.setItem(localCodeStorageKey, code);
    setUserCode(code);
  }, [selectedLanguage]);

  return (
    <div className="flex flex-col bg-dark-layer-1 flex-1">
      <PreferenceNav
        setSelectedLanguage={setSelectedLanguage}
        selectedLanguage={selectedLanguage}
        settings={settings}
        setSettings={setSettings}
        languages={problem.solutions}
        onResetCode={onResetCode}
        setFontSize={setFontSize}
      />
      <Editor
        theme="vs-dark"
        language={selectedLangName}
        value={userCode}
        onChange={onChange}
        options={editorOptions}
      />
    </div>
  );
};
export default CodeEditor;
