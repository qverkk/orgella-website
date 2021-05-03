import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik, useFormik } from "formik";
import { useState } from "react";
import { registerUser } from "../../apis/services/userServiceWorker";
import Navbar from "../../components/navbar/navbar";

export default function Registration() {
  const toast = useToast();
  const [showPassword, setshowPassword] = useState(false);

  const togglePassword = () => {
    setshowPassword(!showPassword);
  };

  const validate = (values) => {
    const errors = {};
    if (!values.firstname) {
      errors.firstname = "Wymagane";
    } else if (values.firstname.length < 2) {
      errors.firstname = "Nie poprawne imię";
    }

    if (!values.lastname) {
      errors.lastname = "Wymagane";
    } else if (values.lastname.length < 2) {
      errors.lastname = "Nie poprawne nazwisko";
    }

    if (!values.email) {
      errors.email = "Wymagane";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Niepoprawny adres email";
    }

    if (!values.username) {
      errors.username = "Wymagane";
    } else if (values.username.length < 3) {
      errors.username = "Nazwa użytkownika musi mieć więcej niż 3 znaki";
    }

    if (!values.password) {
      errors.password = "Wymagane";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(
        values.password
      )
    ) {
      errors.password =
        "Hasło musi zawierać minimum 8 znaków, 1 liczbę, 1 znak specjalny, 1 wielką literę, 1 małą literę";
    }

    if (!values.birthdate) {
      errors.birthdate = "Wymagane";
    }

    if (!values.allTerms) {
      errors.allTerms = "Wymagane";
    }

    return errors;
  };

  return (
    <>
      <Navbar loginOrRegister />
      <Box p={6} m={5}>
        <Heading>Utwórz konto</Heading>
        <Formik
          initialValues={{
            firstname: "",
            lastname: "",
            username: "",
            password: "",
            email: "",
            birthdate: "",
            allTerms: false,
            tracking: false,
            spam: false,
            telemetrics: false,
          }}
          validate={validate}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              const {
                firstname,
                lastname,
                username,
                password,
                email,
                birthdate,
              } = values;
              registerUser(
                firstname,
                lastname,
                birthdate,
                username,
                email,
                password,
                (result) => {
                  const { status, data } = result;
                  if (status == 201) {
                    toast({
                      position: "bottom-left",
                      title: "YAAAAAY!.",
                      description: "You've registered!!",
                      status: "success",
                      duration: 9000,
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
                      duration: 9000,
                      isClosable: true,
                    });
                  } else {
                    toast({
                      title: "Something just broke.",
                      description: "Please hold on while we fix the bug.",
                      status: "error",
                      duration: 9000,
                      isClosable: true,
                    });
                  }
                }
              );
            }, 500);
          }}
        >
          {(props) => {
            return (
              <Form>
                <Box borderWidth="1px" borderRadius="1g" overflow="hidden">
                  <Box m={5}>
                    <Box>
                      <Heading size="l">1. Dane do rejestracji</Heading>
                      <Field name="firstname">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.firstname && form.touched.firstname
                            }
                            mt={5}
                          >
                            <FormLabel htmlFor="firstname">Imię</FormLabel>
                            <Input
                              {...field}
                              id="firstname"
                              placeholder="Imię"
                            />
                            <FormErrorMessage>
                              {form.errors.firstname}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="lastname">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.lastname && form.touched.lastname
                            }
                            mt={5}
                          >
                            <FormLabel htmlFor="lastname">Nazwisko</FormLabel>
                            <Input
                              {...field}
                              id="lastname"
                              placeholder="Nazwisko"
                            />
                            <FormErrorMessage>
                              {form.errors.lastname}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="email">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.email && form.touched.email}
                            mt={5}
                          >
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input {...field} id="email" placeholder="Email" />
                            <FormErrorMessage>
                              {form.errors.email}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="username">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.username && form.touched.username
                            }
                            mt={5}
                          >
                            <FormLabel htmlFor="username">
                              Nazwa użytkownika
                            </FormLabel>
                            <Input
                              {...field}
                              id="username"
                              placeholder="Nazwa użytkownika"
                            />
                            <FormErrorMessage>
                              {form.errors.username}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="password">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.password && form.touched.password
                            }
                            mt={5}
                          >
                            <FormLabel htmlFor="password">Hasło</FormLabel>
                            <InputGroup>
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Hasło"
                              />
                              <InputRightElement width="4.5rem">
                                <Button
                                  h="1.75rem"
                                  size="sm"
                                  onClick={togglePassword}
                                >
                                  {showPassword ? "Ukryj" : "Pokaż"}
                                </Button>
                              </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>
                              {form.errors.password}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <Box mt={5}>
                      <Heading size="l">2. Twój wiek</Heading>
                      <Text mt={2}>
                        Dzięki tej informacji możemy pokazać oferty odpowiednie
                        dla Ciebie
                      </Text>
                      <Field name="birthdate">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.birthdate && form.touched.birthdate
                            }
                            mt={5}
                          >
                            <Input {...field} type="date" id="birthdate" />
                            <FormErrorMessage>
                              {form.errors.birthdate}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <Box mt={5}>
                      <Heading size="l">3. Oświadczenia i zgody</Heading>
                      <Stack mt={3}>
                        <Field name="allTerms">
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.allTerms}>
                              <Checkbox
                                {...field}
                                id="allTerms"
                                required={true}
                              >
                                Biorę wszystko
                              </Checkbox>
                              <FormErrorMessage>
                                {form.errors.allTerms}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="tracking">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox {...field} id="tracking">
                                Śledzenie
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="spam">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox {...field} id="spam">
                                Spam
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="telemetrics">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox {...field} id="telemetrics">
                                Sprzedawanie telemetryki
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                      </Stack>
                    </Box>
                    <Box mt={5}>
                      <Button w="100%" colorScheme="green" type="submit">
                        Utwórz konto
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
}
