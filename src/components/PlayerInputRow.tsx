import { Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import TagInputRow from "./TagInputRow";
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
  ];

  const [name, setName] = useState<string>("");
  const [points, setPoints] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>("");

  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      bgColor={colorArray[playerNumber]}
      p="5px"
      width="400px"
    >
      <Flex direction="row" mb="5px">
        <Text width="85px" p="10px" textAlign="right">
          Player {playerNumber}:{" "}
        </Text>
        <Input width="230px" bgColor="white" />
      </Flex>
      <Flex mb="5px">
        <Text width="85px" p="10px" textAlign="right">
          Points:{" "}
        </Text>
        <Input width="70px" bgColor="white" />
        <Text width="85px" p="10px" textAlign="right">
          Result:{" "}
        </Text>
        <Input width="75px" bgColor="white" />
      </Flex>
      <TagInputRow />
    </Flex>
  );
};
export default PlayerInputRow;
