import { DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import colorArray from "../resources/colorArray";
import supabaseType from "../resources/types";
import TagInputRow from "./TagInputRow";

interface PlayerDisplayBoxProps {
  result: any;
  supabase: supabaseType;
  gameId: string;
  user: any;
  playerCount: number;
  setPlayerCount: any;
  finalized: boolean;
}

const PlayerDisplayBox = ({
  result,
  supabase,
  gameId,
  user,
  playerCount,
  setPlayerCount,
  finalized,
}: PlayerDisplayBoxProps) => {
  //gameId, resultId, and supabase needed for tag input row
  const toast = useToast();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const [player, setPlayer] = useState<any>({ name: "", color: "gray.200" });

  const handleDelete = async () => {
    try {
      await supabase.from("results").delete().eq("id", result.id);
      const newPlayerCount = playerCount - 1;
      setPlayerCount(newPlayerCount);
      toast({
        title: `That player was successfully deleted!`,
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
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

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        let { data: players } = await supabase
          .from("players")
          .select("*")
          .eq("name", result.players.name)
          .eq("user_id", user.id);
        if (players) {
          const fetchedPlayer = players[0];
          setPlayer(fetchedPlayer);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlayer();
  }, [supabase, user, result]);

  const handleNavigate = async () => {
    if (finalized) {
      navigate(`/players/${player.id}`);
    }
  };

  const updateColor = async (selectedColor: string) => {
    try {
      const newColor = `${selectedColor}.200`;
      await supabase
        .from("players")
        .update({ color: newColor })
        .eq("id", player.id)
        .select();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex margin="5px" mt="10px" direction="column" width="390px">
      <Card
        padding="10px"
        bgColor={player?.color || "gray.200"}
        cursor={finalized ? "pointer" : "default"}
        onClick={handleNavigate}
      >
        <Flex direction="column">
          {/* <Text>Avatar or 6-digit confirm code</Text> */}
          <Flex direction="row" justifyContent="space-between">
            <Heading size="md">{player.name}</Heading>
            {result.points > 0 && <Box>{result.points} points</Box>}
            <Box>{result.is_winner ? "WINNER" : " "}</Box>
          </Flex>
          {/* <Box fontSize="8px">
            {result.id} is the ID, which will be the param on the confirm score
            QR code route{" "}
          </Box> */}
          <TagInputRow
            resultId={result.id}
            gameId={gameId}
            supabase={supabase}
            user={user}
            finalized={finalized}
          />
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="370px"
            mt="5px"
          >
            {!finalized && (
              <>
                {colorArray.map((color: string, idx: number) => (
                  <Avatar
                    onClick={() => updateColor(color)}
                    key={idx}
                    size="2xs"
                    name={player.name}
                    bgColor={`${color}.200`}
                  />
                ))}

                <Button
                  size="xs"
                  width="20px"
                  mt="5px"
                  colorScheme="red"
                  alignSelf="end"
                  onClick={onAlertOpen}
                >
                  <DeleteIcon />
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Card>
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove {player.name}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to remove {player.name}'s results from the
              session? This action can't be undone!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};
export default PlayerDisplayBox;
