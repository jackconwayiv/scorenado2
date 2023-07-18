import {
  Button,
  Divider,
  Flex,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabaseType from "../resources/types";
import AddPlayerModal from "./AddPlayerModal";
import PlayerDisplayBox from "./PlayerDisplayBox";

interface EditSessionProps {
  supabase: supabaseType;
  user: any;
}

const EditSession = ({ supabase, user }: EditSessionProps) => {
  let { sessionId } = useParams();
  const [session, setSession] = useState<any>({});
  const [playerCount, setPlayerCount] = useState<number>(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  //fetch all results with session_id equal to this session id, map them into player boxes.
  //player boxes should have a QR code that says "log in to confirm your score"
  //tag toggling happens inside the saved player box, at this level

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        let { data: sessions } = await supabase
          .from("sessions")
          .select("*, results(*), games(id, name)")
          .eq("id", sessionId);
        if (sessions) {
          const fetchedSession = sessions[0];
          setSession(fetchedSession);
          if (
            fetchedSession &&
            fetchedSession.results &&
            fetchedSession.results.length
          ) {
            const numberOfPlayers = fetchedSession.results.length;
            setPlayerCount(numberOfPlayers);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSessionDetails();
  }, [sessionId, supabase, session.results]);

  return (
    <Flex direction="column" alignItems="center">
      <Heading size="lg">Enter Scores</Heading>
      <Divider m="10px" />
      {session && session.games && (
        <>
          <Heading size="md" mt="10px">
            A game of {session.games.name}
          </Heading>
          <Heading size="sm">played on {session.date_played}</Heading>
          {/* <Flex>{JSON.stringify(session, null, 4)}</Flex> */}
          {session &&
            session.results &&
            session.results.length > 0 &&
            session.results.map((result: any) => (
              <PlayerDisplayBox
                key={result.id}
                result={result}
                gameId={session.games.id}
                supabase={supabase}
              />
            ))}
          <Button colorScheme="green" mt="10px" onClick={onOpen}>
            Add Player
          </Button>
          <Button colorScheme="orange" mt="10px" isDisabled={true}>
            Finalize Game
          </Button>
          <Button colorScheme="red" mt="10px" isDisabled={true}>
            Delete Session
          </Button>
          <AddPlayerModal
            isOpen={isOpen}
            onClose={onClose}
            supabase={supabase}
            sessionId={sessionId}
            playerCount={playerCount}
            setPlayerCount={setPlayerCount}
            user={user}
          />
        </>
      )}
    </Flex>
  );
};
export default EditSession;
