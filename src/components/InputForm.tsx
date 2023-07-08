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
  const [date, setDate] = useState<String>("");
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(3);

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setDate(formattedDate);
  }, []);

  const today = new Date();
  const defaultDateValue = new Date(today).toISOString().split("T")[0]; // yyyy-mm-dd

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

  const makeArrayOfPlayers = () => {
    let playerArray = [];
    for (let i = 1; i <= numberOfPlayers; i++) {
      playerArray.push(i);
    }
    return playerArray;
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
              onChange={(e) => setGame(e.target.value)}
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
              defaultValue={defaultDateValue}
              onBlur={(e) => setDate(e.target.value)}
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
          isDisabled={numberOfPlayers > 5}
          onClick={() => {
            setNumberOfPlayers(numberOfPlayers + 1);
          }}
        >
          +
        </Button>
        <Flex alignItems="center" justifyContent="center" width="80px">
          {numberOfPlayers} {numberOfPlayers > 1 ? <>players</> : <>player</>}
        </Flex>

        <Button
          mt="5px"
          size="sm"
          bgColor="red.400"
          colorScheme="red"
          isDisabled={numberOfPlayers < 2}
          onClick={() => {
            setNumberOfPlayers(numberOfPlayers - 1);
          }}
        >
          -
        </Button>
      </Flex>
      {makeArrayOfPlayers().map((player) => {
        return (
          <PlayerInputRow
            key={player}
            playerNumber={player}
            recentPlayers={recentPlayers}
            setRecentPlayers={setRecentPlayers}
          />
        );
      })}
    </Flex>
  );
};
export default InputForm;
