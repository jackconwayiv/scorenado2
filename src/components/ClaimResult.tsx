import { Button, Flex, Heading, Tag, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabaseType from "../resources/types";

interface ClaimResultProps {
  user: any;
  supabase: supabaseType;
}
const ClaimResult = ({ user, supabase }: ClaimResultProps) => {
  const { resultId } = useParams();
  const [allResults, setAllResults] = useState<any>([]);
  const [usedProfileIds, setUsedProfileIds] = useState<any>([]);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchResultDetails = async () => {
      try {
        let { data: fetchedSessionId } = await supabase
          .from("results")
          .select("session_id, profile_id")
          .eq("id", resultId);
        //if this result already has a profile_id, redirect to home
        if (fetchedSessionId && fetchedSessionId[0].profile_id && !hasProfile) {
          setHasProfile(true);
          toast({
            title: "This score has already been claimed!",
            status: "error",
            duration: 10000,
            position: "top",
            isClosable: true,
          });
          navigate(`/`);
        }
        if (fetchedSessionId) {
          const sessionId = fetchedSessionId[0].session_id;
          let { data: allFetchedResults } = await supabase
            .from("results")
            .select(
              "*, result_tags(tags(name)), players(name), sessions(games(name), date_played, session_tags(tags(name)))"
            )
            .eq("session_id", sessionId);
          if (allFetchedResults && allFetchedResults.length > 0) {
            const usedProfIds = allFetchedResults.map(
              (result) => result.profile_id
            );
            setUsedProfileIds(usedProfIds);
            setAllResults(allFetchedResults);
            if (usedProfIds.indexOf(user.id) > -1) {
              //you have already claimed a score in this game
              setHasProfile(true);
              toast({
                title: "You've already claimed a score in this game!",
                status: "error",
                duration: 10000,
                position: "top",
                isClosable: true,
              });
              navigate(`/`);
            }
          }
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
    fetchResultDetails();
  }, [supabase, resultId, user]);

  const acceptScore = async () => {
    if (hasProfile) {
      return;
    } else {
      try {
        const { data: updatedResult } = await supabase
          .from("results")
          .update({ profile_id: user.id })
          .eq("id", resultId)
          .select();
        if (updatedResult) {
          toast({
            title: `Score accepted!`,
            status: "success",
            duration: 5000,
            position: "top",
            isClosable: true,
          });
        }
        navigate(`/`);
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
    }
  };

  return (
    <Flex direction="column" alignItems="center">
      {/* <Flex direction="column" fontSize="8px">
        {allResults.map((result: any, idx: number) => (
          <Card key={idx} padding="25px">
            <pre>{JSON.stringify(result, null, 4)}</pre>
          </Card>
        ))}
      </Flex> */}
      {/*<pre>{JSON.stringify(hasProfile, null, 4)}</pre> */}
      <Heading>Claim Result</Heading>
      <Text>You've been invited to claim a score.</Text>
      <Text>
        The game was{" "}
        {allResults &&
          allResults.length > 0 &&
          allResults[0].sessions.games.name}
        .
      </Text>
      <Text>
        You played on{" "}
        {allResults &&
          allResults.length > 0 &&
          allResults[0].sessions.date_played}
        .
      </Text>

      {allResults &&
        allResults.length > 0 &&
        allResults[0].sessions.session_tags.length > 0 && (
          <Flex alignItems="center" justifyContent="space-evenly">
            Game Tags:
            {allResults[0].sessions.session_tags.map(
              (session_tag: any, idx: number) => (
                <Tag key={idx} colorScheme={"teal"} m="5px">
                  {session_tag.tags.name}
                </Tag>
              )
            )}
          </Flex>
        )}

      <Flex direction="column">
        {allResults &&
          allResults.length > 0 &&
          allResults.map((result: any) => (
            <Flex
              key={result.id}
              width="375px"
              m="5px"
              mt="10px"
              p="5px"
              bgColor={result.id === resultId ? "yellow.200" : "gray.100"}
              border={
                result.id === resultId ? "1px black solid" : "1px gray solid"
              }
              direction="column"
              alignItems="center"
            >
              <Text color={result.id === resultId ? "black" : "gray"}>
                {result.players.name} earned {result.points} points
                {result.is_winner ? ` and won!` : "."}
              </Text>
              {result.result_tags && result.result_tags.length > 0 && (
                <Flex
                  direction="row"
                  alignItems="center"
                  color={result.id === resultId ? "black" : "gray"}
                >
                  Player Tags:{" "}
                  {result.result_tags.map((result_tag: any, idx: number) => (
                    <Tag
                      key={idx}
                      colorScheme={result.id === resultId ? "teal" : "blue"}
                      m="5px"
                    >
                      {result_tag.tags.name}
                    </Tag>
                  ))}
                </Flex>
              )}
            </Flex>
          ))}
      </Flex>
      <Flex
        mt="10px"
        mb="10px"
        direction="row"
        width="80%"
        justifyContent="space-between"
      >
        <Button
          isDisabled={hasProfile || usedProfileIds.indexOf(user.id) > -1}
          colorScheme="green"
          onClick={acceptScore}
        >
          Accept Score
        </Button>
        <Button colorScheme="red" onClick={() => navigate(`/`)}>
          Reject Score
        </Button>
      </Flex>
    </Flex>
  );
};
export default ClaimResult;
