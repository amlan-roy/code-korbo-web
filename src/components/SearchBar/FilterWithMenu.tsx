import React, { useState } from "react";
import {
  Menu,
  Button,
  Box,
  Chip,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { SearchBarForm } from "./SearchBar";
import { TQuestionCategoryName } from "@/utils/types/category";
import { TQuestionDifficultyName } from "@/utils/types/difficulty";
import { TQuestionStatusName } from "@/utils/types/solutionStatus";

/**
 * id
 * button title
 * all options
 * selected options
 * onOptionClicked
 * onSelectButtonClick
 * onClearButtonClick
 * onClose
 */

type FilterWithMenuProps = {
  id: string;
  formControlName: keyof SearchBarForm;
  buttonTitle: string;
  allOptions:
    | TQuestionStatusName[]
    | TQuestionDifficultyName[]
    | TQuestionCategoryName[];
  getSelectedOptions: () =>
    | TQuestionStatusName[]
    | TQuestionDifficultyName[]
    | TQuestionCategoryName[];
  onSelectButtonClick: (
    formControlName: keyof SearchBarForm,
    selectedOptions:
      | TQuestionStatusName[]
      | TQuestionDifficultyName[]
      | TQuestionCategoryName[]
  ) => void;
  onClearButtonClick: (formControlName: keyof SearchBarForm) => void;
};

const FilterWithMenu: React.FC<FilterWithMenuProps> = ({
  formControlName,
  id,
  buttonTitle,
  allOptions,
  getSelectedOptions,
  onSelectButtonClick,
  onClearButtonClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  //Local filter state
  const [localSelectedOptions, setLocalSelectedOptions] = useState(
    getSelectedOptions() || [] || []
  );

  const open = Boolean(anchorEl);

  /**
   * callback called when the button is clicked
   * The button is clicked only for opening the menu.
   * For closing the menu, the button is disabled and only clicking outside works
   *
   * @param event
   */
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const selectedOptions = getSelectedOptions() || [];
    setLocalSelectedOptions(selectedOptions);
    setAnchorEl(event.currentTarget);
  };

  /**
   * function called when the filter menu closes
   */
  const handleClose = () => {
    setAnchorEl(null);
    setLocalSelectedOptions([]);
  };

  /**
   * function called when the menu option is clicked
   */
  const handleOptionClick = (
    option:
      | TQuestionStatusName
      | TQuestionDifficultyName
      | TQuestionCategoryName
  ) => {
    setLocalSelectedOptions(
      toggle(localSelectedOptions, option) as
        | TQuestionStatusName[]
        | TQuestionDifficultyName[]
        | TQuestionCategoryName[]
    );
  };

  const handleSelectButtonClick = () => {
    // Set the selected options value as local selected options
    onSelectButtonClick(formControlName, localSelectedOptions);
    handleClose(); // Close the modal
  };

  const handleClearAllButtonClick = () => {
    onClearButtonClick(formControlName);
    handleClose(); // Close the modal
  };

  return (
    <div id={id}>
      <Chip
        id={`${id}-button`}
        aria-controls={open ? `${id}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="min-w-[100px]"
        variant={
          (getSelectedOptions() || []).length > 0 ? "filled" : "outlined"
        }
        color="info"
        label={`${buttonTitle}${
          (getSelectedOptions() || []).length > 0
            ? " (" + (getSelectedOptions() || []).length + ") "
            : ""
        }`}
      />
      <Menu
        id={`${id}-menu`}
        anchorEl={anchorEl}
        sx={{ maxHeight: 400 }}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": `${id}-button`,
        }}
        marginThreshold={1}
      >
        <FormGroup>
          {allOptions.map((option, index) => {
            const checked = !!includes(localSelectedOptions, option);
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    onClick={() => handleOptionClick(option)}
                    checked={checked}
                  />
                }
                label={option}
                sx={{ margin: 1 }}
                key={`searching-filter-buttons-${index}`}
              />
            );
          })}
        </FormGroup>
        <Box
          width={"100%"}
          justifyContent={"space-evenly"}
          display={"flex"}
          minWidth={300}
          margin={0.5}
        >
          <Button
            id={`${id}-select-button`}
            onClick={handleSelectButtonClick}
            variant="contained"
            sx={{ margin: 0.5 }}
          >
            Select
          </Button>
          <Button
            id={`${id}-clear-button`}
            onClick={handleClearAllButtonClick}
            variant="contained"
            sx={{ margin: 0.5 }}
          >
            Clear
          </Button>
        </Box>
      </Menu>
    </div>
  );
};

export default FilterWithMenu;

const toggle = <
  T extends
    | TQuestionStatusName
    | TQuestionDifficultyName
    | TQuestionCategoryName
>(
  array: Array<T>,
  value: T
) => {
  const newArray = array.filter((x) => x !== value);
  if (newArray.length === array.length) return array.concat(value);
  return newArray;
};

// Use a generic type parameter that extends the union type of the array elements
function includes<
  T extends
    | TQuestionStatusName
    | TQuestionDifficultyName
    | TQuestionCategoryName
>(array: T[], value: T): boolean {
  // Use a type assertion to cast the value to the generic type
  return array.includes(value as T);
}
