import { useState } from "react";
import { Textarea } from "@chakra-ui/react";
import {
  Avatar,
  Box,
  HStack,
  Text,
  useClipboard,
  Button,
} from "@chakra-ui/react";
import { CopyIcon, CheckIcon, EditIcon } from "@chakra-ui/icons";

export function UserMsg({ msg, msgId, handleQueryUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const { hasCopied, onCopy } = useClipboard(msg);

  const name = "User";
  return (
    <Box bg={"green.50"} p={2} borderRadius={"md"} mb={2} w={"100%"}>
      <HStack>
        <Avatar size={"sm"} name="User" mb={2} mr={3} />
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
          {isEditing ? (
            <Textarea
              value={msg}
              onChange={(e) => handleQueryUpdate(msgId, e.target.value)}
              onBlur={() => setIsEditing(false)}
            />
          ) : (
            <Text>{msg}</Text>
          )}
        </Box>
      </HStack>
      <HStack spacing={1} justifyContent={"flex-end"}>
        <Button
          size="xs"
          colorScheme="blue"
          onClick={() => setIsEditing(!isEditing)}
          leftIcon={isEditing ? <CheckIcon /> : <EditIcon />}
          variant="ghost"
        />
        <Button
          size="xs"
          colorScheme="blue"
          onClick={onCopy}
          ml={2}
          disabled={hasCopied}
          leftIcon={hasCopied ? <CheckIcon /> : <CopyIcon />}
          variant="ghost"
        />
      </HStack>
    </Box>
  );
}

export default UserMsg;
