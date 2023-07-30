import { Card, Flex, Heading, Wrap } from "@chakra-ui/react";
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
    //refactor to have a separate place where all api calls are stored
    //then supabase and user don't have to be pushed down all the way
    //they can be pushed into that component and the result of the call
    //can be returned to each component
    const fetchMyPlayers = async () => {
      try {
        //fetch all my players
        let { data: fetchedPlayers } = await supabase
          .from("players")
          .select("*")
          .eq("user_id", user.id);
        setPlayers(fetchedPlayers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMyPlayers();
  }, [supabase, user]);

  return (
    <Flex direction="column" alignItems="center">
      <Wrap>
        {players &&
          players.length > 0 &&
          players.map((player: any) => (
            <Card
              width="115px"
              height="50px"
              alignItems="center"
              justifyContent="center"
              key={player.id}
              cursor="pointer"
              bgColor={player.color}
              onClick={() => navigate(`/players/${player.id}`)}
            >
              <Heading size="sm">{player.name}</Heading>
            </Card>
          ))}
      </Wrap>
    </Flex>
  );
};
export default MyPlayers;
