import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function LoadingPage() {
  return (
    <Box className="max-w-[1440px] mx-auto flex w-full grow justify-center items-center">
      <CircularProgress />
    </Box>
  );
}
