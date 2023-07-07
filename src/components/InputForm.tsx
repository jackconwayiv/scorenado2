import {
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
  const gameObject = {
    id: 1,
    name: "Spirit Island",
  };
  const session = {
    id: 1,
    game_id: 1,
    date_played: "dateString",
  };
  const playerOneResult = {
    id: 1,
    session_id: 1,
    player_id: 1,
    points: 1,
    result: "W",
  };
  const playerOneTags = [
    { id: 1, result_id: 1, text: "won with relics", game_id: 1 },
    { id: 2, result_id: 2, text: "no success with rum", game_id: 1 },
  ];
  const recentGames = ["Spirit Island", "Race for the Galaxy", "Azul", "Dominion", "Wingspan"];

  return (
    <Flex direction="column" width="400px" alignItems="center">
      <Heading size="lg" mb="10px">
        Input New Game Scores
      </Heading>
      <Flex direction="column" bgColor="teal.200" p="5px" width="400px">
        <Flex>
          <Text width="85px" p="10px" textAlign="right">
            Game:{" "}
          </Text>
          <Input
            value={game}
            onChange={(e) => setGame(e.target.value)}
            width="230px"
            bgColor="white"
          />
        </Flex>
        <Wrap mt="5px">
          {game === "" &&
            recentGames.map((game) => {
              return (
                <WrapItem>
                  <Tag
                    cursor="pointer"
                    size="sm"
                    m="5px"
                    onClick={() => setGame(game)}
                  >
                    {game}
                  </Tag>
                </WrapItem>
              );
            })}
        </Wrap>
        <Flex mt="5px">
          <Text width="85px" p="10px" textAlign="right">
            Date:{" "}
          </Text>
          <Input width="230px" bgColor="white" />
        </Flex>
      </Flex>
      <PlayerInputRow playerNumber={1} />
      <PlayerInputRow playerNumber={2} />
      <PlayerInputRow playerNumber={3} />
    </Flex>
  );
};
export default InputForm;
