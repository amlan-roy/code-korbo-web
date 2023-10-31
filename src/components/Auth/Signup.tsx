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
import { auth, firestore } from "@/firebase/firebase";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import ColorButton from "@/components/Buttons/ColorButton";

interface SignupForm {
  email: string;
  displayName: string;
  password: string;
}

type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupForm>();

  const resetForm = () => {
    setValue("displayName", "");
    setValue("email", "");
    setValue("password", "");
  };

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

  const showLoginPage = () => {
    setAuthPageState("login");
  };

  const onSubmit: SubmitHandler<SignupForm> = async ({
    email,
    displayName,
    password,
  }) => {
    try {
      setIsLoading(true);
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      setIsLoading(false);
      if (!newUser) return;

      const userData = {
        uid: newUser.user.uid,
        email: newUser.user.email,
        displayName: displayName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        likedProblems: [],
        dislikedProblems: [],
        solvedProblems: [],
        starredProblems: [],
      };
      await setDoc(doc(firestore, "users", newUser.user.uid), userData);
      resetForm();
      router.push("/");
    } catch (error: any) {
      setIsLoading(false);
      alert(error.message);
    }
  };

  return (
    <div className="w-full justify-center flex flex-col max-w-md">
      <div className="flex flex-col gap-1">
        <Typography variant="h4">Sign up</Typography>
        <Typography variant="subtitle1">
          If you already have an account
        </Typography>
        <Typography variant="subtitle1">
          You can{" "}
          <strong className="cursor-pointer" onClick={showLoginPage}>
            Sign in here!
          </strong>
        </Typography>
      </div>
      <form
        className="flex flex-col gap-8 my-10 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <InputLabel htmlFor="email-input-signup">Email</InputLabel>
          <Input
            id="email-input-signup"
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
          <InputLabel htmlFor="name-input-signup">Name</InputLabel>
          <Input
            id="name-input-signup"
            placeholder="Enter your full name"
            type="text"
            fullWidth
            startAdornment={
              <InputAdornment position="start">
                <PersonOutlineOutlinedIcon />
              </InputAdornment>
            }
            {...register("displayName", { required: true })}
            error={!!errors.displayName}
            disabled={isLoading}
          />
          <Typography color="red" variant="caption">
            {errors.displayName ? "Please enter your name" : ""}
          </Typography>
        </div>
        <div>
          <InputLabel htmlFor="password-input-signup">Password</InputLabel>
          <Input
            id="password-input-signup"
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
          Sign Up
        </ColorButton>
      </form>
    </div>
  );
};
export default Signup;
