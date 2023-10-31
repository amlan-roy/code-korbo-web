import { authPageState } from "@/atoms/authModalAtom";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Input from "@mui/material/Input";
import { useSetRecoilState } from "recoil";
import { CircularProgress } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import ColorButton from "@/components/Buttons/ColorButton";

interface ResetPasswordForm {
  email: string;
}

type ResetPasswordProps = {};

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>();
  const [isLoading, setIsLoading] = useState(false);
  const setAuthPageState = useSetRecoilState(authPageState);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const showLoginPage = () => {
    setAuthPageState("login");
    setIsLoading(false);
    setShowConfirmation(false);
  };

  const onSubmit: SubmitHandler<ResetPasswordForm> = async ({ email }) => {
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      setIsLoading(false);
      setShowConfirmation(true);
    } catch (error: any) {
      setIsLoading(false);
      alert(error.message);
    }
  };

  return (
    <div className="w-full justify-center flex flex-col max-w-md">
      <div className="flex flex-col gap-1">
        {showConfirmation ? (
          <>
            <Typography variant="h4">Email Sent</Typography>
            <Typography variant="subtitle1">
              An email has been sent to the provided email address with details
              to reset the password
            </Typography>
            <Typography variant="subtitle1">
              After resetting your password, You can{" "}
              <strong className="cursor-pointer" onClick={showLoginPage}>
                {" "}
                Login here!
              </strong>
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h4">Reset password</Typography>
            <Typography variant="subtitle1">
              If you remembered your password
            </Typography>
            <Typography variant="subtitle1">
              You can{" "}
              <strong className="cursor-pointer" onClick={showLoginPage}>
                {" "}
                Login here!
              </strong>
            </Typography>
          </>
        )}
      </div>
      {!showConfirmation && (
        <form
          className="flex flex-col gap-8 my-10 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <InputLabel htmlFor="email-input-rest-password">Email</InputLabel>
            <Input
              id="email-input-rest-password"
              placeholder="Enter your email id"
              type="email"
              fullWidth
              startAdornment={
                <InputAdornment position="start">
                  <EmailOutlinedIcon />
                </InputAdornment>
              }
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
              error={!!errors.email}
              disabled={isLoading}
            />
            <Typography color="red" variant="caption">
              {errors.email ? "Please enter a valid email address" : ""}
            </Typography>
          </div>
          <ColorButton
            variant="contained"
            fullWidth
            sx={{ borderRadius: 10, marginTop: 2 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading && (
              <CircularProgress size={"20px"} sx={{ marginX: "1rem" }} />
            )}
            Reset password
          </ColorButton>
        </form>
      )}
    </div>
  );
};
export default ResetPassword;
