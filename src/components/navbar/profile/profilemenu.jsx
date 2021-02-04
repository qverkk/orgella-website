import { useRouter } from "next/router";
import {
  fetchUser,
  logoutUser,
} from "../../../apis/services/userServiceWorker";
import { authStore } from "../../../store/zustand";
import LoggedInProfile from "./loggedin/profile-in";
import LoggedOutProfile from "./loggedout/profile-out";

export default function ProfileMenu() {
  const router = useRouter();
  const stateLogout = authStore((state) => state.logout);
  const authenticated = authStore((store) => store.authenticated);
  const authenticate = authStore((store) => store.authenticate);
  const userDetails = authStore((store) => store.userDetails);
  const setUserDetails = authStore((store) => store.setUserDetails);

  if (!userDetails) {
    fetchUser().then((result) => {
      if (result.error) {
        stateLogout();
      } else {
        setUserDetails(result.userDetails);
        authenticate();
      }
    });
  }

  function logout() {
    logoutUser(() => {
      stateLogout();
    });

    router.push("/");
  }

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
