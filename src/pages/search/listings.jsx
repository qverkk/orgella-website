import { Box, Button, Center, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { findAuctions } from "../../apis/services/auctionServiceWorker";
import Auction from "../../components/auctions/auction";
import Navbar from "../../components/navbar/navbar";
import PageNavigation from "../../components/navigation/pagenavigation";

export default function Listings() {
  const router = useRouter();

  const [auctions, setAuctions] = useState();
  const [maxPages, setMaxPages] = useState();
  const [error, setError] = useState();
  const { query, category, page } = router.query;

  const onPageChange = (number) => {
    router.push({
      pathname: "/search/listings",
      query: {
        query: query,
        category: category,
        page: number,
      },
    });
  };

  useEffect(() => {
    if (query && category) {
      findAuctions(query, category, page || 0, (result) => {
        const { data, status } = result;
        if (status == 200) {
          setAuctions(data.items);
          setMaxPages(data.maxPages);
        } else {
          setError("Some error occured");
        }
      });
    }
  }, [query, category, page]);

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
          : !error &&
            auctions && (
              <Heading>
                Brak aukcji dla {query} w kategorii {category}
              </Heading>
            )}
        {auctions && auctions.length > 0 && (
          <PageNavigation
            currentPage={page || 0}
            maxPages={maxPages}
            onPageChange={(number) => {
              onPageChange(number);
            }}
          />
        )}
      </Box>
    </>
  );
}
