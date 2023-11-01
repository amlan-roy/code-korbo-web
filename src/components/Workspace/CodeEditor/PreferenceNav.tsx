"use client";

import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  MouseEventHandler,
} from "react";
import { ISettings } from "@/components/Workspace/CodeEditor/CodeEditor";
import { TFormattedSolution } from "@/utils/types/question";
import SettingsModal from "@/components/Modals/SettingsModal";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

type PreferenceNavProps = {
  settings: ISettings;
  languages: TFormattedSolution[];
  selectedLanguage: TFormattedSolution;
  setSelectedLanguage: Dispatch<SetStateAction<TFormattedSolution>>;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
  onResetCode: MouseEventHandler<HTMLAnchorElement>;
  setFontSize: any;
};

const PreferenceNav: React.FC<PreferenceNavProps> = ({
  setSettings,
  settings,
  languages,
  selectedLanguage,
  setSelectedLanguage,
  onResetCode,
  setFontSize,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    function exitHandler(e: any) {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        return;
      }
      setIsFullScreen(true);
    }

    if (document.addEventListener) {
      document.addEventListener("fullscreenchange", exitHandler);
      document.addEventListener("webkitfullscreenchange", exitHandler);
      document.addEventListener("mozfullscreenchange", exitHandler);
      document.addEventListener("MSFullscreenChange", exitHandler);
    }
  }, [isFullScreen]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newLang = languages.find(
      (language) => language.languageId === event.target.value
    );
    newLang && setSelectedLanguage(newLang);
  };

  const setSettingsAndLocalData = (
    setStateValue: SetStateAction<ISettings>,
    fontSizeForLocalData?: string
  ) => {
    setSettings(setStateValue);
    fontSizeForLocalData && setFontSize(fontSizeForLocalData);
  };

  return (
    <>
      <div className="flex items-center justify-between bg-slate-50 w-full p-2 py-1 flex-wrap">
        <div className="flex flex-wrap">
          <Select
            value={selectedLanguage.languageId}
            label="Select Languages"
            variant="outlined"
            size="small"
            onChange={handleChange}
          >
            {languages.map(({ languageId, languageName }) => (
              <MenuItem
                color={"white"}
                value={languageId}
                key={`languages-to-select-${languageId}`}
              >
                {languageName}
              </MenuItem>
            ))}
          </Select>
          <IconButton
            onClick={onResetCode}
            title="Reset code"
            type="button"
            href="/"
          >
            <RestartAltIcon fontSize="medium" />
          </IconButton>
        </div>

        <div className="flex items-center m-2 gap-2">
          <Button
            variant="outlined"
            onClick={() =>
              setSettings({ ...settings, settingsModalIsOpen: true })
            }
          >
            <SettingsOutlinedIcon className="mr-2" />
            Settings
          </Button>

          <Button variant="outlined" onClick={handleFullScreen}>
            {!isFullScreen ? (
              <FullscreenIcon className="mr-2" />
            ) : (
              <FullscreenExitIcon className="mr-2" />
            )}{" "}
            Full Screen
          </Button>
        </div>
      </div>
      {settings.settingsModalIsOpen && (
        <SettingsModal
          settings={settings}
          setSettings={setSettingsAndLocalData}
        />
      )}
    </>
  );
};
export default PreferenceNav;
