import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface ScoresProps {
  supabase: any;
}

const Scores = ({ supabase }: ScoresProps) => {
  const [sessions, setSessions] = useState<any>([]);

  useEffect(() => {
    console.log("firing scores useeffect");
    //there is redundant data here; write custom endpoints if supabase allows
    const fetchSessions = async () => {
      try {
        const { data } = await supabase.from("results").select(`
      points, is_winner,
      players (name),
      sessions (games (name))
    `);
        if (data) {
          setSessions(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSessions();
  }, [supabase]);

  return (
    <Flex direction="column" alignItems="center">
      <Heading>Scores and Calendar</Heading>
      {sessions &&
        sessions.length > 0 &&
        sessions.map((session: any, idx: number) => (
          <Flex key={idx}>{JSON.stringify(session, null, 4)}</Flex>
        ))}
    </Flex>
  );
};
export default Scores;
