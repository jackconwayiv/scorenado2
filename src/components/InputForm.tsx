import {
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Tag,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import PlayerInputRow from "./PlayerInputRow";

const InputForm = () => {
  const [game, setGame] = useState<string>("");
  const [dateOfGame, setDateOfGame] = useState<string | undefined>(undefined);

  //formsCompletion is an array of booleans with length equal to one more than the number of players
  //the index of each bool in formsCompletion represents the player, with the 0th being the game form
  const [formsCompletion, setFormsCompletion] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const dateOfToday = new Date().toISOString().substring(0, 10);

  useEffect(() => {
    const todaysDate = new Date().toISOString().substring(0, 10);
    setDateOfGame(todaysDate);
  }, []);

  // this is an array of profile objects fetched from api
  const myRecentPlayers = [
    { id: 1, name: "Alan" },
    { id: 2, name: "Betty" },
    { id: 3, name: "Chuck" },
    { id: 4, name: "Diana" },
    { id: 5, name: "Eddie" },
  ];

  const [recentPlayers, setRecentPlayers] = useState<any>(myRecentPlayers);

  const game_object = {
    id: 1,
    name: "Spirit Island",
  };
  const session_object = {
    id: 1,
    game_id: 1,
    date_played: "dateString",
  };
  const result_object = {
    id: 1,
    session_id: 1, //get from parent after api call is returned
    player_id: 1, //check if this player is already in db
    points: 1,
    result: "W",
  };

  const tag_object = {
    id: 1,
    game_id: 1,
    text: "won with relics",
  };

  const result_tag_object = {
    id: 1,
    result_id: 1, //get from parent after api call is returned
    tag_id: 1, //check to see fi this tag is already in db
    // player_id: 1, //may not need, but if so, check to see if this player is already in db
  };

  // this is an array of game objects fetched from api
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

  return (
    <Flex direction="column" width="390px">
      <Heading size="lg" mb="10px">
        Input New Game Scores
      </Heading>
      <Flex direction="column" p="5px" width="390px">
        <Flex>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              color="gray.400"
              fontSize=".7em"
              children="Game"
            />
            <Input
              value={game}
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
              myRecentGames.map((game) => {
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
              textAlign="center"
              value={dateOfGame ? dateOfGame : dateOfToday}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </InputGroup>
        </Flex>
      </Flex>
      <Flex justifyContent="center" mb="5px">
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
        <Flex alignItems="center" justifyContent="center" width="80px">
          {formsCompletion.length - 1}{" "}
          {formsCompletion.length > 2 ? <>players</> : <>player</>}
        </Flex>

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
      </Flex>
      {formsCompletion.map((player, idx) => {
        return idx > 0 ? (
          <PlayerInputRow
            key={idx}
            playerNumber={idx}
            recentPlayers={recentPlayers}
            setRecentPlayers={setRecentPlayers}
            formsCompletion={formsCompletion}
            setFormsCompletion={setFormsCompletion}
          />
        ) : (
          <Flex key={idx}></Flex>
        );
      })}
      <Flex justifyContent="center" mt="5px">
        <Button
          width="100px"
          colorScheme="purple"
          isDisabled={formsCompletion.indexOf(false) > -1}
        >
          Finalize
        </Button>
      </Flex>
      {JSON.stringify(formsCompletion)}
    </Flex>
  );
};
export default InputForm;
