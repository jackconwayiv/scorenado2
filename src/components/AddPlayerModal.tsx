import {
  Button,
  Checkbox,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Wrap,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import supabaseType from "../resources/types";

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  supabase: supabaseType;
  sessionId: string | undefined;
  user: any;
  playerCount: number;
  setPlayerCount: (arg0: number) => void;
}

const AddPlayerModal = ({
  isOpen,
  onClose,
  supabase,
  sessionId,
  user,
  playerCount,
  setPlayerCount,
}: AddPlayerModalProps) => {
  const [name, setName] = useState<string>("");
  const [points, setPoints] = useState<number | null>(null);
  const [displayPoints, setDisplayPoints] = useState<string>("");
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const toast = useToast();

  // this is an array of player objects fetched from api
  //this should be fetched at EditSession level and passed into modal child
  //at parent level, it should be filtered so names that are already in records aren't available
  const myRecentPlayers = [
    { id: 1, name: "Ren" },
    { id: 2, name: "Caleb" },
    { id: 3, name: "Nana" },
    { id: 4, name: "Jack" },
    { id: 5, name: "Sam" },
    { id: 6, name: "Lolo" },
    { id: 7, name: "Dantrum" },
    { id: 8, name: "RayRae" },
    { id: 9, name: "Drew" },
    { id: 10, name: "Leah" },
  ];

  const [recentPlayers, setRecentPlayers] = useState<any>(myRecentPlayers);

  const handleNameInput = (playerName: string) => {
    if (playerName.length < 19) {
      setName(playerName);
    }
  };

  const handleSavePlayer = async () => {
    try {
      const { data: newResult } = await supabase
        .from("results")
        .insert([
          {
            session_id: sessionId,
            name: name,
            points: points,
            is_winner: isWinner,
            user_id: user.id,
          },
        ])
        .select();
      toast({
        title: `${name}'s results are saved!`,
        description: "Add tags, or move to the next player!",
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      const newPlayerCount = playerCount + 1;
      setPlayerCount(newPlayerCount);
      setName("");
      setPoints(null);
      setDisplayPoints("");
      setIsWinner(false);
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "There was an error...",
        description: `${error}`,
        status: "error",
        duration: 10000,
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a Player</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="row" mt="5px">
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                color="gray.400"
                fontSize=".7em"
                children={`Name`}
              />
              <Input
                width="240px"
                value={name}
                textAlign="center"
                onChange={(e) => {
                  handleNameInput(e.target.value);
                }}
                bgColor="white"
              />
            </InputGroup>
            <InputGroup width="125px">
              <InputLeftElement>
                <Button
                  size="xs"
                  m="5px"
                  onClick={() => {
                    const newPointsValue = points ? points - 1 : -1;
                    setPoints(newPointsValue);
                    setDisplayPoints(newPointsValue.toString());
                  }}
                >
                  -
                </Button>
              </InputLeftElement>
              <Input
                value={displayPoints || ""}
                textAlign="center"
                onChange={(e) => {
                  if (e.target.value.length < 5) {
                    const newPointsDisplay = e.target.value;
                    setDisplayPoints(newPointsDisplay);
                  }
                }}
                onBlur={(e) => {
                  const newPoints = parseInt(e.target.value) || null;
                  setPoints(newPoints);
                  if (!newPoints) {
                    setDisplayPoints("");
                  } else {
                    setDisplayPoints(newPoints.toString());
                  }
                }}
                width="250px"
                bgColor="white"
              />
              <InputRightElement>
                <Button
                  size="xs"
                  m="5px"
                  onClick={() => {
                    const newPointsValue = points ? points + 1 : 1;
                    setPoints(newPointsValue);
                    setDisplayPoints(newPointsValue.toString());
                  }}
                >
                  +
                </Button>
              </InputRightElement>
            </InputGroup>
          </Flex>
          <Wrap>
            {name === "" &&
              recentPlayers.map((player: any, idx: number) => {
                return (
                  <WrapItem key={player.id}>
                    <Tag
                      cursor="pointer"
                      size="sm"
                      bgColor="gray.100"
                      m="5px"
                      onClick={() => {
                        const newRecentPlayers = recentPlayers.toSpliced(
                          idx,
                          1
                        );
                        setRecentPlayers(newRecentPlayers);
                        setName(player.name);
                      }}
                    >
                      {player.name}
                    </Tag>
                  </WrapItem>
                );
              })}
          </Wrap>
          <Checkbox
            isDisabled={!name}
            isChecked={isWinner}
            alignSelf="center"
            mt="5px"
            colorScheme="purple"
            onChange={() => setIsWinner(!isWinner)}
          >
            Winner
          </Checkbox>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSavePlayer}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default AddPlayerModal;
