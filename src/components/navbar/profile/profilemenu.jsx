import { useRouter } from "next/router";
import { authStore } from "../../../store/zustand";
import LoggedInProfile from "./loggedin/profile-in";
import LoggedOutProfile from "./loggedout/profile-out";

export default function ProfileMenu() {
  const router = useRouter();

  function logout() {
    router.push("/");
  }

  const authenticated = authStore((store) => store.authenticated);

  return (
    <>
      {authenticated ? (
        <LoggedInProfile logout={() => logout()} />
      ) : (
        <LoggedOutProfile />
      )}
    </>
  );
}
