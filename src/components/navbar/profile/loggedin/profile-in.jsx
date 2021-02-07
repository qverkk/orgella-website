import { Box, Button, ButtonGroup, Heading, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { authStore } from "../../../../store/zustand";

export default function LoggedInProfile({ logout }) {
  const userDetails = authStore((state) => state.userDetails);
  const router = useRouter();

  const goToOrdersPage = () => {
    router.push("/orders");
  };

  return (
    <Box>
      {userDetails && (
        <Box mt={5}>
          <Heading size="md">{`Welcome back ${userDetails.firstName}`}</Heading>
          <Box mt={5}>
            <Stack spacing={4}>
              <Button
                variant="outline"
                colorScheme="green"
                onClick={goToOrdersPage}
              >
                Zamówienia
              </Button>
              {userDetails.roles.includes("ROLE_SELLER") && (
                <Button variant="outline" colorScheme="green">
                  Zarządzaj zamówieniami
                </Button>
              )}
              {userDetails.roles.includes("ROLE_ADMIN") && (
                <Button variant="outline" colorScheme="green">
                  Zarządzaj użytkownikami
                </Button>
              )}
              <Button variant="outline" colorScheme="green">
                Ustawienia
              </Button>
            </Stack>
          </Box>
          <Box mt={5}>
            <Button w="100%" colorScheme="green" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
