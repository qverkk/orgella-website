import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  Input,
  Select,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { React, useState } from "react";
import ProfileMenu from "./profile/profilemenu";

const preventDefault = (f) => (e) => {
  e.preventDefault();
  f(e);
};

export default function Navbar(props, { searchQuery }) {
  const router = useRouter();

  const loginOrRegister = props.loginOrRegister;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("wszystko");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = useState("right");

  const test = preventDefault(() => {
    router.push({
      pathname: "/search/listings",
      query: {
        query: query,
        category: category,
      },
    });
  });

  const loadMainPage = () => {
    router.push("/");
  };

  return (
    <header>
      <Box borderBottom="2px" borderColor="teal.500" w="100%">
        <Flex
          align="center"
          justify="center"
          maxW="1600px"
          flexWrap="wrap"
          mx="auto"
          p={3}
        >
          <Box onClick={loadMainPage}>
            <Text fontSize={{ base: "60px", md: "50px", lg: "40px" }}>
              Orgella
            </Text>
          </Box>
          <Spacer />
          {loginOrRegister == true ? (
            <></>
          ) : (
            <Flex flexWrap="wrap">
              <FormControl
                id="query"
                width={{ base: "400px", md: "400px", lg: "800px" }}
              >
                <Input
                  type="search"
                  placeholder="Czego szukasz?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                />
              </FormControl>
              <Select
                name="category"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                width={{ base: "50%", md: "230px", lg: "230px" }}
              >
                <option value="wszystko">Wszystkie kategorie</option>
                <optgroup label="Kategorie">
                  <option value="dom-i-ogrod">Dom i ogród</option>
                  <option value="dziecko">Dziecko</option>
                  <option value="elektronika">Elektronika</option>
                  <option value="firma">Firma i usługi</option>
                  <option value="kolekcje-i-sztuka">Kolekcje i sztuka</option>
                  <option value="kultura-i-rozrywka">Kultura i rozrywka</option>
                  <option value="moda">Moda</option>
                  <option value="motoryzacja">Motoryzacja</option>
                  <option value="nieruchomosci">Nieruchomości</option>
                  <option value="sport-i-turystyka">Sport i turystyka</option>
                  <option value="supermarket">Supermarket</option>
                  <option value="uroda">Uroda</option>
                  <option value="zdrowie">Zdrowie</option>
                </optgroup>
              </Select>
              <Button
                type="submit"
                colorScheme="green"
                onClick={test}
                width={{ base: "50%", md: "100px", lg: "100px" }}
              >
                SZUKAJ
              </Button>
            </Flex>
          )}
          <Spacer />
          <Box>
            <Box w="150px">
              <Button onClick={onOpen} w="100%">
                Profile
              </Button>
            </Box>
            <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
              <DrawerOverlay>
                <DrawerContent>
                  <DrawerHeader borderBottomWidth={1}>
                    Menu profilu
                  </DrawerHeader>
                  <DrawerBody>
                    <ProfileMenu />
                  </DrawerBody>
                </DrawerContent>
              </DrawerOverlay>
            </Drawer>
          </Box>
        </Flex>
      </Box>
    </header>
  );
}
