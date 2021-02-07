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
  HStack,
  Image,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import useSWR from "swr";
import {
  deleteBasketItemForUser,
  getUserBasket,
} from "../../apis/services/basketServiceWorker";
import { purchaseItems } from "../../apis/services/ordersServiceWorker";
import { fetchUser } from "../../apis/services/userServiceWorker";
import { authStore, ordersStore } from "../../store/zustand";
import LoggedOutProfile from "../navbar/profile/loggedout/profile-out";

export default function Basket() {
  const router = useRouter();
  const setUserDetails = authStore((state) => state.setUserDetails);
  const userDetails = authStore((state) => state.userDetails);
  const logout = authStore((state) => state.logout);
  const authenticated = authStore((state) => state.authenticated);
  const toast = useToast();
  const setOrdersInformation = ordersStore(
    (state) => state.setOrdersInformation
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const { data, error, mutate } = useSWR(
    userDetails ? "/api/users-basket-ws/basket/" + userDetails.userId : null,
    getUserBasket(userDetails ? userDetails.userId : null),
    {
      refreshInterval: 10000,
    }
  );

  const performPurchasingItems = () => {
    var result = [];

    data.products.forEach((elem) => {
      result.push({
        quantity: elem.amount,
        productPath: elem.product.auctionPath,
      });
    });

    purchaseItems(
      {
        userId: userDetails.userId,
        products: result,
        buynow: false,
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
          mutate("/api/users-basket-ws/basket/" + userDetails.userId);
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
    if (!userDetails) {
      fetchUser().then((result) => {
        if (result.error) {
          logout();
        } else {
          setUserDetails(result.userDetails);
        }
      });
    }
  }, []);

  if (!userDetails || !authenticated) {
    return <LoggedOutProfile />;
  }

  if (error)
    return <div>Błąd podczas ładowania koszyka, spróbuj ponownie.</div>;
  if (!data || !data.products) return <div>Ładuję...</div>;

  const itemsList = data.products
    ? data.products.map((item) => (
        <Box key={item.product.auctionPath} boxShadow="dark-lg" p={5} mt={3}>
          <HStack>
            <Image
              alt="{item.product.title} image"
              src={`data:image/png;base64,${item.product.thumbnail}`}
              boxSize="50px"
            />
            <VStack pl={5} align="left">
              <Text
                onClick={() => {
                  router.push({
                    pathname: "/auction/" + item.product.auctionPath,
                  });
                }}
              >
                {item.product.title}
              </Text>
              <Text>
                {item.amount}x {item.product.price} zł
              </Text>
            </VStack>
          </HStack>
          <Button
            colorScheme="red"
            w="100%"
            mt={2}
            onClick={async () => {
              deleteBasketItemForUser(
                item.product.auctionPath,
                userDetails.userId
              );
              mutate("/api/users-basket-ws/basket/" + userDetails.userId);
            }}
          >
            Usuń
          </Button>
        </Box>
      ))
    : "No data";

  const totalSum = data.products.reduce(
    (a, v) => (a = a + v.product.price * v.amount),
    0
  );

  return (
    <Box>
      {itemsList}
      <Box mt={5}>Łączna suma: {totalSum} zł</Box>
      <Button
        w="100%"
        colorScheme="green"
        mt={5}
        onClick={totalSum > 0 ? onOpen : null}
      >
        Kup teraz!
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
            Czy jesteś pewien, że chcesz dokonać zakupu na kwotę {totalSum} zł.
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
    </Box>
  );
}
