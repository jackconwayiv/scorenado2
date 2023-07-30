import { Divider, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GiLaurelsTrophy } from "react-icons/gi";
import { LuDices } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import supabaseType from "../resources/types";

interface QuickStatsProps {
  supabase: supabaseType;
  user: any;
}

const QuickStats = ({ supabase, user }: QuickStatsProps) => {
  const navigate = useNavigate();
  const [totalVictories, setTotalVictories] = useState<number>(0);
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        let { data: results } = await supabase
          .from("results")
          .select("*, sessions (is_finalized)")
          .eq("profile_id", user.id);
        const fetchedFinalizedGames = results?.filter(
          (result) => result.sessions.is_finalized
        );
        const fetchedNumberOfGames = fetchedFinalizedGames?.length || 0;
        setGamesPlayed(fetchedNumberOfGames);
        const fetchedNumberOfVictories =
          fetchedFinalizedGames?.filter((result) => result.is_winner).length ||
          0;
        setTotalVictories(fetchedNumberOfVictories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchQuickStats();
  }, [supabase, user]);

  return (
    <>
      <Flex
        width="350px"
        m="10px"
        direction="row"
        justifyContent="space-between"
      >
        <Flex alignItems="center">
          <GiLaurelsTrophy />
          <Text ml="5px">Total Victories: {totalVictories}</Text>
        </Flex>
        <Flex alignItems="center">
          <LuDices /> <Text ml="5px">Games Played: {gamesPlayed}</Text>
        </Flex>
      </Flex>
      {/* <Button
        colorScheme="yellow"
        size="xs"
        onClick={() => {
          navigate("leaderboard");
        }}
      >
        Check the Leaderboards!
      </Button> */}
      <Divider m="10px" />
    </>
  );
};
export default QuickStats;
