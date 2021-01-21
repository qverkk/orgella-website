export default function Profile({ user }) {
  return (
    <>
      {user}
      <p>Profile</p>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const user = req.headers.cookie;

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}
