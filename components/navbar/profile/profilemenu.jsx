import { useState } from "react";
import LoggedInProfile from "./loggedin/profile-in";
import LoggedOutProfile from "./loggedout/profile-out";

export default function ProfileMenu() {
  const [loggedin, setLoggedin] = useState(false);

  function login() {
    setLoggedin(true);
  }

  function logout() {
    setLoggedin(false);
  }

  return (
    <>
      {loggedin ? (
        <LoggedInProfile logout={() => logout()} />
      ) : (
        <LoggedOutProfile login={() => login()} />
      )}
    </>
  );
}
