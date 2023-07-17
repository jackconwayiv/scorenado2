import {
  Badge,
  Button,
  Checkbox,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tag,
  Wrap,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TagInputRow from "./TagInputRow";
interface PlayerInputRowProps {
  playerNumber: number;
  supabase: any;
  gameId: string | null;
  formsCompletion: boolean[];
  setFormsCompletion: any;
  sessionId: string | null;
}
const PlayerInputRow = ({
  playerNumber,
  supabase,
  gameId,
  formsCompletion,
  setFormsCompletion,
  sessionId,
}: PlayerInputRowProps) => {
  const [name, setName] = useState<string>("");
  const [playerId, setPlayerId] = useState<string | null>(
    "bfd09774-09d8-4d8a-84e2-3ff46c6f5cec"
  );
  const [points, setPoints] = useState<number | null>(null);
  const [displayPoints, setDisplayPoints] = useState<string>("");
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [resultId, setResultId] = useState<string | null>(
    "53d9132c-b892-446d-b7ba-9b33b4dc648c"
  );
  const toast = useToast();

  // this is an array of player objects fetched from api
  const myRecentPlayers = [
    { id: 1, name: "Alan" },
    { id: 2, name: "Betty" },
    { id: 3, name: "Chuck" },
    { id: 4, name: "Diana" },
    { id: 5, name: "Eddie" },
  ];

  const [recentPlayers, setRecentPlayers] = useState<any>(myRecentPlayers);

  const handleNameInput = (playerName: string) => {
    if (playerName.length < 19) {
      setName(playerName);
    }
    const isPlayerReady = playerName.length > 0;
    const newCompletion = [...formsCompletion];
    newCompletion[playerNumber] = isPlayerReady;
    setFormsCompletion(newCompletion);
  };

  const markPlayerFormAsComplete = () => {
    const newCompletion = [...formsCompletion];
    newCompletion[playerNumber] = true;
    setFormsCompletion(newCompletion);
  };

  useEffect(() => {
    console.log("firing player input row useeffect");
    const fetchUser = async () => {
      if (playerNumber === 1) {
        try {
          const { data } = await supabase.auth.getSession();
          const fetchedUser = data.session.user;

          let { data: fetchedPlayers } = await supabase
            .from("players")
            .select("*")
            .eq("profile_id", fetchedUser.id);
          console.dir(fetchedPlayers);
          const fetchedNickname = fetchedPlayers[0].name;
          setName(fetchedNickname);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchUser();
  }, [supabase, playerNumber]);

  const saveResult = async () => {
    try {
      let playerIdToSave = "";
      let { data: fetchedPlayer } = await supabase
        .from("players")
        .select("*")
        .eq("name", name)
        .limit(1);
      if (fetchedPlayer.length === 0) {
        const { data: createdPlayer } = await supabase
          .from("players")
          .insert([{ name: name }])
          .select();
        playerIdToSave = createdPlayer[0].id;
      } else {
        playerIdToSave = fetchedPlayer[0].id;
      }
      setPlayerId(playerIdToSave);
      const { data: savedResult } = await supabase
        .from("results")
        .insert([
          {
            session_id: sessionId,
            player_id: playerIdToSave,
            points: points,
            is_winner: isWinner,
          },
        ])
        .select();
      const fetchedResultId = savedResult[0].id;
      setResultId(fetchedResultId);
      toast({
        title: `${name}'s results are saved!`,
        description: "Add tags, or move to the next player!",
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "There was an error...",
        description: `${error}`,
        status: "error",
        duration: 10000,
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      bgColor={resultId ? `green.200` : `red.200`}
      width="380px"
      p="5px"
      mt="5px"
    >
      {!resultId && (
        <Badge alignSelf="center" width="225px" colorScheme={`red`}>
          Unsaved Results for Player {playerNumber}
        </Badge>
      )}
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
            isDisabled={resultId !== null}
            onChange={(e) => {
              handleNameInput(e.target.value);
            }}
            bgColor="white"
          />
        </InputGroup>
        <InputGroup width="125px">
          <InputLeftElement>
            <Button
              size="xs"
              m="5px"
              isDisabled={resultId !== null}
              onClick={() => {
                const newPointsValue = points ? points - 1 : -1;
                setPoints(newPointsValue);
                setDisplayPoints(newPointsValue.toString());
              }}
            >
              -
            </Button>
          </InputLeftElement>
          <Input
            value={displayPoints || ""}
            textAlign="center"
            isDisabled={resultId !== null}
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
              isDisabled={resultId !== null}
              onClick={() => {
                const newPointsValue = points ? points + 1 : 1;
                setPoints(newPointsValue);
                setDisplayPoints(newPointsValue.toString());
              }}
            >
              +
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
                    markPlayerFormAsComplete();
                  }}
                >
                  {player.name}
                </Tag>
              </WrapItem>
            );
          })}
      </Wrap>
      <Checkbox
        isDisabled={!name || resultId !== null}
        isChecked={isWinner}
        alignSelf="center"
        mt="5px"
        colorScheme="purple"
        onChange={() => setIsWinner(!isWinner)}
      >
        Winner
      </Checkbox>
      {!resultId && (
        <Button
          alignSelf="center"
          mt="5px"
          width="260px"
          size="sm"
          isDisabled={!name}
          colorScheme="purple"
          onClick={saveResult}
        >
          Save {name ? `${name}'s` : `Player ${playerNumber}'s`} Score
        </Button>
      )}
      {resultId && (
        <>
          <TagInputRow
            gameId={gameId}
            supabase={supabase}
            playerId={playerId}
            resultId={resultId}
          />
        </>
      )}
    </Flex>
  );
};
export default PlayerInputRow;
