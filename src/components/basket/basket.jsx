import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { cartStore } from "../../store/zustand";

export default function Basket() {
  const items = cartStore((state) => state.items);
  const removeItem = cartStore((state) => state.removeProductByAuctionPath);

  const itemsList = items.map((item) => (
    <Box key={item.product.auctionPath} boxShadow="dark-lg" p={5} mt={3}>
      <HStack>
        <Image
          alt="{item.product.title} image"
          src={`data:image/png;base64,${item.product.thumbnail}`}
          boxSize="50px"
        />
        <VStack pl={5} align="left">
          <Text>{item.product.title}</Text>
          <Text>
            {item.amount}x {item.product.price} zł
          </Text>
        </VStack>
      </HStack>
      <Button
        colorScheme="red"
        w="100%"
        mt={2}
        onClick={() => {
          removeItem(item.product.auctionPath);
        }}
      >
        Usuń
      </Button>
    </Box>
  ));

  const totalSum = items.reduce(
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
