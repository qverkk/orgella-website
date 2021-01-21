import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  useNumberInput,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAuctionDetails } from "../../apis/services/auctionServiceWorker";
import Navbar from "../../components/navbar/navbar";

export default function AuctionDetails() {
  const router = useRouter();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState();
  const { path } = router.query;

  const SliderInput = () => {
    const [value, setValue] = useState(0);
    const handleChange = (value) => setValue(value);

    return (
      <Flex>
        <NumberInput
          maxW="100px"
          mr="2rem"
          value={value}
          onChange={handleChange}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Slider
          flex="1"
          w={300}
          value={value}
          onChange={handleChange}
          max={details.quantity}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb fontSize="sm" boxSize="32px" children={value} />
        </Slider>
      </Flex>
    );
  };

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
                      <SliderInput />
                    </VStack>
                    <Button colorScheme="teal">Dodaj do koszyka</Button>
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
