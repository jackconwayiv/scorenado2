import {
  Badge,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Tag,
  Wrap,
  WrapItem,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import PlayerInputRow from "./PlayerInputRow";
interface InputFormProps {
  supabase: any;
}

const InputForm = ({ supabase }: InputFormProps) => {
  const [game, setGame] = useState<string>("");
  const [gameId, setGameId] = useState<string | null>(null);
  const [dateOfGame, setDateOfGame] = useState<string | undefined>(undefined);
  const [myGames, setMyGames] = useState<any>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const toast = useToast();
  //formsCompletion is an array of booleans with length equal to one more than the number of players.
  //The index of each bool in formsCompletion represents the player, with the 0th being the game form.
  //This is not maximally useful until I refactor to handle all submits at once.
  const [formsCompletion, setFormsCompletion] = useState<boolean[]>([
    false,
    false,
  ]);

  const dateOfToday = new Date().toISOString().substring(0, 10);

  const fetchRecentGames = async () => {
    //currently this is just all games, will change to your 5 most played games, and will also need to fetch # of times that game appears (array.length?)
    try {
      let { data: games } = await supabase.from("games").select("id,name");
      if (games.length > 0) setMyGames(games);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("firing useeffect");
    const todaysDate = new Date().toISOString().substring(0, 10);
    setDateOfGame(todaysDate);
    fetchRecentGames();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  // const game_object = {
  //   id: 1,
  //   name: "Spirit Island",
  // };
  // const session_object = {
  //   id: 1,
  //   game_id: 1,
  //   date_played: "dateString",
  // };
  // const result_object = {
  //   id: 1,
  //   session_id: 1, //get from parent after api call is returned
  //   player_id: 1, //check if this player is already in db
  //   points: 1,
  //   result: "W",
  // };

  // const tag_object = {
  //   id: 1,
  //   game_id: 1,
  //   text: "won with relics",
  // };

  // const result_tag_object = {
  //   id: 1,
  //   result_id: 1, //get from parent after api call is returned
  //   tag_id: 1, //check to see fi this tag is already in db
  //   // player_id: 1, //may not need, but if so, check to see if this player is already in db
  // };

  // this simulates an array of game objects fetched from api
  const myRecentGames = [
    { id: 1, name: "Spirit Island", qty: 8 },
    { id: 2, name: "Dominion", qty: 7 },
    { id: 3, name: "Wingspan", qty: 5 },
    { id: 4, name: "Race for the Galaxy", qty: 1 },
    { id: 5, name: "Azul", qty: 3 },
  ];

  const handleDateChange = (assignedDate: string) => {
    if (assignedDate <= dateOfToday) {
      setDateOfGame(assignedDate);
    } else {
      setDateOfGame(dateOfToday);
    }
  };

  const markGameFormAsComplete = () => {
    const newCompletion = [...formsCompletion];
    newCompletion[0] = true;
    setFormsCompletion(newCompletion);
  };

  const handleGameInput = (gameName: string) => {
    if (gameName.length < 31) {
      setGame(gameName);
    }
    const isGameReady = gameName.length > 0;
    const newCompletion = [...formsCompletion];
    newCompletion[0] = isGameReady;
    setFormsCompletion(newCompletion);
  };

  const saveSession = async () => {
    try {
      let gameIdToSave = "";
      let { data: fetchedGame } = await supabase
        .from("games")
        .select("*")
        .eq("name", game)
        .limit(1);
      if (fetchedGame.length === 0) {
        const { data: createdGame } = await supabase
          .from("games")
          .insert([{ name: game }])
          .select();
        gameIdToSave = createdGame[0].id;
      } else {
        gameIdToSave = fetchedGame[0].id;
      }
      setGameId(gameIdToSave);
      const { data: savedSession } = await supabase
        .from("sessions")
        .insert([{ game_id: gameIdToSave, date_played: dateOfGame }])
        .select();
      const seshId = savedSession[0].id;
      setSessionId(seshId);
      toast({
        title: "Game session is created!",
        description: "Now continue by adding players!",
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

  return (
    <Flex direction="column" width="390px">
      <Heading size="lg" mb="10px">
        Input New Game Scores
      </Heading>
      <Flex direction="column" p="5px" width="390px">
        {!sessionId && (
          <Badge alignSelf="center" width="200px" colorScheme={`red`}>
            Enter Game Session Details
          </Badge>
        )}
        <Flex mt="5px">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              color="gray.400"
              fontSize=".7em"
              children="Game"
            />
            <Input
              value={game}
              isDisabled={sessionId !== null}
              onChange={(e) => {
                handleGameInput(e.target.value);
              }}
              width="380px"
              textAlign="center"
              mr="10px"
              bgColor="white"
            />
          </InputGroup>
        </Flex>
        <Flex mt="5px" justifyContent="center">
          <Wrap>
            {game === "" &&
              myRecentGames.map((game: any) => {
                return (
                  <WrapItem key={game.id}>
                    <Tag
                      cursor="pointer"
                      size="sm"
                      bgColor="gray.100"
                      onClick={() => {
                        setGame(game.name);
                        markGameFormAsComplete();
                      }}
                    >
                      {game.name} ({game.qty})
                    </Tag>
                  </WrapItem>
                );
              })}
          </Wrap>
        </Flex>
        <Flex mt="5px">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              color="gray.400"
              fontSize=".7em"
              children="Date"
            />
            <Input
              width="380px"
              mr="10px"
              bgColor="white"
              type="date"
              isDisabled={sessionId !== null}
              textAlign="center"
              value={dateOfGame ? dateOfGame : dateOfToday}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </InputGroup>
        </Flex>
        {!sessionId && (
          <Button
            alignSelf="center"
            mt="5px"
            width="100px"
            size="sm"
            isDisabled={!game}
            colorScheme="purple"
            onClick={saveSession}
          >
            Add Players
          </Button>
        )}
      </Flex>
      {sessionId && (
        <Flex justifyContent="center" mb="5px">
          <Button
            mt="5px"
            size="sm"
            bgColor="red.400"
            colorScheme="red"
            isDisabled={formsCompletion.length < 3}
            onClick={() => {
              const playersArray = [...formsCompletion];
              playersArray.pop();
              setFormsCompletion(playersArray);
            }}
          >
            -
          </Button>
          <Flex alignItems="center" justifyContent="center" width="80px">
            {formsCompletion.length - 1}{" "}
            {formsCompletion.length > 2 ? <>players</> : <>player</>}
          </Flex>

          <Button
            mt="5px"
            bgColor="green.400"
            size="sm"
            colorScheme="green"
            isDisabled={formsCompletion.length > 6}
            onClick={() => {
              const playersArray = [...formsCompletion];
              playersArray.push(false);
              setFormsCompletion(playersArray);
            }}
          >
            +
          </Button>
        </Flex>
      )}
      {sessionId && (
        <>
          {formsCompletion.map((player, idx) => {
            return idx > 0 ? (
              <PlayerInputRow
                key={idx}
                gameId={gameId}
                playerNumber={idx}
                supabase={supabase}
                formsCompletion={formsCompletion}
                setFormsCompletion={setFormsCompletion}
                sessionId={sessionId}
              />
            ) : (
              <Flex key={idx}></Flex>
            );
          })}
        </>
      )}
      {/* This part is only useful when I refactor to allow saving the whole thing at once: */}
      {/* <Flex justifyContent="center" mt="5px">
        <Button
          width="100px"
          colorScheme="purple"
          isDisabled={formsCompletion.indexOf(false) > -1}
          onClick={onOpen}
        >
          Finalize
        </Button>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Submit Game Scores
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you ready to commit this game to the records?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Review
                </Button>
                <Button colorScheme="purple" onClick={onClose} ml={3}>
                  Submit
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Flex> */}
    </Flex>
  );
};
export default InputForm;
