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
import Basket from "../basket/basket";
import ProfileMenu from "./profile/profilemenu";

const preventDefault = (f) => (e) => {
  if (e != undefined) {
    e.preventDefault();
  }
  f(e);
};

export default function Navbar(props) {
  const router = useRouter();

  const loginOrRegister = props.loginOrRegister;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("wszystko");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [displayProfile, setDisplayProfile] = useState(true);
  const [placement, setPlacement] = useState("right");

  const performSearch = preventDefault(() => {
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
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      performSearch();
                    }
                  }}
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
                <option value="Wszystko">Wszystkie kategorie</option>
                <optgroup label="Kategorie">
                  <option value="Dom-i-ogrod">Dom i ogród</option>
                  <option value="Dziecko">Dziecko</option>
                  <option value="Elektronika">Elektronika</option>
                  <option value="Firma">Firma i usługi</option>
                  <option value="Kolekcje-i-sztuka">Kolekcje i sztuka</option>
                  <option value="Kultura-i-rozrywka">Kultura i rozrywka</option>
                  <option value="Moda">Moda</option>
                  <option value="Motoryzacja">Motoryzacja</option>
                  <option value="Nieruchomosci">Nieruchomości</option>
                  <option value="Sport-i-turystyka">Sport i turystyka</option>
                  <option value="Supermarket">Supermarket</option>
                  <option value="Uroda">Uroda</option>
                  <option value="Zdrowie">Zdrowie</option>
                </optgroup>
              </Select>
              <Button
                type="submit"
                colorScheme="green"
                onClick={performSearch}
                width={{ base: "50%", md: "100px", lg: "100px" }}
              >
                SZUKAJ
              </Button>
            </Flex>
          )}
          <Spacer />
          <Box>
            <Box w="150px">
              <Button
                onClick={() => {
                  setDisplayProfile(false);
                  onOpen();
                }}
                w="100%"
              >
                Koszyk
              </Button>
            </Box>
            <Box w="150px">
              <Button
                onClick={() => {
                  setDisplayProfile(true);
                  onOpen();
                }}
                w="100%"
              >
                Profil
              </Button>
            </Box>
            <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
              <DrawerOverlay>
                <DrawerContent>
                  <DrawerHeader borderBottomWidth={1}>
                    {displayProfile ? "Menu profilu" : "Koszyk"}
                  </DrawerHeader>
                  <DrawerBody>
                    {displayProfile ? <ProfileMenu /> : <Basket />}
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
