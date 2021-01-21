import { Box, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Auction({ data }) {
  const router = useRouter();

  const showDetailedPage = () => {
    router.push("/auction/" + data.auctionPath);
  };

  return (
    <Box onClick={showDetailedPage} border="1px" mt={3} p={5}>
      <Stack direction="row">
        <Image
          alt="{data.title} image"
          src={`data:image/png;base64,${data.thumbnail}`}
          boxSize="150px"
        />
        <Flex direction="column" justify="space-between" pl={10}>
          <Heading>{data.title}</Heading>
          <Text fontSize="xl">{data.price} zł</Text>
          <Text justifyContent="flex-end">Kupiono {data.boughtQuantity}</Text>
        </Flex>
      </Stack>
    </Box>
  );
}
