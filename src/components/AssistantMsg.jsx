import {
  Avatar,
  Box,
  Button,
  HStack,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { CopyIcon, CheckIcon, RepeatIcon } from "@chakra-ui/icons";
import ReactMarkdown from "markdown-to-jsx";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";

import avatarImage from "../assets/assistant.png"; // Update the path to point to your avatar image

export function AssistantMsg({
  msg,
  name,
  convId,
  handleRepeat,
  waitingResponse,
  resTime,
}) {
  // const name = "Assistant";
  const { hasCopied, onCopy } = useClipboard(msg);

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
        <Box w={"100%"} align={"start"}>
          <Text
            fontWeight={"bold"}
            mb={1}
            fontSize={"xs"}
            color={"gray.600"}
            align={"start"}
          >
            {name}
          </Text>
          <ReactMarkdown
            components={ChakraUIRenderer()}
            children={msg}
            skipHtml
            align="left"
          />
        </Box>
      </HStack>
      {!waitingResponse ? (
        <HStack spacing={1} justifyContent={"flex-end"}>
          {resTime ? (
            <Text fontSize="sm" fontWeight="bold" color="blue">
              {resTime}
            </Text>
          ) : null}
          <Button
            size="xs"
            colorScheme="blue"
            onClick={() => handleRepeat(convId)}
            ml={2}
            disabled={!hasCopied}
            // align={"end"}
            leftIcon={<RepeatIcon />}
            variant="ghost"
          />
          <Button
            size="xs"
            colorScheme="blue"
            onClick={onCopy}
            ml={2}
            disabled={hasCopied}
            // align={"end"}
            leftIcon={hasCopied ? <CheckIcon /> : <CopyIcon />}
            variant="ghost"
          />
        </HStack>
      ) : null}
    </Box>
  );
}

export default AssistantMsg;
