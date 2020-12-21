export default function LoggedOutProfile({ login }) {
  return (
    <>
      <div>Logo</div>
      <div>Some message</div>
      <div>Some description</div>
      <div>
        <button onClick={login}>Zaloguj sie</button>
      </div>
      <div>Zarejestruj sie</div>
    </>
  );
}
