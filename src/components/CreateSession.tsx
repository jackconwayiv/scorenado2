import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Tag,
  Text,
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
  const [dateOfGame, setDateOfGame] = useState<string | undefined>(undefined);
  const [myGames, setMyGames] = useState<any>([]);
  const toast = useToast();
  const navigate = useNavigate();
  const dateOfToday = new Date().toISOString().substring(0, 10);

  useEffect(() => {
    console.log("firing input form useeffect");
    const todaysDate = new Date().toISOString().substring(0, 10);
    setDateOfGame(todaysDate);
    const fetchRecentGames = async () => {
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
          title: `Game session of ${game} is created!`,
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
      <Flex direction="column" p="5px" width="390px">
        <Flex mt="5px" direction="column" alignItems="baseline">
          <Text>Name of Game:</Text>
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
        <Flex mt="15px" direction="column" alignItems="baseline">
          <Text>Date of Game:</Text>
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
          mt="15px"
          width="90px"
          isDisabled={!game}
          colorScheme="purple"
          onClick={saveSession}
        >
          {`Next >>`}
        </Button>
      </Flex>
    </Flex>
  );
};
export default CreateSession;
