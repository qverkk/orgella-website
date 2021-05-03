import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createAuction } from "../../../apis/services/auctionServiceWorker";
import { fetchUser } from "../../../apis/services/userServiceWorker";
import Navbar from "../../../components/navbar/navbar";
import { authStore } from "../../../store/zustand";

export default function CreateOrder() {
  const router = useRouter();
  const toast = useToast();
  const stateLogout = authStore((state) => state.logout);
  const authenticate = authStore((store) => store.authenticate);
  const userDetails = authStore((store) => store.userDetails);
  const setUserDetails = authStore((store) => store.setUserDetails);
  const [redirect, setRedirect] = useState(false);

  if (!userDetails) {
    fetchUser().then((result) => {
      if (result.error) {
        stateLogout();
        setRedirect(true);
      } else {
        setUserDetails(result.userDetails);
        authenticate();
      }
    });
  }

  useEffect(() => {
    if (
      redirect ||
      (userDetails && !userDetails.roles.includes("ROLE_SELLER"))
    ) {
      toast({
        title: "Uwaga!",
        description: "Ten panel jest tylko dla sprzedawców",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      router.push("/");
    }
  }, [redirect, userDetails]);

  const validate = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = "Wymagane";
    } else if (values.title.length < 3) {
      errors.title = "Tytuł musi zawierać co najmniej 3 znaki";
    }

    if (!values.quantity) {
      errors.quantity = "Wymagane";
    } else if (values.quantity < 0) {
      errors.quantity = "Ilość sztuk musi być większa niż 0";
    }

    if (!values.price) {
      errors.price = "Wymagane";
    } else if (!/^(0|[1-9]\d+)\.(\d){2}$/i.test(values.price)) {
      errors.price = "Cena musi mieć format: 11.10 lub 0.10";
    }

    if (!values.category) {
      errors.category = "Wymagane";
    }

    if (!values.description) {
      errors.description = "Wymagane";
    } else if (values.description.length < 30) {
      errors.description = "Opis musi mieć więcej niż 30 znaków";
    }

    return errors;
  };

  return (
    <Box>
      <Navbar />
      <Box maxW="1600px" mx="auto" mt={5}>
        {userDetails && userDetails.roles.includes("ROLE_SELLER") && (
          <Box>
            <Heading>Stwórz ofertę</Heading>
            <Formik
              initialValues={{
                file: undefined,
                title: "",
                quantity: 0,
                price: 0.0,
                description: "",
                category: "Dom-i-ogrod",
              }}
              validate={validate}
              onSubmit={(values, actions) => {
                setTimeout(() => {
                  const {
                    file,
                    title,
                    quantity,
                    price,
                    description,
                    category,
                  } = values;

                  let data = new FormData();
                  data.append("file", file);
                  data.append("title", title);
                  data.append("quantity", quantity);
                  data.append("price", price);
                  data.append("description", description);
                  data.append("category", category);

                  createAuction(data, (result) => {
                    const { data, status } = result;
                    if (status == 200) {
                      toast({
                        position: "bottom-left",
                        title: "Gratulacje!.",
                        description: "Udało się dodać Twoją ofertę",
                        status: "success",
                        duration: 4000,
                        isClosable: true,
                      });
                    } else if (status == 422) {
                      toast({
                        title: data.message,
                        description: data.violations
                          .map(function (element) {
                            return element.cause;
                          })
                          .join(" and "),
                        status: "error",
                        duration: 4000,
                        isClosable: true,
                      });
                    } else {
                      toast({
                        title: "Something just broke.",
                        description: "Please hold on while we fix the bug.",
                        status: "error",
                        duration: 4000,
                        isClosable: true,
                      });
                    }
                  });
                }, 500);
              }}
            >
              {(props) => {
                return (
                  <Form>
                    <Box borderWidth="1px" borderRadius="1g" overflow="hidden">
                      <Box m={5}>
                        <Box>
                          <Field name="title">
                            {({ field, form }) => (
                              <FormControl
                                isInvalid={
                                  form.errors.title && form.touched.title
                                }
                                mt={5}
                              >
                                <FormLabel htmlFor="title">Tytuł</FormLabel>
                                <Input
                                  {...field}
                                  id="title"
                                  placeholder="Tytuł"
                                />
                                <FormErrorMessage>
                                  {form.errors.title}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="quantity">
                            {({ field, form }) => (
                              <FormControl
                                isInvalid={
                                  form.errors.quantity && form.touched.quantity
                                }
                                mt={5}
                              >
                                <FormLabel htmlFor="quantity">Ilość</FormLabel>
                                <InputGroup>
                                  <Input
                                    {...field}
                                    id="quantity"
                                    placeholder="Ilość"
                                    type="number"
                                  />
                                  <InputRightAddon children="sztuk" />
                                </InputGroup>
                                <FormErrorMessage>
                                  {form.errors.quantity}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="price">
                            {({ field, form }) => (
                              <FormControl
                                isInvalid={
                                  form.errors.price && form.touched.price
                                }
                                mt={5}
                              >
                                <FormLabel htmlFor="price">Cena</FormLabel>
                                <InputGroup>
                                  <Input
                                    {...field}
                                    id="price"
                                    placeholder="Cena"
                                    step="0.01"
                                  />
                                  <InputRightAddon children="zł" />
                                </InputGroup>
                                <FormErrorMessage>
                                  {form.errors.price}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="category">
                            {({ field, form }) => (
                              <FormControl
                                isInvalid={
                                  form.errors.category && form.touched.category
                                }
                                mt={5}
                              >
                                <FormLabel htmlFor="category">
                                  Kategoria
                                </FormLabel>
                                <Select {...field} id="category">
                                  <option value="Dom-i-ogrod">
                                    Dom i ogród
                                  </option>
                                  <option value="Dziecko">Dziecko</option>
                                  <option value="Elektronika">
                                    Elektronika
                                  </option>
                                  <option value="Firma">Firma i usługi</option>
                                  <option value="Kolekcje-i-sztuka">
                                    Kolekcje i sztuka
                                  </option>
                                  <option value="Kultura-i-rozrywka">
                                    Kultura i rozrywka
                                  </option>
                                  <option value="Moda">Moda</option>
                                  <option value="Motoryzacja">
                                    Motoryzacja
                                  </option>
                                  <option value="Nieruchomosci">
                                    Nieruchomości
                                  </option>
                                  <option value="Sport-i-turystyka">
                                    Sport i turystyka
                                  </option>
                                  <option value="Supermarket">
                                    Supermarket
                                  </option>
                                  <option value="Uroda">Uroda</option>
                                  <option value="Zdrowie">Zdrowie</option>
                                </Select>
                                <FormErrorMessage>
                                  {form.errors.category}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="file">
                            {({ field, form }) => (
                              <FormControl mt={5}>
                                <FormLabel htmlFor="file">
                                  Miniaturka ogłoszenia
                                </FormLabel>
                                <Input
                                  id="file"
                                  placeholder="Miniaturka ogłoszenia"
                                  type="file"
                                  accept="image/png, image/jpeg"
                                  multiple={false}
                                  onChange={(event) => {
                                    props.setFieldValue(
                                      "file",
                                      event.target.files[0]
                                    );
                                  }}
                                />
                              </FormControl>
                            )}
                          </Field>

                          <Field name="description">
                            {({ field, form }) => (
                              <FormControl
                                isInvalid={
                                  form.errors.description &&
                                  form.touched.description
                                }
                                mt={5}
                              >
                                <FormLabel htmlFor="description">
                                  Opis produktu
                                </FormLabel>
                                <Textarea
                                  {...field}
                                  id="description"
                                  placeholder="Opis produktu"
                                />
                                <FormErrorMessage>
                                  {form.errors.description}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </Box>
                        <Box mt={5}>
                          <Button w="100%" colorScheme="green" type="submit">
                            Utwórz ofertę
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        )}
      </Box>
    </Box>
  );
}
