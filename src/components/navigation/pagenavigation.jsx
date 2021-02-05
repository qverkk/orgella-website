import { Box, Button, Center } from "@chakra-ui/react";

export default function PageNavigation({
  currentPage,
  maxPages,
  onPageChange,
}) {
  var pages = [];
  for (var i = 0; i < maxPages; i++) {
    pages.push(i);
  }

  const buttons = pages.map((number) => (
    <Button
      key={number}
      colorScheme={currentPage == number ? "teal" : "gray"}
      onClick={() => {
        if (currentPage != number) {
          onPageChange(number);
        }
      }}
      m={1}
    >
      {number + 1}
    </Button>
  ));

  return (
    <Box mt={5}>
      <Center>{buttons}</Center>
    </Box>
  );
}
