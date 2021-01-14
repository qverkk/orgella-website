import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { loginUser } from "../../apis/services/userServiceWorker";
import Navbar from "../../components/navbar/navbar";

export default function Login() {
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const clickTest = async () => {
    const response = loginUser(username, password, (result) => {
      const { status, data } = result;
      if (status == 200) {
        console.log(data);
        toast({
          position: "bottom-left",
          title: "Welcome back!.",
          description: "You've logged in successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else if (status == 403) {
        toast({
          title: "An error occurred.",
          description: "Invalid username or password.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Something just fucked up.",
          description: "Please hold on while we fix the fucking.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    });
    console.log(response);
  };

  return (
    <>
      <Navbar loginOrRegister />
      <Box borderWidth="1px" borderRadius="1g" overflow="hidden" p="6" m="5">
        <Heading size="xl">
          <Text>Zaloguj się</Text>
        </Heading>
        <Box mt="4">
          <form>
            <FormControl id="username">
              <FormLabel>Nazwa użytkownika</FormLabel>
              <Input
                type="text"
                placeholder="Nazwa użytkownika"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Hasło</FormLabel>
              <Input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Box mt="5">
              <Link color="teal.500">Nie pamiętasz hasła?</Link>
              <Button
                size="md"
                width="200px"
                backgroundColor="green.500"
                ml="5"
                onClick={clickTest}
              >
                Zaloguj się
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
      <Box borderWidth="1px" borderRadius="1g" overflow="hidden" p="6" m="5">
        <Box>
          <Heading size="l">
            Nie masz konta? <Link color="teal.500">Zarejestruj się</Link>
          </Heading>
        </Box>
      </Box>
    </>
  );
}
