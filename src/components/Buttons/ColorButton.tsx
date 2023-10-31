import { styled } from "@mui/material/styles";
import { Button, ButtonProps } from "@mui/material";

type ColorButtonProps = {
  backgroundColor?: string;
  backgroundActiveColor?: string;
};

const ColorButton = styled(Button)<ButtonProps & ColorButtonProps>(
  ({
    theme,
    backgroundActiveColor = "#000000",
    backgroundColor = "#2f2f2f",
  }) => ({
    color: theme.palette.getContrastText(backgroundColor),
    backgroundColor: backgroundColor,
    "&:hover": {
      backgroundColor: backgroundActiveColor,
    },
  })
);

export default ColorButton;
