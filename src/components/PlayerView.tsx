import { Card, Flex, Heading, Tag, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabaseType from "../resources/types";

interface PlayerViewProps {
  supabase: supabaseType;
  user: any;
}

const PlayerView = ({ supabase, user }: PlayerViewProps) => {
  let { playerId } = useParams();
  const [results, setResults] = useState<any>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllResults = async () => {
      try {
        //get all results where player_id === playerId
        let { data: results } = await supabase
          .from("results")
          .select(
            "*, result_tags(*, tags(name)), players(name), sessions(*, games(name))"
          )
          .eq("player_id", playerId);
        setResults(results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllResults();
  }, [supabase, playerId]);

  return (
    <Flex direction="column" alignItems="center">
      {results && results.length > 0 ? (
        <Heading mb="20px">{results[0].players.name}'s Results</Heading>
      ) : (
        <Heading mb="20px">Player View</Heading>
      )}
      {/* {results && results.length > 0 && (
        <Flex margin="10px">{JSON.stringify(results, null, 4)}</Flex>
      )}
      <Text>
        (Result) ID, Session Id, Player Id, Points, isWinner, Created At,
        (Name), Profile Id, User_Id (owner), confirm_code
      </Text>
      <Text>result.players.name</Text>
      <Text>result.games.name</Text>
      <Text>
        result.sessions.id, game_id, date_played, created_at, user_id,
        is_finalized
      </Text>
      <Text>result.sessions.games.name</Text>
      <Text>result.result_tags[0].tags.name</Text> */}
      {results &&
        results.length > 0 &&
        results.map((result: any) => (
          <Card
            width="375px"
            key={result.id}
            p="10px"
            m="10px"
            cursor="pointer"
            onClick={() => navigate(`/session/${result.sessions.id}`)}
            bgColor={result.is_winner ? `yellow.100` : `blue.100`}
          >
            <Text>A game of {result.sessions.games.name.toUpperCase()}</Text>
            <Text>played on {result.sessions.date_played}</Text>
            <Text>{result.points ? `Score: ${result.points}` : ``}</Text>
            <Text>{result.is_winner ? `WINNER` : ``}</Text>
            <Text>
              {result.result_tags && result.result_tags.length > 0 && (
                <>
                  Tags:{" "}
                  {result.result_tags.map((result_tag: any) => (
                    <Tag key={result_tag.id}>{result_tag.tags.name}</Tag>
                  ))}
                </>
              )}
            </Text>
          </Card>
        ))}
      {results && results.length === 0 && (
        <Text>This player has no games yet.</Text>
      )}
    </Flex>
  );
};
export default PlayerView;
