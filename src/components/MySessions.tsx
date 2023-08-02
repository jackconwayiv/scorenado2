import { WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
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
          let { data: ownedSessions } = await supabase
            .from("sessions")
            .select("*")
            .eq("user_id", user.id);
          if (ownedSessions) {
            const unfinishedSessions = ownedSessions.filter(
              (session) => arrayOfSessionIds.indexOf(session.id) === -1
            );
            unfinishedSessions.forEach((session) =>
              arrayOfSessionIds.push(session.id)
            );
            let { data: othersessions } = await supabase
              .from("sessions")
              .select(
                "*, games (name), results (players (name, color), profile_id)"
              )
              .in("id", arrayOfSessionIds)
              .order("date_played", { ascending: false })
              .order("is_finalized", { ascending: true });
            if (othersessions) {
              setMySessions(othersessions);
            }
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
    <Flex direction="column" alignItems="center" width="100%">
      <Button mb="10px" colorScheme="green" onClick={onOpen}>
        Add Game
      </Button>
      {/* <Flex>
        <pre>{JSON.stringify(mySessions[2], null, 4)}</pre>
      </Flex> */}
      {mySessions &&
        mySessions.length > 0 &&
        mySessions.map((session) => (
          <Flex
            key={session.id}
            padding="5px"
            mt="5px"
            minH="75px"
            direction="column"
            justifyContent="space-between"
            width="100%"
            border={session.is_finalized ? "0" : "1px gray dashed"}
            bgColor={session.is_finalized ? `gray.100` : `white`}
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
            <Flex justifyContent="space-between" m="5px" alignItems="center">
              <Flex alignItems="center" justifyContent="space-between">
                {!session.is_finalized && (
                  <Text color="red" mr="10px">
                    <WarningTwoIcon />
                  </Text>
                )}
                <Heading size="xs">{session.games.name.toUpperCase()}</Heading>
              </Flex>
              <Box fontSize="12px">{session.date_played}</Box>
            </Flex>
            {/* <Flex justifyContent="space-evenly" m="5px"> */}
            <Wrap>
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
                      m="5px"
                    >
                      {!result.profile_id && `'`}
                      {result.players.name}
                      {!result.profile_id && `'`}
                    </Tag>
                  ))
              ) : (
                <Box fontSize="12px">No players yet</Box>
              )}
            </Wrap>
          </Flex>
        ))}
      {!mySessions || mySessions.length === 0 ? <Text>No games yet!</Text> : ``}
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
