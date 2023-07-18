import { Box, Card, Divider, Flex, Wrap } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabaseType from "../resources/types";

interface MySessionsProps {
  supabase: supabaseType;
  user: any;
}

const MySessions = ({ supabase, user }: MySessionsProps) => {
  const [mySessions, setMySessions] = useState<any[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("firing use effect to grab sessions");
    const fetchMySessions = async () => {
      try {
        let { data: sessions } = await supabase
          .from("sessions")
          .select("*, games (name), results (name)")
          .eq("user_id", user.id);
        if (sessions) setMySessions(sessions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMySessions();
  }, [supabase, user]);

  return (
    <Flex direction="column" alignItems="center" width="400px">
      <Wrap>
        {mySessions &&
          mySessions.length > 0 &&
          mySessions.map((session) => (
            <Card
              key={session.id}
              width="100%"
              padding="5px"
              margin="5px"
              bgColor={session.is_finalized ? `green.100` : `purple.100`}
              cursor="pointer"
              onClick={() => navigate(`/session/${session.id}`)}
            >
              <Flex
                justifyContent="space-between"
                m="5px"
                alignItems="baseline"
              >
                {!session.is_finalized && <Box fontSize="12px">unsaved </Box>}
                <Box fontSize="20px">{session.games.name.toUpperCase()}</Box>
                <Box fontSize="12px">{session.date_played}</Box>
              </Flex>
              <Divider color="gray.200" />
              <Flex justifyContent="space-evenly" m="5px">
                {/* may need to wrap here for 6+ players */}

                {session.results && session.results.length ? (
                  session.results.map((result: any, idx: number) => (
                    <Box key={idx} fontSize="12px">
                      {result.name}
                    </Box>
                  ))
                ) : (
                  <Box fontSize="12px">No players yet</Box>
                )}
              </Flex>
            </Card>
          ))}
      </Wrap>
    </Flex>
  );
};
export default MySessions;
