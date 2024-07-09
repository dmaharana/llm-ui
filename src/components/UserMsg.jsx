import { Avatar, Box, HStack, Text } from "@chakra-ui/react";

export function UserMsg({ msg }) {
  return (
    <Box bg={"green.50"} p={2} borderRadius={"md"} mb={2} w={"100%"}>
      <HStack>
        <Avatar size={"sm"} name="User" mb={2} mr={3} />
        <Text>{msg}</Text>
      </HStack>
    </Box>
  );
}

export default UserMsg;
