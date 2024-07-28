import { useState } from "react";
import { Box, Button, HStack, Text, Textarea, VStack } from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";
import { BeatLoader } from "react-spinners";
import { UserMsg } from "./UserMsg";
import { AssistantMsg } from "./AssistantMsg";
import ModelSelect from "./ModelSelect";

export default function ChatScreen() {
  const [conversation, setConversation] = useState({});
  const [query, setQuery] = useState("");
  const [model, setModel] = useState("");
  const [convHistory, setConvHistory] = useState([]);
  const [convId, setConvId] = useState(1);
  const initialAssistantMessage = (
    <Button
      isLoading
      // colorScheme="orange"
      // loadingText="Thinking..."
      spinner={<BeatLoader size={8} color="red" />}
      variant={"ghost"}
    />
  );
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [currentMsgId, setCurrentMsgId] = useState(1);

  // console.log(model);

  // handle resubmit for a message with given id
  const handleResubmit = async (id) => {
    // find the message with the given id
    setCurrentMsgId(id);
    const message = conversation.find((msg) => msg.id === id);
    const newMessage = {
      id: id,
      user: message.user,
      model: model,
      assistant: "Thinking...",
      resTime: "",
    };

    // setConversation((p) =>
    //   p.map((m) => (m.id === id ? { ...m, newMessage } : m))
    // );
    // ? { ...m, assistant: newMessage.assistant, model: newMessage.model }

    setConversation((p) =>
      p.map((m) =>
        m.id === id
          ? {
              ...m,
              user: newMessage.user,
              model: newMessage.model,
              assistant: newMessage.assistant,
              resTime: newMessage.resTime,
            }
          : m
      )
    );

    callLlmService(newMessage);
  };

  const handleQueryUpdate = (id, newQuery) => {
    // find the message with the given id
    const message = conversation.find((msg) => msg.id === id);

    if (message) {
      setConversation((conversation) =>
        conversation.map((msg) =>
          msg.id === id ? { ...msg, user: newQuery } : msg
        )
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newMsgId = 1;
    if (conversation.length > 0) {
      newMsgId = conversation[conversation.length - 1].id + 1;
    }
    setCurrentMsgId(newMsgId);

    const newMessage = {
      id: newMsgId,
      user: query,
      model: model,
      // assistant: "",
      assistant: "Thinking...",
      // assistant: initialAssistantMessage,
      resTime: 0,
    };

    if (conversation.length > 0) {
      setConversation([...conversation, newMessage]);
    } else {
      setConversation([newMessage]);
    }
    setQuery("");

    callLlmService(newMessage);
  };

  const callLlmService = async (message) => {
    // console.log(conversation);
    // get user query for the message id
    const query = message.user;
    const msgId = message.id;
    const startTime = new Date().getTime();

    const reqBody = {
      model: model,
      prompt: query,
      stream: true,
    };

    try {
      setWaitingResponse(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      if (!response.ok) {
        const errBody = await response.json();
        console.error(errBody);
        setConversation((p) =>
          p.map((m) =>
            m.id === msgId
              ? {
                  ...m,
                  assistant: errBody.message,
                  model,
                  resTime: "0s",
                }
              : m
          )
        );
        return;
      }

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

        const chunkValue = decoder.decode(value, { stream: true });
        try {
          // const chunkValue = decoder.decode(value);
          const cJson = JSON.parse(chunkValue);
          // console.log(cJson);
          text += cJson["response"];
          const endTime = new Date().getTime();
          const resTime = (endTime - startTime) / 1000;
          setConversation((p) =>
            p.map((m) =>
              m.id === msgId
                ? {
                    ...m,
                    assistant: text,
                    model,
                    resTime: `${resTime.toFixed(2)}s`,
                  }
                : m
            )
          );
        } catch (error) {
          console.error(error);
          console.log(chunkValue);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setWaitingResponse(false);
      setCurrentMsgId(0);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  const handleClearChat = () => {
    setConversation({});
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
        {initialAssistantMessage}
        <VStack h={"100vh"} w={"100%"} bg={"blue.150"} overflowY={"auto"}>
          {conversation.length > 0 ? (
            conversation.map((m) => (
              <Box key={m.id} w={"100%"}>
                {m.user && (
                  <UserMsg
                    msg={m.user}
                    msgId={m.id}
                    waitingResponse={waitingResponse}
                    handleQueryUpdate={handleQueryUpdate}
                  />
                )}
                {m.assistant && (
                  <AssistantMsg
                    msg={m.assistant}
                    name={m.model}
                    convId={m.id}
                    resTime={m.resTime}
                    handleRepeat={handleResubmit}
                    waitingResponse={waitingResponse}
                    currentMsgId={currentMsgId}
                    defaultMsg={initialAssistantMessage}
                  />
                )}
              </Box>
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
              onKeyDown={(e) => handleKeyPress(e)}
            />
            {query && (
              <Button
                colorScheme={"purple"}
                type="submit"
                variant={"ghost"}
                isDisabled={!query || waitingResponse}
                onClick={(e) => handleSubmit(e)}
              >
                <IoMdSend size={40} />
              </Button>
            )}
          </HStack>
          <HStack>
            <ModelSelect model={model} setModel={setModel} />
            <Button alignSelf={"flex-end"} onClick={handleClearChat}>
              Clear
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}
