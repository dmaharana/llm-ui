import { Avatar, Box, HStack, Text } from "@chakra-ui/react";
import ReactMarkdown from "markdown-to-jsx";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";

import avatarImage from "../assets/assistant.png"; // Update the path to point to your avatar image

export function AssistantMsg({ msg }) {
  return (
    <Box bg={"gray.50"} p={2} borderRadius={"md"} mb={2} w={"100%"}>
      <HStack>
        <Avatar
          size={"sm"}
          name="Assistant"
          //   src="https://bit.ly/dan-abramov"
          src={avatarImage}
          mb={2}
          mr={3}
          bg={"red"}
        />
        <ReactMarkdown
          components={ChakraUIRenderer()}
          children={msg}
          skipHtml
          align="left"
        />
      </HStack>
    </Box>
  );
}

export default AssistantMsg;
