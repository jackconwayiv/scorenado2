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
  myPlayers: any;
  setMyPlayers: any;
}

const AddPlayerModal = ({
  isOpen,
  onClose,
  supabase,
  sessionId,
  user,
  playerCount,
  setPlayerCount,
  myPlayers,
  setMyPlayers,
}: AddPlayerModalProps) => {
  const [name, setName] = useState<string>("");
  const [player, setPlayer] = useState<any>({});
  const [points, setPoints] = useState<number | null>(null);
  const [displayPoints, setDisplayPoints] = useState<string>("");
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const toast = useToast();

  const handleNameInput = (playerName: string) => {
    if (playerName.length < 19) {
      setName(playerName);
    }
  };

  const handleSavePlayer = async () => {
    try {
      //if that length is 0, write a new player and grab it into state
      //also use that player to write the results row
      let confirmedPlayer = { name: "", id: "" };
      const myPlayerNames = myPlayers.map((player: any) => player.name);
      if (player.id) {
        //this is case where user clicked a suggested player
        confirmedPlayer = { ...player };
      } else if (myPlayerNames.indexOf(name) !== -1) {
        //this is a corner case where user chose to type out the name
        //even though it was already auto-suggested for them
        confirmedPlayer = myPlayers[myPlayerNames.indexOf(name)];
      } else {
        //we are trying to see if the user is already in db and hasn't
        //been suggested for some reason (will be useful later when
        //we grab top 5 most faced players, and not all of them)
        let { data: foundPlayers } = await supabase
          .from("players")
          .select("*")
          .eq("name", name)
          .eq("user_id", user.id);
        if (foundPlayers && foundPlayers.length > 0) {
          confirmedPlayer = foundPlayers[0];
        } else {
          //last case is we have to write a new player and grab it into state
          const { data: newPlayer } = await supabase
            .from("players")
            .insert([{ name: name, user_id: user.id }])
            .select();
          //may need to debug here to make sure we know what newPlayer is
          if (newPlayer && newPlayer.length > 0) {
            confirmedPlayer = newPlayer[0];
          }
        }
      }
      if (confirmedPlayer && confirmedPlayer.id) {
        await supabase
          .from("results")
          .insert([
            {
              session_id: sessionId,
              player_id: confirmedPlayer.id,
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
        setPlayer({});
        setPoints(null);
        setDisplayPoints("");
        setIsWinner(false);
      } else {
        console.error("We had trouble setting that user.");
      }
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
              myPlayers.map((player: any, idx: number) => {
                return (
                  <WrapItem key={player.id}>
                    <Tag
                      cursor="pointer"
                      size="sm"
                      bgColor={player.color}
                      m="5px"
                      onClick={() => {
                        const newPlayers = myPlayers.toSpliced(idx, 1);
                        setMyPlayers(newPlayers);
                        setName(player.name);
                        setPlayer(player);
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
