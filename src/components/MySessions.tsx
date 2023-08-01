import { CheckCircleIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Tag,
  Text,
  Wrap,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabaseType from "../resources/types";
import CreateSession from "./CreateSession";

interface MySessionsProps {
  supabase: supabaseType;
  user: any;
}

const MySessions = ({ supabase, user }: MySessionsProps) => {
  const [mySessions, setMySessions] = useState<any[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("firing use effect to grab sessions");
    const fetchMySessions = async () => {
      try {
        let { data: results } = await supabase
          .from("results")
          .select("*")
          .eq("profile_id", user.id);
        const arrayOfSessionIds = results?.map((result) => result.session_id);
        if (arrayOfSessionIds) {
          let { data: othersessions } = await supabase
            .from("sessions")
            .select(
              "*, games (name), results (players (name, color), profile_id)"
            )
            .in("id", [...arrayOfSessionIds])
            .order("date_played", { ascending: false });
          //use the player_players join table to grab all linked instances of "Player"
          if (othersessions) {
            setMySessions(othersessions);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    const fetchOtherSessions = async () => {
      try {
      } catch (error) {
        console.error(error);
      }
    };
    fetchMySessions();
    fetchOtherSessions();
  }, [supabase, user]);

  return (
    <Flex direction="column" alignItems="center" width="390px">
      <Button mb="10px" colorScheme="green" onClick={onOpen}>
        Add Game
      </Button>
      {/* <Flex>
        <pre>{JSON.stringify(mySessions[1], null, 4)}</pre>
      </Flex> */}
      <Wrap>
        {mySessions &&
          mySessions.length > 0 &&
          mySessions.map((session) => (
            <Card
              key={session.id}
              width="375px"
              padding="5px"
              margin="5px"
              bgColor={session.is_finalized ? `gray.100` : `gray.200`}
              cursor={
                session.user_id === user.id || session.is_finalized
                  ? "pointer"
                  : "default"
              }
              onClick={() => {
                if (session.user_id === user.id || session.is_finalized)
                  navigate(`/session/${session.id}`);
              }}
            >
              <Flex
                justifyContent="space-between"
                m="5px"
                alignItems="baseline"
              >
                {session.is_finalized ? (
                  <CheckCircleIcon />
                ) : (
                  <WarningTwoIcon />
                )}
                <Box fontSize="20px">{session.games.name.toUpperCase()}</Box>
                <Box fontSize="12px">{session.date_played}</Box>
              </Flex>
              <Divider color="gray.200" />
              <Flex justifyContent="space-evenly" m="5px">
                {/* may need to wrap here for 6+ players */}

                {session.results && session.results.length ? (
                  session.results
                    .sort(function (a: any, b: any) {
                      if (a.players.name < b.players.name) {
                        return -1;
                      }
                      if (a.players.name > b.players.name) {
                        return 1;
                      }
                      return 0;
                    })
                    .map((result: any, idx: number) => (
                      <Tag
                        key={idx}
                        bgColor={result.players.color}
                        fontSize="12px"
                      >
                        {result.players.name}
                      </Tag>
                    ))
                ) : (
                  <Box fontSize="12px">No players yet</Box>
                )}
              </Flex>
            </Card>
          ))}
        {!mySessions || mySessions.length === 0 ? (
          <Text>No games yet!</Text>
        ) : (
          ``
        )}
      </Wrap>
      <CreateSession
        supabase={supabase}
        user={user}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Flex>
  );
};
export default MySessions;
