import { Card, Flex, Heading, Text, Wrap } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabaseType from "../resources/types";
import InputForm from "./InputForm";

interface LandingPageProps {
  supabase: supabaseType;
  user: any;
}

const LandingPage = ({ supabase, user }: LandingPageProps) => {
  const [mySessions, setMySessions] = useState<any[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
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
  }, []);

  return (
    <Flex direction="column" alignItems="center">
      <Heading mt="10px">Welcome user!</Heading>
      <Flex mt="5px">Here's your quick stats.</Flex>
      <InputForm supabase={supabase} user={user} />
      <Heading size="md" mt="10px">
        My Game Sessions
      </Heading>
      <Wrap>
        {mySessions &&
          mySessions.length > 0 &&
          mySessions.map((session) => (
            <Card
              width="175px"
              bgColor={session.is_finalized ? `green.100` : `purple.100`}
              padding="10px"
              margin="10px"
              cursor="pointer"
              key={session.id}
              textAlign="center"
              onClick={() => navigate(`/session/${session.id}`)}
            >
              <Text fontSize="12px">{session.date_played}</Text>{" "}
              <Text fontSize="20px">{session.games.name.toUpperCase()}</Text>
              <Text mb="10px" fontSize="12px">
                ({session.is_finalized ? `finalized` : `draft`})
              </Text>
              {session.results && session.results.length ? (
                session.results.map((result: any, idx: number) => (
                  <Text fontSize="12px" key={idx}>
                    {result.name}
                  </Text>
                ))
              ) : (
                <Text fontSize="12px">No players yet</Text>
              )}
            </Card>
          ))}
      </Wrap>
    </Flex>
  );
};
export default LandingPage;
