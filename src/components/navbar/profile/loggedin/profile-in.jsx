export default function LoggedInProfile({ logout }) {
  return (
    <>
      <div>Logged in</div>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
    </>
  );
}
