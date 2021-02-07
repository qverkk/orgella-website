import {
  Box,
  Heading,
  Link,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getOrdersForUser } from "../../apis/services/ordersServiceWorker";
import { fetchUser } from "../../apis/services/userServiceWorker";
import Navbar from "../../components/navbar/navbar";
import PageNavigation from "../../components/navigation/pagenavigation";
import { authStore } from "../../store/zustand";

export default function Orders() {
  const router = useRouter();
  const stateLogout = authStore((state) => state.logout);
  const authenticate = authStore((store) => store.authenticate);
  const userDetails = authStore((store) => store.userDetails);
  const setUserDetails = authStore((store) => store.setUserDetails);

  const { data, error, mutate } = useSWR(
    userDetails ? "/api/orders-ws/orders/" + userDetails.userId : null,
    getOrdersForUser(userDetails ? userDetails.userId : null)
  );

  const { page } = router.query;

  const onPageChange = (number) => {
    router.push({
      pathname: "/orders",
      query: {
        page: number,
      },
    });
  };

  if (!userDetails) {
    fetchUser().then((result) => {
      if (result.error) {
        stateLogout();
      } else {
        setUserDetails(result.userDetails);
        authenticate();
      }
    });
  }

  return (
    <>
      <Navbar />
      <Box maxW="1600px" mx="auto" mt={5}>
        <Heading>Zamówienia</Heading>

        {data && data.orders && data.orders.length > 0 && (
          <Box>
            <Box>
              <Table size="lg">
                <Thead>
                  <Tr>
                    <Th>Przedmiot</Th>
                    <Th>Ilość</Th>
                    <Th>Cena</Th>
                    <Th>Sprzedawca</Th>
                    <Th>Status</Th>
                    <Th>Data</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.orders.map((item) => {
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
                        <Th>{item.sellerUsername}</Th>
                        <Th>{item.status}</Th>
                        <Th>{item.date}</Th>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
            <PageNavigation
              currentPage={page || 0}
              maxPages={data.maxPage}
              onPageChange={(number) => {
                onPageChange(number);
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
}
