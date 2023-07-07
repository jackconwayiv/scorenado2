import { Flex, Heading, Input, Text } from "@chakra-ui/react";
import PlayerInputRow from "./PlayerInputRow";

const InputForm = () => {
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

  return (
    <Flex direction="column" width="400px" alignItems="center">
      <Heading size="lg" mb="30px">
        Input New Game Scores
      </Heading>
      <Flex direction="column" bgColor="teal.200" p="5px">
        <Flex mb="5px">
          <Text width="90px" p="10px" textAlign="right">
            Game:{" "}
          </Text>
          <Input width="240px" bgColor="white" />
        </Flex>
        <Flex mb="5px">
          <Text width="90px" p="10px" textAlign="right">
            Date:{" "}
          </Text>
          <Input width="240px" bgColor="white" />
        </Flex>
      </Flex>
      <PlayerInputRow playerNumber={1} />
      <PlayerInputRow playerNumber={2} />
      <PlayerInputRow playerNumber={3} />
      <PlayerInputRow playerNumber={4} />
      <PlayerInputRow playerNumber={5} />
      <PlayerInputRow playerNumber={6} />
    </Flex>
  );
};
export default InputForm;
