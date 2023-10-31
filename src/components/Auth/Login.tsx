import { authPageState } from "@/atoms/authModalAtom";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Input from "@mui/material/Input";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { useSetRecoilState } from "recoil";
import IconButton from "@mui/material/IconButton";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import ColorButton from "@/components/Buttons/ColorButton";

interface LoginForm {
  email: string;
  password: string;
}

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const setAuthPageState = useSetRecoilState(authPageState);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const showSignupPage = () => {
    setAuthPageState("register");
  };

  const showResetPassword = () => {
    setAuthPageState("forgotPassword");
  };

  const onSubmit: SubmitHandler<LoginForm> = async ({ email, password }) => {
    try {
      setIsLoading(true);
      const newUser = await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      if (!newUser) return;
      router.push("/");
    } catch (error: any) {
      setIsLoading(false);
      alert(error.message);
    }
  };

  return (
    <div className="w-full justify-center flex flex-col max-w-md">
      <div className="flex flex-col gap-1">
        <Typography variant="h4">Sign in</Typography>
        <Typography variant="subtitle1">If you dont have an account</Typography>
        <Typography variant="subtitle1">
          You can{" "}
          <strong className="cursor-pointer" onClick={showSignupPage}>
            {" "}
            Register here!
          </strong>
        </Typography>
      </div>
      <form
        className="flex flex-col gap-8 my-10 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <InputLabel htmlFor="email-input-login">Email</InputLabel>
          <Input
            id="email-input-login"
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
        <div>
          <InputLabel htmlFor="password-input-login">Password</InputLabel>
          <Input
            id="password-input-login"
            placeholder="Enter your password"
            type="password"
            fullWidth
            startAdornment={
              <InputAdornment position="start">
                <LockOpenOutlinedIcon />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityOff sx={{ width: 2, height: 2 }} />
                  ) : (
                    <Visibility sx={{ width: 2, height: 2 }} />
                  )}
                </IconButton>
              </InputAdornment>
            }
            {...register("password", { required: true })}
            error={!!errors.password}
            disabled={isLoading}
          />
          <Typography color="red" variant="caption">
            {errors.password ? "Please enter your password" : ""}
          </Typography>
          <Typography
            mt={1}
            ml={"auto"}
            onClick={showResetPassword}
            className="cursor-pointer w-fit"
          >
            Forgot password?
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
          Sign In
        </ColorButton>
      </form>
    </div>
  );
};
export default Login;
