import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tag,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
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
  const [winning, setWinning] = useState<boolean>(false);

  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      bgColor={colorArray[playerNumber]}
      width="380px"
      p="5px"
      mt="5px"
    >
      <Flex direction="row" mt="5px">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="gray.400"
            fontSize=".7em"
            children={`P${playerNumber}`}
          />
          <Input
            width="245px"
            value={name}
            textAlign="center"
            onChange={(e) => setName(e.target.value)}
            bgColor="white"
          />
        </InputGroup>
        <InputGroup width="120px">
          <InputLeftElement>
            <Button
              size="xs"
              m="5px"
              onClick={() => setPoints(points ? points + 1 : 1)}
            >
              +
            </Button>
          </InputLeftElement>
          <Input
            // value={points === null ? "" : points}
            textAlign="center"
            onBlur={(e) =>
              e.target.value
                ? setPoints(parseInt(e.target.value))
                : setPoints(null)
            }
            width="250px"
            bgColor="white"
          />
          <InputRightElement>
            <Button
              size="xs"
              m="5px"
              onClick={() => setPoints(points ? points - 1 : -1)}
            >
              -
            </Button>
          </InputRightElement>
        </InputGroup>
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
      <TagInputRow name={name} winning={winning} setWinning={setWinning} />
    </Flex>
  );
};
export default PlayerInputRow;
