import {
  Box,
  Button,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  getOrdersMadeBySeller,
  getAvailableShippingStatuses,
  updateOrderStatusForId,
} from "../../../apis/services/ordersServiceWorker";
import { fetchUser } from "../../../apis/services/userServiceWorker";
import Navbar from "../../../components/navbar/navbar";
import PageNavigation from "../../../components/navigation/pagenavigation";
import { authStore } from "../../../store/zustand";

function useSellerOrders(userDetails, page) {
  const { data, error, mutate } = useSWR(
    userDetails && userDetails.roles.includes("ROLE_SELLER")
      ? `/api/orders-ws/orders/${userDetails.username}/all?page=${page}`
      : null,
    getOrdersMadeBySeller(userDetails ? userDetails.username : null, page)
  );

  if (!data) {
    return {
      maxPages: 1,
      orders: [],
    };
  }

  return {
    maxPages: data.maxPages,
    orders: data.orders,
    ordersMutate: mutate,
  };
}

function useAvailableShippingStatuses() {
  const { data, error, mutate } = useSWR(
    `/api/orders-ws/orders/orderStatus/all`,
    getAvailableShippingStatuses()
  );

  if (!data) {
    return {
      statuses: [],
    };
  }

  return {
    statuses: data.statuses,
    statusesMutate: mutate,
  };
}

export default function SellerOrders() {
  const router = useRouter();
  const toast = useToast();
  const stateLogout = authStore((state) => state.logout);
  const authenticate = authStore((store) => store.authenticate);
  const userDetails = authStore((store) => store.userDetails);
  const setUserDetails = authStore((store) => store.setUserDetails);
  const [redirect, setRedirect] = useState(false);
  const { page } = router.query;
  const { orders, ordersMutate, maxPages } = useSellerOrders(
    userDetails,
    page || 0
  );
  const { statuses, statusesMutate } = useAvailableShippingStatuses();

  const onPageChange = (number) => {
    router.push({
      pathname: "/orders/seller",
      query: {
        page: number,
      },
    });
  };

  const performUpdateOfStatus = (id, status) => {
    updateOrderStatusForId({
      orderId: id,
      sellerUsername: userDetails.username,
      orderStatus: status,
    });
    ordersMutate(
      `/api/orders-ws/orders/${userDetails.username}/all?page=${page || 0}`
    );
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

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  }

  return (
    <Box>
      <Navbar />
      <Box maxW="1600px" mx="auto" mt={5}>
        {userDetails && userDetails.roles.includes("ROLE_SELLER") && (
          <Box>
            <Heading>Twoje oferty: </Heading>
            {orders && orders.length > 0 && (
              <Box>
                <Box>
                  <Table size="lg">
                    <Thead>
                      <Tr>
                        <Th>Przedmiot</Th>
                        <Th>Ilość</Th>
                        <Th>Cena</Th>
                        <Th>Id kupcy</Th>
                        <Th>Status</Th>
                        <Th>Data</Th>
                        <Th>Akcje</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {orders.map((item) => {
                        return (
                          <Tr
                            key={
                              item.productPath +
                              item.quantity +
                              item.sellerUsername +
                              item.price
                            }
                          >
                            <Th>
                              <Link
                                color="blue.200"
                                onClick={() => {
                                  router.push(`/auction/${item.productPath}`);
                                }}
                              >
                                {item.productPath}
                              </Link>
                            </Th>
                            <Th>{item.quantity}</Th>
                            <Th>{item.price} zł</Th>
                            <Th>{item.buyerId}</Th>
                            <Th>{item.status}</Th>
                            <Th>{formatDate(item.date)}</Th>
                            <Th>
                              {statuses.length > 0 ? (
                                <Menu closeOnSelect={true}>
                                  <MenuButton as={Button}>
                                    Zmień status zamówienia
                                  </MenuButton>
                                  <MenuList minWidth="240px">
                                    <MenuOptionGroup title="Status">
                                      {statuses.map((status) => (
                                        <MenuItemOption
                                          value={status}
                                          key={status}
                                          onClick={() => {
                                            performUpdateOfStatus(
                                              item.id,
                                              status
                                            );
                                          }}
                                        >
                                          {status}
                                        </MenuItemOption>
                                      ))}
                                    </MenuOptionGroup>
                                  </MenuList>
                                </Menu>
                              ) : (
                                "Brak statusów"
                              )}
                            </Th>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </Box>
                <PageNavigation
                  currentPage={page || 0}
                  maxPages={maxPages}
                  onPageChange={(number) => {
                    onPageChange(number);
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
