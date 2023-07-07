import { Flex, Input, Tag, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { useState } from "react";
import colorArray from "../resources/colorArray";
import TagInputRow from "./TagInputRow";
interface PlayerInputRowProps {
  playerNumber: number;
  recentPlayers: any;
  setRecentPlayers: any;
}
const PlayerInputRow = ({
  playerNumber,
  recentPlayers,
  setRecentPlayers,
}: PlayerInputRowProps) => {
  const [name, setName] = useState<string>("");
  const [points, setPoints] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>("");

  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      bgColor={colorArray[playerNumber]}
      width="400px"
      p="5px"
    >
      <Flex direction="row" mt="5px">
        <Text width="85px" p="10px" textAlign="right">
          Player {playerNumber}:{" "}
        </Text>
        <Input
          width="310px"
          value={name}
          onChange={(e) => setName(e.target.value)}
          bgColor="white"
        />
      </Flex>
      <Wrap>
        {name === "" &&
          recentPlayers.map((player: any, idx: number) => {
            return (
              <WrapItem key={player.id}>
                <Tag
                  cursor="pointer"
                  size="sm"
                  bgColor="gray.100"
                  m="5px"
                  onClick={() => {
                    const newRecentPlayers = recentPlayers.toSpliced(idx, 1);
                    setRecentPlayers(newRecentPlayers);
                    setName(player.name);
                  }}
                >
                  {player.name}
                </Tag>
              </WrapItem>
            );
          })}
      </Wrap>
      <Flex mt="5px">
        <Text width="85px" p="10px" textAlign="right">
          Points:{" "}
        </Text>
        <Input width="110px" bgColor="white" />
        <Text width="85px" p="10px" textAlign="right">
          Result:{" "}
        </Text>
        <Input width="115px" bgColor="white" />
      </Flex>
      <TagInputRow />
    </Flex>
  );
};
export default PlayerInputRow;
