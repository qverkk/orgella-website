import Head from "next/head";
import { fetchUser } from "../apis/services/userServiceWorker";
import Layout, { siteTitle } from "../components/layout";

function Home() {
  const userDetails = fetchUser();

  return (
    <>
      <Layout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>
      </Layout>
    </>
  );
}

export default Home;
