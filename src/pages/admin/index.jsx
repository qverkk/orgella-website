import {
  Box,
  Button,
  Heading,
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
  addRoleForUsername,
  getAvailableRoles,
  getAvailableUsers,
  removeRoleForUsername,
} from "../../apis/services/adminServiceWorker";
import { fetchUser } from "../../apis/services/userServiceWorker";
import Navbar from "../../components/navbar/navbar";
import { authStore } from "../../store/zustand";

function useRoles(userDetails) {
  const { data, error, mutate } = useSWR(
    userDetails && userDetails.roles.includes("ROLE_ADMIN")
      ? "/api/users-ws/users/roles/all"
      : null,
    getAvailableRoles(userDetails && userDetails.roles.includes("ROLE_ADMIN"))
  );

  if (!data) {
    return {
      roles: [],
    };
  }

  return {
    roles: data.roles,
    rolesMutate: mutate,
  };
}

function useUsers(userDetails) {
  const { data, error, mutate } = useSWR(
    userDetails && userDetails.roles.includes("ROLE_ADMIN")
      ? "/api/users-ws/users/users/all"
      : null,
    getAvailableUsers(userDetails && userDetails.roles.includes("ROLE_ADMIN"))
  );

  if (!data) {
    return {
      users: [],
    };
  }

  return {
    users: data.users,
    usersMutate: mutate,
  };
}

export default function Admin() {
  const router = useRouter();
  const toast = useToast();
  const stateLogout = authStore((state) => state.logout);
  const authenticate = authStore((store) => store.authenticate);
  const userDetails = authStore((store) => store.userDetails);
  const setUserDetails = authStore((store) => store.setUserDetails);
  const [redirect, setRedirect] = useState(false);
  const { roles, rolesMutate } = useRoles(userDetails);
  const { users, usersMutate } = useUsers(userDetails);

  const removeRoleForUser = (role, username) => {
    removeRoleForUsername({
      username: username,
      roleName: role,
    });
    usersMutate("/api/users-ws/users/users/all");
  };

  const addRoleForUser = (role, username) => {
    addRoleForUsername({
      username: username,
      roleName: role,
    });
    usersMutate("/api/users-ws/users/users/all");
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
      (userDetails && !userDetails.roles.includes("ROLE_ADMIN"))
    ) {
      toast({
        title: "Uwaga!",
        description: "Ten panel jest tylko dla adminów",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      console.log("Redir");
      router.push("/");
    }
  }, [redirect, userDetails]);

  return (
    <Box>
      <Navbar />
      <Box maxW="1600px" mx="auto" mt={5}>
        {userDetails && userDetails.roles.includes("ROLE_ADMIN") && (
          <Box>
            <Heading>Admin panel</Heading>
            <Table size="lg">
              <Thead>
                <Tr>
                  <Th>Email</Th>
                  <Th>Imię</Th>
                  <Th>Nazwisko</Th>
                  <Th>Role</Th>
                  <Th>Akcje</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users &&
                  users.map((user) => {
                    return (
                      <Tr key={user.userId}>
                        <Th>{user.email}</Th>
                        <Th>{user.firstName}</Th>
                        <Th>{user.lastName}</Th>
                        <Th>{user.roles.map((role) => `${role}, `)}</Th>
                        <Th>
                          {roles.length > 0 ? (
                            <Box>
                              <Menu closeOnSelect={false}>
                                <MenuButton as={Button}>Dodaj role</MenuButton>
                                <MenuList minWidth="240px">
                                  <MenuOptionGroup title="Role">
                                    {roles.map((role) => (
                                      <MenuItemOption
                                        value={role}
                                        key={role}
                                        onClick={() => {
                                          addRoleForUser(role, user.username);
                                        }}
                                      >
                                        {role}
                                      </MenuItemOption>
                                    ))}
                                  </MenuOptionGroup>
                                </MenuList>
                              </Menu>
                              <Menu closeOnSelect={false}>
                                <MenuButton as={Button}>Usuń role</MenuButton>
                                <MenuList minWidth="240px">
                                  <MenuOptionGroup title="Role">
                                    {roles.map((role) => (
                                      <MenuItemOption
                                        value={role}
                                        key={role}
                                        onClick={() => {
                                          removeRoleForUser(
                                            role,
                                            user.username
                                          );
                                        }}
                                      >
                                        {role}
                                      </MenuItemOption>
                                    ))}
                                  </MenuOptionGroup>
                                </MenuList>
                              </Menu>
                            </Box>
                          ) : (
                            "No roles"
                          )}
                        </Th>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
}
