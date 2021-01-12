import { Box, Button, Heading, Image, Link, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function LoggedOutProfile({ login }) {
  const router = useRouter();

  const forwardToLoginPage = () => {
    router.push("/login");
  };

  const forwardToRegisterPage = () => {
    router.push("/register");
  };

  return (
    <Box>
      <Box mt={2}>
        <Image src="/images/logo.png" />
      </Box>
      <Box mt={2}>
        <Heading fontSize="xl">Witamy w Orgella!</Heading>
      </Box>
      <Box mt={2}>
        <Text>By zobaczyć swoje zakupy i obserwowane oferty, zaloguj się.</Text>
      </Box>
      <Box mt={2}>
        <Button onClick={forwardToLoginPage} w="100%" colorScheme="green">
          Zaloguj sie
        </Button>
      </Box>
      <Box mt={2}>
        <Button color="teal.500" w="100%" onClick={forwardToRegisterPage}>
          Zarejestruj sie
        </Button>
      </Box>
    </Box>
  );
}
