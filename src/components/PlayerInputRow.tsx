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
  const [displayPoints, setDisplayPoints] = useState<string>("");
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
            width="240px"
            value={name}
            textAlign="center"
            onChange={(e) => {
              if (e.target.value.length < 19) setName(e.target.value);
            }}
            bgColor="white"
          />
        </InputGroup>
        <InputGroup width="125px">
          <InputLeftElement>
            <Button
              size="xs"
              m="5px"
              onClick={() => {
                const newPointsValue = points ? points + 1 : 1;
                setPoints(newPointsValue);
                setDisplayPoints(newPointsValue.toString());
              }}
            >
              +
            </Button>
          </InputLeftElement>
          <Input
            value={displayPoints || ""}
            textAlign="center"
            onChange={(e) => {
              if (e.target.value.length < 5) {
                const newPointsDisplay = e.target.value;
                setDisplayPoints(newPointsDisplay);
              }
            }}
            onBlur={(e) => {
              const newPoints = parseInt(e.target.value) || null;
              setPoints(newPoints);
              if (!newPoints) {
                setDisplayPoints("");
              } else {
                setDisplayPoints(newPoints.toString());
              }
            }}
            width="250px"
            bgColor="white"
          />
          <InputRightElement>
            <Button
              size="xs"
              m="5px"
              onClick={() => {
                const newPointsValue = points ? points - 1 : -1;
                setPoints(newPointsValue);
                setDisplayPoints(newPointsValue.toString());
              }}
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
