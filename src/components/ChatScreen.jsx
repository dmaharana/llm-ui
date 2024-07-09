import { useState } from "react";
import { Box, Button, HStack, Text, Textarea, VStack } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { UserMsg } from "./UserMsg";
import { AssistantMsg } from "./AssistantMsg";

export default function ChatScreen() {
  const [conversation, setConversation] = useState({});
  const [query, setQuery] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newMsgId = 1;
    if (conversation.length > 0) {
      newMsgId = conversation[conversation.length - 1].id + 1;
    }
    const newMessage = {
      id: newMsgId,
      user: query,
      assistant: "Assistant is typing...",
    };

    if (conversation.length > 0) {
      setConversation([...conversation, newMessage]);
    } else {
      setConversation([newMessage]);
    }
    setQuery("");

    const reqBody = {
      model: "llama3:latest",
      prompt: query,
      stream: true,
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();

        done = doneReading;
        if (done) {
          break;
        }
        const chunkValue = decoder.decode(value);
        const cJson = JSON.parse(chunkValue);
        // console.log(cJson);
        text += cJson["response"];
        setConversation((p) =>
          p.map((m) => (m.id === newMsgId ? { ...m, assistant: text } : m))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box bg={"red.50"}>
      <VStack h={"100vh"} bg={"gray.50"} py={4} px={2}>
        <Text
          fontSize={"2xl"}
          fontWeight={"bold"}
          textAlign={"center"}
          bg={"teal.50"}
          w={"100%"}
          p={2}
        >
          Vox
        </Text>
        <VStack h={"100vh"} w={"100%"} bg={"blue.150"} overflowY={"auto"}>
          {conversation.length > 0 ? (
            conversation.map((m, index) => (
              <>
                {m.user && <UserMsg msg={m.user} />}
                {m.assistant && <AssistantMsg msg={m.assistant} />}
              </>
            ))
          ) : (
            <Text fontSize={"lg"} color={"gray.600"} as={"i"}>
              Start a conversation...
            </Text>
          )}
        </VStack>

        <Box w={"100%"} bg={"green.50"}>
          <HStack bg={"green.50"}>
            <Textarea
              placeholder="Enter your query here"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              colorScheme={"purple"}
              type="submit"
              disabled={!query}
              onSubmit={(e) => handleSubmit(e)}
              onClick={(e) => handleSubmit(e)}
            >
              <ChatIcon />
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}
