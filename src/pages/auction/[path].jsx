import {
  Box,
  Button,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAuctionDetails } from "../../apis/services/auctionServiceWorker";
import Navbar from "../../components/navbar/navbar";
import SliderInput from "../../components/utils/sliderinput";
export default function AuctionDetails() {
  const router = useRouter();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState();
  const [amount, setAmount] = useState(0);
  const { path } = router.query;

  useEffect(() => {
    if (path) {
      setLoading(true);
      getAuctionDetails(path, (result) => {
        const { data, status } = result;
        if (status == 200) {
          setDetails(data);
        } else {
          setError("Some error occured");
        }
      });
    }
  }, [path]);

  const updateAmount = (value) => {
    setAmount(value);
  };

  const addToCart = () => {
    if (amount > 0) {
      addItem({
        amount: amount,
        product: details,
      });
    }
  };

  return (
    <>
      <Navbar />
      <Box maxW="1600px" mx="auto" mt={5}>
        {error && <p>{error}</p>}
        {!error && !details && (
          <Button
            isLoading
            loadingText="Ładuję..."
            colorScheme="teal"
            variant="outline"
            w="100%"
          />
        )}
        {details && (
          <Box>
            <Box boxShadow="dark-lg" p="6" rounded="md">
              <Stack direction="row" p={4}>
                <Image
                  alt="{details.title} image"
                  src={`data:image/png;base64,${details.thumbnail}`}
                  boxSize="500px"
                />
                <Stack direction="column">
                  <Heading>{details.title}</Heading>
                  <Text as="p">Od {details.sellerName}</Text>
                  <Text>
                    Iles gwiazdek {details.reviews.length} ocen produktu
                  </Text>
                  <Text>{details.price} zł</Text>
                  <Stack h="100%" justify="end">
                    <VStack boxShadow="outline" p={3}>
                      <Text>Liczba sztuk</Text>
                      <SliderInput
                        details={details}
                        callback={(value) => {
                          updateAmount(value);
                        }}
                      />
                    </VStack>
                    <Button colorScheme="teal" onClick={addToCart}>
                      Dodaj do koszyka
                    </Button>
                    <Button colorScheme="teal">Kup teraz</Button>
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            <Box boxShadow="dark-lg" p="6" rounded="md" mt={10}>
              <Heading size="xl">Opis produktu</Heading>
              <Heading mt={5} size="l">
                {details.description}
              </Heading>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
