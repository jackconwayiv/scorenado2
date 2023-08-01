import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Heading,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabaseType from "../resources/types";
import AddPlayerModal from "./AddPlayerModal";
import PlayerDisplayBox from "./PlayerDisplayBox";
import SessionTagRow from "./SessionTagRow";

interface EditSessionProps {
  supabase: supabaseType;
  user: any;
}

//does playerCount or numberOfPlayers matter here?

//if there are 0 players in the game, automatically open the add player modal

const EditSession = ({ supabase, user }: EditSessionProps) => {
  let { sessionId } = useParams();
  const [session, setSession] = useState<any>({});
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [myPlayers, setMyPlayers] = useState<any>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();
  const confirmRef = useRef<HTMLButtonElement>(null);

  //fetch all results with session_id equal to this session id, map them into player boxes.
  //player boxes should have a QR code that says "log in to confirm your score"
  //tag toggling happens inside the saved player box, at this level

  //ultimately you'll grab all results for games you own, then grab the five most common player ids, then grab those by name
  //for now, just grab all player rows you own
  useEffect(() => {
    console.log("fetching my players");
    const fetchMyPlayers = async () => {
      try {
        let { data: myFetchedPlayers } = await supabase
          .from("players")
          .select("*")
          .eq("user_id", user.id);
        setMyPlayers(myFetchedPlayers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMyPlayers();
  }, [supabase, user]);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        let { data: sessions } = await supabase
          .from("sessions")
          .select("*, results(*, players(name)), games(id, name)")
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

  const handleDelete = async () => {
    try {
      const { data: deletedSession } = await supabase
        .from("sessions")
        .delete()
        .eq("id", sessionId)
        .select();
      if (deletedSession) {
        onAlertClose();
        navigate(`/`);
        toast({
          title: `Game session was successfully deleted!`,
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

  const handleFinalize = async () => {
    try {
      const { data: updatedSession } = await supabase
        .from("sessions")
        .update({ is_finalized: true })
        .eq("id", sessionId)
        .select();
      if (updatedSession) {
        onConfirmClose();
        navigate(`/`);
        toast({
          title: `Game session was successfully finalized!`,
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
    <Flex direction="column" alignItems="center">
      {session && session.games && (
        <>
          <Flex
            direction="column"
            alignItems="center"
            bgColor="teal.900"
            color="white"
            width="390px"
            padding="10px"
          >
            {!session.is_finalized && (
              <Heading size="sm">Enter scores for</Heading>
            )}
            <Heading size="md">A game of {session.games.name}</Heading>
            <Heading size="sm">played on {session.date_played}</Heading>
            {/* <Flex>{JSON.stringify(session, null, 4)}</Flex> */}
          </Flex>
          <SessionTagRow
            user={user}
            supabase={supabase}
            finalized={session.is_finalized}
            gameId={session.game_id}
            sessionId={session.id}
          />
          {!session.is_finalized && (
            <Flex
              direction="row"
              justifyContent="center"
              width="375px"
              mt="10px"
            >
              <Button
                colorScheme="blue"
                isDisabled={session.is_finalized}
                onClick={onOpen}
              >
                + Add Player
              </Button>
            </Flex>
          )}
          <AddPlayerModal
            isOpen={isOpen}
            onClose={onClose}
            supabase={supabase}
            sessionId={sessionId}
            playerCount={playerCount}
            setPlayerCount={setPlayerCount}
            myPlayers={myPlayers}
            setMyPlayers={setMyPlayers}
            user={user}
          />
          {session &&
            session.results &&
            session.results.length > 0 &&
            session.results.map((result: any) => (
              <PlayerDisplayBox
                key={result.id}
                result={result}
                gameId={session.games.id}
                finalized={session.is_finalized}
                supabase={supabase}
                user={user}
                playerCount={playerCount}
                setPlayerCount={setPlayerCount}
              />
            ))}
          {session && session.results && session.results.length === 0 && (
            <Heading size="md" mt="20px">
              No scores yet!
            </Heading>
          )}
        </>
      )}
      {!session.is_finalized && (
        <Flex
          direction="row"
          justifyContent="space-between"
          width="375px"
          mt="10px"
          mb="10px"
        >
          <Button
            colorScheme="green"
            isDisabled={playerCount < 1 || session.is_finalized}
            onClick={onConfirmOpen}
          >
            Save Game
          </Button>
          <Button
            colorScheme="red"
            isDisabled={session.is_finalized}
            onClick={onAlertOpen}
          >
            Delete Session
          </Button>
        </Flex>
      )}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Session
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? All scores and tags will also be deleted. This
              action can't be undone!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog
        isOpen={isConfirmOpen}
        leastDestructiveRef={confirmRef}
        onClose={onConfirmClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Finalize Session
            </AlertDialogHeader>

            <AlertDialogBody>
              Once a session is finalized, it cannot be edited! You can leave a
              session unsaved if you think you will need to edit it later.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={confirmRef} onClick={onConfirmClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={handleFinalize} ml={3}>
                Finalize
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};
export default EditSession;
