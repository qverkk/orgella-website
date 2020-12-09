import Link from "next/link"
import Layout from "../../components/layout";
import Head from 'next/head';

function FirstPost() {
  return (
    <Layout>
      <Head>
        <title>First post</title>
      </Head>
      <h1>First post</h1>
      <Link href="/">Back home</Link>
    </Layout>
  );
}

export default FirstPost;
