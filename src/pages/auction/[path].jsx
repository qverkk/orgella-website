import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Heading,
  Image,
  Stack,
  Tag,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import ReactStars from "react-rating-stars-component";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  getAuctionDetails,
  getAuctionReviews,
  getAuctionReviewsSum,
} from "../../apis/services/auctionServiceWorker";
import { addItemToBasket } from "../../apis/services/basketServiceWorker";
import { purchaseItems } from "../../apis/services/ordersServiceWorker";
import { fetchUser } from "../../apis/services/userServiceWorker";
import Navbar from "../../components/navbar/navbar";
import SliderInput from "../../components/utils/sliderinput";
import { authStore, ordersStore } from "../../store/zustand";
import useSWR from "swr";
import PageNavigation from "../../components/navigation/pagenavigation";

function useReviews(display, auctionPath, page) {
  const { data, error, mutate } = useSWR(
    display
      ? `/api/auctions-ws/auctions/reviews/${auctionPath}?page=${page}`
      : null,
    getAuctionReviews(display, auctionPath, page || 0)
  );

  if (!data) {
    return {
      maxReviewsPages: 1,
      reviews: [],
    };
  }

  return {
    reviews: data.items,
    maxReviewsPages: data.maxPages,
    reviewsMutate: mutate,
  };
}

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("-");
}

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
  const [reviewsRating, setReviewsRating] = useState();
  const [amount, setAmount] = useState(0);
  const [page, setPage] = useState(0);
  const [displayReviews, setDisplayReviews] = useState(false);
  const { path } = router.query;
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const { reviews, maxReviewsPages, reviewsMutate } = useReviews(
    displayReviews,
    path,
    page || 0
  );

  const onReviewPageChange = (number) => {
    setPage(number);
    reviewsMutate(`/api/auctions-ws/auctions/reviews/${number}?page=${number}`);
  };

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
      getAuctionReviewsSum(path, (result) => {
        const { data, status } = result;
        if (status == 200) {
          setReviewsRating(data);
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
                    {reviewsRating && (
                      <ReactStars
                        count={5}
                        size={24}
                        edit={false}
                        value={reviewsRating.rating}
                        activeColor="#ffd700"
                      />
                    )}
                    {reviewsRating ? reviewsRating.count : 0} ocen produktu
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

            <Box boxShadow="dark-lg" p="6" rounded="md" mt={10}>
              <Button
                colorScheme={displayReviews ? "teal" : "green"}
                onClick={() => {
                  setDisplayReviews(!displayReviews);
                }}
                w="100%"
              >
                {displayReviews ? "Ukryj opinie" : "Pokaż opinie"}
              </Button>
              {displayReviews && reviews && reviews.length > 0 && (
                <Box>
                  {reviews.map((review) => (
                    <Box
                      key={review.reviewerUsername + review.date}
                      p={6}
                      borderBottom="1px"
                    >
                      <Box d="flex">
                        <Tag
                          p={2}
                          mr={3}
                          borderRadius="full"
                          px="2"
                          colorScheme="green"
                        >
                          {review.reviewerUsername}
                        </Tag>
                        <ReactStars
                          count={5}
                          size={24}
                          edit={false}
                          value={review.rating}
                          activeColor="#ffd700"
                        />
                      </Box>
                      <Box pt={2}>
                        <Text>Dnia {formatDate(review.date)}</Text>
                      </Box>
                      <Box pt={3}>
                        <Text>{review.description}</Text>
                      </Box>
                    </Box>
                  ))}
                  <PageNavigation
                    currentPage={page || 0}
                    maxPages={maxReviewsPages}
                    onPageChange={(number) => {
                      onReviewPageChange(number);
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
