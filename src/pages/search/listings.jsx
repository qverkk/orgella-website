import { Box, Button, Center, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { findAuctions } from "../../apis/services/auctionServiceWorker";
import Auction from "../../components/auctions/auction";
import Navbar from "../../components/navbar/navbar";

export default function Listings() {
  const router = useRouter();

  const [auctions, setAuctions] = useState();
  const [error, setError] = useState();
  const { query, category } = router.query;

  useEffect(() => {
    if (query && category) {
      findAuctions(query, category, (result) => {
        const { data, status } = result;
        if (status == 200) {
          setAuctions(data);
        } else {
          setError("Some error occured");
        }
      });
    }
  }, [query, category]);

  return (
    <>
      <Navbar />
      <Box maxW="1600px" mx="auto" mt={5}>
        {!query && <Heading>Brak frazy wyszukiwania</Heading>}
        {error && <p>{error}</p>}
        {query && !error && !auctions && (
          <Button
            isLoading
            loadingText="Ładuję..."
            colorScheme="teal"
            variant="outline"
            w="100%"
          />
        )}
        {auctions && auctions.length > 0
          ? auctions.map((auction) => (
              <Auction w="100%" key={auction.auctionPath} data={auction} />
            ))
          : !error && (
              <Heading>
                Brak aukcji dla {query} w kategorii {category}
              </Heading>
            )}
      </Box>
    </>
  );
}
