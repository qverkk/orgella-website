import { Box } from "@chakra-ui/react";
import useSWR from "swr";
import { getOrdersForUser } from "../../apis/services/ordersServiceWorker";
import { fetchUser } from "../../apis/services/userServiceWorker";
import Navbar from "../../components/navbar/navbar";
import { authStore } from "../../store/zustand";

export default function Orders() {
  const stateLogout = authStore((state) => state.logout);
  const authenticate = authStore((store) => store.authenticate);
  const userDetails = authStore((store) => store.userDetails);
  const setUserDetails = authStore((store) => store.setUserDetails);

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

  const orders = useSWR(
    userDetails ? "/api/orders-ws/orders/" + userDetails.userId : null,
    getOrdersForUser(userDetails ? userDetails.userId : null)
  );

  return (
    <>
      <Navbar />
      <Box maxW="1600px" mx="auto" mt={5}>
        Orders
      </Box>
    </>
  );
}
