import { ISettings } from "@/components/Workspace/CodeEditor/CodeEditor";
import { SetStateAction, useState } from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { Button } from "@mui/material";

const EDITOR_FONT_SIZES = [
  "12px",
  "13px",
  "14px",
  "15px",
  "16px",
  "17px",
  "18px",
  "20px",
  "22px",
  "24px",
  "28px",
  "32px",
];

interface SettingsModalProps {
  settings: ISettings;
  setSettings: (
    setStateValue: SetStateAction<ISettings>,
    fontSizeForLocalData?: string
  ) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  setSettings,
  settings,
}) => {
  const [localFontSize, setLocalFontSize] = useState(settings.fontSize);
  const open = settings.settingsModalIsOpen;
  const handleClose = () => {
    setLocalFontSize(settings.fontSize);
    setSettings((prev) => ({ ...prev, settingsModalIsOpen: false }));
  };

  const handleFontSizeMenuItemClick = (event: SelectChangeEvent) => {
    setLocalFontSize(event.target.value as string);
  };

  const handleSaveButtonClick = () => {
    setSettings(
      (prev) => ({
        ...prev,
        settingsModalIsOpen: false,
        fontSize: localFontSize,
      }),
      localFontSize
    );
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="bg-gray-700 w-full max-w-md mx-auto mt-16 rounded-lg shadow-lg text-gray-50">
          <div className="flex justify-between items-center m-4">
            <Typography variant="h6">Settings</Typography>
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClose}
            >
              <CloseIcon className="text-gray-100" />
            </IconButton>
          </div>
          <div className="m-4">
            <div className="flex items-center gap-6">
              <InputLabel
                id="settings-font-size-select-label"
                className="text-gray-50 text-lg"
              >
                Font Size
              </InputLabel>
              <Select
                labelId="settings-font-size-select-label"
                id="settings-font-size-select"
                value={localFontSize}
                onChange={handleFontSizeMenuItemClick}
                sx={{
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(228, 219, 233, 0.25)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(228, 219, 233, 0.25)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(228, 219, 233, 0.25)",
                  },
                  ".MuiSvgIcon-root ": {
                    fill: "white !important",
                  },
                }}
              >
                {EDITOR_FONT_SIZES.map((fontSize, index) => (
                  <MenuItem
                    value={fontSize}
                    key={`settings-font-size-item${index}`}
                  >
                    {fontSize}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex">
            <Button
              className="ml-auto mr-5 mb-6"
              variant="contained"
              onClick={handleSaveButtonClick}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default SettingsModal;
