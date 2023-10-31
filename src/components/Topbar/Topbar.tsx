import { auth } from "@/firebase/firebase";
import React from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import Navbar from "../Navbar/Navbar";

type TopbarProps = {
  problemPage?: boolean;
};

/**
 * Component that is used to render the topbar and contains the logic
 *
 * @param problemPage : Boolean that decides if the component is used in problems page or not
 */
const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  return (
    <Navbar
      handleLogout={signOut}
      isLoggedIn={!!user}
      userName={user?.displayName}
    />
  );
};

export default Topbar;
