import { Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabaseType from "../resources/types";

interface MyPlayersProps {
  supabase: supabaseType;
  user: any;
}

const MyPlayers = ({ supabase, user }: MyPlayersProps) => {
  const [players, setPlayers] = useState<any>([]);
  const navigate = useNavigate();

  useEffect(() => {
    //grab "me" from the array and store it separately
    //and display yourself before the rest of your friends
    //sort your friends by # of games
    //tiebreaker is alphabetical
    const fetchMyPlayers = async () => {
      try {
        //fetch all my players
        let { data: fetchedPlayers } = await supabase
          .from("players")
          .select("*, results(*)")
          .eq("user_id", user.id);
        setPlayers(fetchedPlayers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMyPlayers();
  }, [supabase, user]);

  return (
    <Flex direction="column" alignItems="center" width="100%">
      {/* <Flex fontSize="8px">
        <pre>{JSON.stringify(players, null, 4)}</pre>
      </Flex> */}
      {players &&
        players.length > 0 &&
        players.map((player: any) => (
          <Flex
            minH="75px"
            mt="10px"
            p="10px"
            boxShadow="sm"
            width="100%"
            direction="column"
            alignItems="space-between"
            justifyContent="space-between"
            key={player.id}
            cursor="pointer"
            bgColor={player.color}
            onClick={() => navigate(`/player/${player.id}`)}
          >
            <Heading size="md">{player.name}</Heading>

            <Text fontSize="12px">Games: {player.results.length}</Text>
            <Text fontSize="12px">
              Wins:{" "}
              {player.results.filter((result: any) => result.is_winner).length}
            </Text>
          </Flex>
        ))}
    </Flex>
  );
};
export default MyPlayers;
