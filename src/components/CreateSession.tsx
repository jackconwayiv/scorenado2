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
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabaseType from "../resources/types";

interface CreateSessionProps {
  supabase: supabaseType;
  user: any;
}

const CreateSession = ({ supabase, user }: CreateSessionProps) => {
  const [game, setGame] = useState<string>("");
  const [gameId, setGameId] = useState<string | null>(null);
  const [dateOfGame, setDateOfGame] = useState<string | undefined>(undefined);
  const [myGames, setMyGames] = useState<any>([]);
  const toast = useToast();
  const navigate = useNavigate();
  const dateOfToday = new Date().toISOString().substring(0, 10);

  // we need game_id, date_played, user_id
  //we'll get a new session id back and navigate to that route to the editor.

  useEffect(() => {
    console.log("firing input form useeffect");
    const todaysDate = new Date().toISOString().substring(0, 10);
    setDateOfGame(todaysDate);
    const fetchRecentGames = async () => {
      //currently this is just all games, will change to your 5 most played games, and will also need to fetch # of times that game appears (array.length?)
      try {
        let { data: games } = await supabase.from("games").select("id,name");
        if (games && games.length > 0) setMyGames(games);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecentGames();
  }, [supabase]);

  const handleDateChange = (assignedDate: string) => {
    if (assignedDate <= dateOfToday) {
      setDateOfGame(assignedDate);
    } else {
      setDateOfGame(dateOfToday);
    }
  };

  const handleGameInput = (gameName: string) => {
    if (gameName.length < 31) {
      setGame(gameName);
    }
  };

  const saveSession = async () => {
    try {
      let gameIdToSave = "";
      let { data: fetchedGame } = await supabase
        .from("games")
        .select("*")
        .eq("name", game)
        .limit(1);
      if (fetchedGame && fetchedGame.length === 0) {
        const { data: createdGame } = await supabase
          .from("games")
          .insert([{ name: game }])
          .select();
        if (createdGame) gameIdToSave = createdGame[0].id;
      } else {
        if (fetchedGame) gameIdToSave = fetchedGame[0].id;
      }
      setGameId(gameIdToSave);
      const { data: savedSession } = await supabase
        .from("sessions")
        .insert([
          { game_id: gameIdToSave, date_played: dateOfGame, user_id: user.id },
        ])
        .select();
      if (savedSession) {
        const seshId = savedSession[0].id;
        navigate(`session/${seshId}`);
        toast({
          title: "Game session is created!",
          description: "Now continue by adding players!",
          status: "success",
          duration: 5000,
          position: "top",
          isClosable: true,
        });
      }
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
    <Flex direction="column" width="390px">
      <Heading size="lg" mb="10px" textAlign="center" mt="10px">
        Input New Game Scores
      </Heading>
      <Flex direction="column" p="5px" width="390px">
        <Flex mt="5px">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              color="gray.400"
              fontSize=".7em"
              children="Game"
            />
            <Input
              value={game}
              onChange={(e) => {
                handleGameInput(e.target.value);
              }}
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
              myGames.map((game: any) => {
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
              value={dateOfGame ? dateOfGame : dateOfToday}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <Button
          alignSelf="center"
          mt="5px"
          width="200px"
          size="sm"
          isDisabled={!game}
          colorScheme="purple"
          onClick={saveSession}
        >
          Save Session & Add Scores
        </Button>
      </Flex>
    </Flex>
  );
};
export default CreateSession;
