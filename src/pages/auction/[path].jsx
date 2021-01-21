import { useRouter } from "next/router";
import Navbar from "../../components/navbar/navbar";

export default function AuctionDetails() {
  const router = useRouter();
  const { path } = router.query;
  return (
    <>
      <Navbar />
      {path}
    </>
  );
}
