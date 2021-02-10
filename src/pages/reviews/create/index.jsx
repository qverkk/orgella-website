import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table,
  Tbody,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import {
  getNonReviewedUserOrders,
  postReview,
} from "../../../apis/services/ordersServiceWorker";
import { fetchUser } from "../../../apis/services/userServiceWorker";
import Navbar from "../../../components/navbar/navbar";
import PageNavigation from "../../../components/navigation/pagenavigation";
import { authStore } from "../../../store/zustand";

function useNonReviewedOrders(userDetails, page) {
  const { data, error, mutate } = useSWR(
    userDetails
      ? `/api/orders-ws/orders/${userDetails.userId}/nonReviewed?page=${page}`
      : null,
    getNonReviewedUserOrders(userDetails ? userDetails.userId : null, page)
  );

  if (!data) {
    return {
      maxOrderPages: 1,
      orders: [],
    };
  }

  return {
    orders: data.orders,
    maxOrderPages: data.totalPages,
    ordersMutate: mutate,
  };
}

export default function CreateReview() {
  const router = useRouter();
  const toast = useToast();
  const stateLogout = authStore((state) => state.logout);
  const authenticate = authStore((store) => store.authenticate);
  const userDetails = authStore((store) => store.userDetails);
  const setUserDetails = authStore((store) => store.setUserDetails);
  const [redirect, setRedirect] = useState(false);
  const { page } = router.query;
  const { orders, maxOrderPages, ordersMutate } = useNonReviewedOrders(
    userDetails,
    page || 0
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentReviewOrder, setCurrentReviewOrder] = useState();

  const initialRef = useRef();
  const finalRef = useRef();

  const onPageChange = (number) => {
    router.push({
      pathname: "/reviews/create",
      query: {
        page: number,
      },
    });
  };

  const validate = (values) => {
    const errors = {};
    if (!values.description) {
      errors.description = "Wymagane";
    } else if (values.description.length < 3) {
      errors.description = "Tytuł musi zawierać co najmniej 3 znaki";
    }

    if (values.rating < 1 || values.rating > 5) {
      errors.rating = "Ocena musi być z przedziału 1 - 5";
    }

    return errors;
  };

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
    if (redirect) {
      toast({
        title: "Uwaga!",
        description: "Ten panel jest tylko dla zalogowanych użytkowników",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      router.push("/");
    }
  }, [redirect, userDetails]);

  return (
    <Box>
      <Navbar />
      <Box maxW="1600px" mx="auto" mt={5}>
        {userDetails && (
          <Box>
            <Heading>Opublikuj opinię</Heading>
            <Table size="lg">
              <Thead>
                <Tr>
                  <Th>Przedmiot</Th>
                  <Th>Ilość</Th>
                  <Th>Cena</Th>
                  <Th>Data</Th>
                  <Th>Akcje</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders &&
                  orders.map((order) => {
                    return (
                      <Tr key={order.id}>
                        <Th>{order.productPath}</Th>
                        <Th>{order.quantity}</Th>
                        <Th>{order.price}</Th>
                        <Th>{order.date}</Th>
                        <Th>
                          <Button
                            onClick={() => {
                              onOpen();
                              setCurrentReviewOrder(order);
                            }}
                          >
                            Wystaw ocenę
                          </Button>
                        </Th>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
            {orders && orders.length > 0 && (
              <PageNavigation
                currentPage={page || 0}
                maxPages={maxOrderPages}
                onPageChange={(number) => {
                  onPageChange(number);
                }}
              />
            )}
            {currentReviewOrder && (
              <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>
                    Wystaw ocenę dla {currentReviewOrder.productPath}
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                    <Formik
                      initialValues={{
                        description: "",
                        rating: 1,
                      }}
                      validate={validate}
                      onSubmit={(values, actions) => {
                        postReview({
                          orderId: currentReviewOrder.id,
                          rating: values.rating,
                          description: values.description,
                        });

                        ordersMutate(
                          `/api/orders-ws/orders/${userDetails.userId}/nonReviewed`
                        );
                        onClose();
                      }}
                    >
                      {(props) => {
                        return (
                          <Form>
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
                                    Opinia
                                  </FormLabel>
                                  <Textarea
                                    {...field}
                                    id="description"
                                    placeholder="Opinia"
                                  />
                                  <FormErrorMessage>
                                    {form.errors.description}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                            <Field name="rating">
                              {({ field, form }) => (
                                <FormControl
                                  isInvalid={
                                    form.errors.rating && form.touched.rating
                                  }
                                  mt={5}
                                >
                                  <FormLabel htmlFor="rating">Ocena</FormLabel>
                                  <NumberInput
                                    {...field}
                                    onChange={(value) =>
                                      props.setFieldValue("rating", value)
                                    }
                                    max={5}
                                    min={1}
                                  >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                      <NumberIncrementStepper />
                                      <NumberDecrementStepper />
                                    </NumberInputStepper>
                                  </NumberInput>
                                  <FormErrorMessage>
                                    {form.errors.rating}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                            <ModalFooter>
                              <Button colorScheme="blue" mr={3} type="submit">
                                Wystaw ocenę
                              </Button>
                              <Button onClick={onClose}>Anuluj</Button>
                            </ModalFooter>
                          </Form>
                        );
                      }}
                    </Formik>
                  </ModalBody>
                </ModalContent>
              </Modal>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
