import { useRouter } from "next/router";
import Navbar from "../../components/navbar/navbar";

export default function Listings() {
  const router = useRouter();

  const { query, category } = router.query;

  return (
    <>
      <Navbar />
      <>
        <p>Listings</p>
        <p>{query}</p>
        <p>{category}</p>
      </>
    </>
  );
}
