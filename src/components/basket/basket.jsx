import { Box, Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import {
  deleteBasketItemForUser,
  getUserBasket,
} from "../../apis/services/basketServiceWorker";
import { fetchUser } from "../../apis/services/userServiceWorker";
import { authStore } from "../../store/zustand";
import LoggedOutProfile from "../navbar/profile/loggedout/profile-out";

export default function Basket() {
  const router = useRouter();
  const setUserDetails = authStore((state) => state.setUserDetails);
  const userDetails = authStore((state) => state.userDetails);
  const logout = authStore((state) => state.logout);
  const authenticated = authStore((state) => state.authenticated);

  const { data, error, mutate } = useSWR(
    userDetails ? "/api/users-basket-ws/basket/" + userDetails.userId : null,
    getUserBasket(userDetails ? userDetails.userId : null),
    {
      refreshInterval: 10000,
    }
  );

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
      <Button w="100%" colorScheme="green" mt={5}>
        Kup teraz!
      </Button>
    </Box>
  );
}
