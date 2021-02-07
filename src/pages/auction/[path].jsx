import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Heading,
  Image,
  Stack,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { getAuctionDetails } from "../../apis/services/auctionServiceWorker";
import { addItemToBasket } from "../../apis/services/basketServiceWorker";
import { purchaseItems } from "../../apis/services/ordersServiceWorker";
import { fetchUser } from "../../apis/services/userServiceWorker";
import Navbar from "../../components/navbar/navbar";
import SliderInput from "../../components/utils/sliderinput";
import { authStore, ordersStore } from "../../store/zustand";
export default function AuctionDetails() {
  const router = useRouter();
  const [error, setError] = useState();
  const userDetails = authStore((state) => state.userDetails);
  const setUserDetails = authStore((state) => state.setUserDetails);
  const logout = authStore((state) => state.logout);
  const setOrdersInformation = ordersStore(
    (state) => state.setOrdersInformation
  );
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState();
  const [amount, setAmount] = useState(0);
  const { path } = router.query;
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const performPurchasingItems = () => {
    if (userDetails == null) {
      toast({
        title: "Uwaga!",
        description: "Musisz być zalogowany aby dokonać zakupu!",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    var result = [];

    result.push({
      quantity: amount,
      productPath: path,
    });

    purchaseItems(
      {
        userId: userDetails.userId,
        products: result,
        buynow: true,
      },
      userDetails.userId,
      (result) => {
        const { data, status } = result;
        if (status == 200) {
          if (data.failedOrders.length > 0 && data.createdItems.length <= 0) {
            toast({
              title: "Uwaga!",
              description:
                "Nie udało się nic kupić! Zmień ilość produktów w zamówieniu!",
              status: "error",
              duration: 4000,
              isClosable: true,
            });
          } else if (
            data.failedOrders.length > 0 &&
            data.createdItems.length > 0
          ) {
            toast({
              title: "Ostrożnie!",
              description: "Udało się zakupić niektóre produkty.",
              status: "warning",
              duration: 4000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Gratulacje!",
              description: "Udało się zakupić dane produkty!",
              status: "success",
              duration: 4000,
              isClosable: true,
            });
          }

          setOrdersInformation(data);
          router.push("/orders/summary");
        } else {
          toast({
            title: "Uwaga!",
            description: "Wystąpił jakiś błąd!",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      }
    );
    onClose();
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
    if (!userDetails) {
      fetchUser().then((result) => {
        if (result.error) {
          logout();
        } else {
          setUserDetails(result.userDetails);
        }
      });
    }
  }, [path]);

  const updateAmount = (value) => {
    setAmount(value);
  };

  const addToCart = () => {
    if (!userDetails) {
      toast({
        title: "Błąd!.",
        description: "Musisz być zalogowany aby dodać item do koszyka.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (amount > 0) {
      addItemToBasket(
        {
          basketItems: [
            {
              quantity: amount,
              auctionPath: details.auctionPath,
            },
          ],
        },
        userDetails.userId
      );
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
              <Stack
                direction={{
                  base: "column",
                  lg: "row",
                }}
                p={4}
              >
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
                  <Text>Cena za sztukę: {details.price} zł</Text>
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
                    <Button
                      colorScheme="teal"
                      onClick={amount > 0 ? onOpen : null}
                    >
                      Kup teraz
                    </Button>

                    <AlertDialog
                      motionPreset="slideInBottom"
                      leastDestructiveRef={cancelRef}
                      onClose={onClose}
                      isOpen={isOpen}
                      isCentered
                    >
                      <AlertDialogOverlay />

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          Czy na pewno chcesz dokonać zakupu?
                        </AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody>
                          Czy jesteś pewien, że chcesz dokonać zakupu na kwotę{" "}
                          {amount * details.price} zł.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                          <Button
                            colorScheme="red"
                            variant="outline"
                            ref={cancelRef}
                            onClick={onClose}
                          >
                            Nie
                          </Button>
                          <Button
                            colorScheme="green"
                            variant="outline"
                            ml={3}
                            onClick={performPurchasingItems}
                          >
                            Tak
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
