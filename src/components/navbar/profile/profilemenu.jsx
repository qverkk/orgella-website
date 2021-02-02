import { useRouter } from "next/router";
import { logoutUser } from "../../../apis/services/userServiceWorker";
import { authStore } from "../../../store/zustand";
import LoggedInProfile from "./loggedin/profile-in";
import LoggedOutProfile from "./loggedout/profile-out";

export default function ProfileMenu() {
  const router = useRouter();
  const stateLogout = authStore((state) => state.logout);

  function logout() {
    logoutUser(() => {
      stateLogout();
    });

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
