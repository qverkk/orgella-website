import { useRouter } from "next/router";
import { useState } from "react";
import LoggedInProfile from "./loggedin/profile-in";
import LoggedOutProfile from "./loggedout/profile-out";

export default function ProfileMenu() {
  const router = useRouter();
  const [loggedin, setLoggedin] = useState(false);

  function logout() {
    router.push("/");
  }

  return (
    <>
      {loggedin ? (
        <LoggedInProfile logout={() => logout()} />
      ) : (
        <LoggedOutProfile />
      )}
    </>
  );
}
