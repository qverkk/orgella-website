import { Box, Heading, Table, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import Navbar from "../../../components/navbar/navbar";
import { ordersStore } from "../../../store/zustand";

export default function OrderSummary() {
  const orders = ordersStore((state) => state.orders);

  const summary = orders && (
    <Box>
      {orders.createdItems.length > 0 && (
        <Box>
          <Heading mt={5} size="lg">
            Kupione produkty
          </Heading>
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
              {orders.createdItems.map((item) => {
                return (
                  <Tr
                    key={
                      item.product.productPath +
                      item.product.quantity +
                      item.sellerUsername +
                      item.product.price
                    }
                  >
                    <Th>{item.product.productPath}</Th>
                    <Th>{item.product.quantity}</Th>
                    <Th>{item.product.price} zł</Th>
                    <Th>{item.sellerUsername}</Th>
                    <Th>{item.orderStatus}</Th>
                    <Th>{item.date}</Th>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      )}
      {orders.failedOrders.length > 0 && (
        <Box>
          <Heading mt={5} size="lg">
            Niepowodzenie kupna
          </Heading>
          <Table size="lg">
            <Thead>
              <Tr>
                <Th>Przedmiot</Th>
                <Th>Opis błędu</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.failedOrders.map((item) => {
                return (
                  <Tr key={item.reason}>
                    <Th>{item.auctionPath}</Th>
                    <Th>{item.reason}</Th>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <Navbar />
      <Box maxW="1600px" mx="auto" mt={5}>
        <Heading>Podsumowanie ostatniego zamówienia:</Heading>
        <Box>{!orders ? "Brak informacji o ostatnim zamówieniu" : summary}</Box>
      </Box>
    </>
  );
}
