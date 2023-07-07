import { Flex, Input, Text } from "@chakra-ui/react";
interface PlayerInputRowProps {
  playerNumber: number;
}
const PlayerInputRow = ({ playerNumber }: PlayerInputRowProps) => {
  const colorArray = [
    "teal.200",
    "purple.200",
    "cyan.200",
    "gray.300",
    "teal.200",
    "purple.200",
    "cyan.200",
    "gray.300",
    "teal.200",
    "purple.200",
    "cyan.200",
    "gray.300",
  ];

  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      bgColor={colorArray[playerNumber]}
      p="5px"
    >
      <Flex direction="row" mb="5px">
        <Text width="90px" p="10px" textAlign="right">
          Player {playerNumber}:{" "}
        </Text>
        <Input width="240px" bgColor="white" />
      </Flex>
      <Flex mb="5px">
        <Text width="90px" p="10px" textAlign="right">
          Points:{" "}
        </Text>
        <Input width="75px" bgColor="white" />
        <Text width="90px" p="10px" textAlign="right">
          Result:{" "}
        </Text>
        <Input width="75px" bgColor="white" />
      </Flex>
      <Flex mb="5px">
        <Text width="90px" p="10px" textAlign="right">
          Tags:{" "}
        </Text>
        <Input width="240px" bgColor="white" />
      </Flex>
    </Flex>
  );
};
export default PlayerInputRow;
