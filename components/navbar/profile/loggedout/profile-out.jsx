import { useRouter } from "next/router";

export default function LoggedOutProfile({ login }) {
  const router = useRouter();

  const forwardToLoginPage = () => {
    router.push("/login");
  };

  const forwardToRegisterPage = () => {
    router.push("/register");
  };

  return (
    <>
      <div>Orgella logo</div>
      <div>Important message from Orgella</div>
      <div>Description of why Orgella is great</div>
      <div>
        <button onClick={forwardToLoginPage}>Zaloguj sie</button>
      </div>
      <div onClick={forwardToRegisterPage}>Zarejestruj sie</div>
    </>
  );
}
