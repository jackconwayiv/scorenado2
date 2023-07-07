import {
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useState } from "react";
import PlayerInputRow from "./PlayerInputRow";

const InputForm = () => {
  const [game, setGame] = useState<string>("");
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(3);
  const [winner, setWinner] = useState<string | null>(null);

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
    <Flex direction="column" width="400px" alignItems="center">
      <Heading size="lg" mb="10px">
        Input New Game Scores
      </Heading>
      <Flex direction="column" p="5px" width="400px">
        <Flex>
          <Text width="85px" p="10px" textAlign="right">
            Game:{" "}
          </Text>
          <Input
            value={game}
            onChange={(e) => setGame(e.target.value)}
            width="370px"
            bgColor="white"
          />
        </Flex>
        <Wrap mt="5px">
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
        <Flex mt="5px">
          <Text width="85px" p="10px" textAlign="right">
            Date:{" "}
          </Text>
          <Input width="370px" bgColor="white" />
        </Flex>
        <Flex direction="row" justifyContent="center">
          {winner && winner !== "tie" ? (
            <Text>{winner} won!</Text>
          ) : (
            <Text>No winner determined.</Text>
          )}
        </Flex>
        <Flex>
          <Checkbox
            isChecked={winner === "tie"}
            onChange={() => {
              winner === "tie" ? setWinner(null) : setWinner("tie");
            }}
          >
            Tie
          </Checkbox>
        </Flex>
      </Flex>
      <Flex justifyContent="center" mb="5px">
        <Button
          m="5px"
          bgColor="green.200"
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
          m="5px"
          bgColor="red.200"
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
            playerNumber={player}
            winner={winner}
            setWinner={setWinner}
            recentPlayers={recentPlayers}
            setRecentPlayers={setRecentPlayers}
          />
        );
      })}
    </Flex>
  );
};
export default InputForm;
