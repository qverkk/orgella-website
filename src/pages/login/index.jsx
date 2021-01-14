import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";
import { axios } from "../../apis/calls";
import Navbar from "../../components/navbar/navbar";

export default function Login() {
  const clickTest = async () => {
    const response = await axios({
      method: "GET",
      url: "",
      headers: {
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log(response.data);
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
              <Input type="text" placeholder="Nazwa użytkownika" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Hasło</FormLabel>
              <Input type="password" placeholder="Hasło" />
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
