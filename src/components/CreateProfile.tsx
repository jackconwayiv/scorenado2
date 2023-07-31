import { Button, Flex, Heading, Input, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabaseType from "../resources/types";

interface CreateProfileProps {
  supabase: supabaseType;
  user: any;
  setHasProfile: any;
}

const CreateProfile = ({
  supabase,
  user,
  setHasProfile,
}: CreateProfileProps) => {
  const [playerName, setPlayerName] = useState<string | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  const handleJoin = async () => {
    //refactor this to use upsert
    try {
      //check if that player name already exists with user.id as user_id
      let { data: existingPlayer } = await supabase
        .from("players")
        .select("*")
        .eq("user_id", user.id);
      if (!existingPlayer || existingPlayer.length < 1) {
        //if not, write a new player object with user.id as user_id and also as profile_id
        const { data: newPlayer } = await supabase
          .from("players")
          .insert([{ name: playerName, user_id: user.id, profile_id: user.id }])
          .select();
      } else {
        //if so, edit it to profile_id === user.id
        const { data: updatedPlayer } = await supabase
          .from("players")
          .update({ profile_id: user.id })
          .eq("name", playerName)
          .eq("user_id", user.id)
          .select();
      }
      //also add playerName as username on profile table
      await supabase
        .from("profiles")
        .update({ username: playerName })
        .eq("id", user.id)
        .select();
      toast({
        title: `Welcome to Scorenado, ${playerName}!`,
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      setHasProfile(true);
      navigate(`/`);
      //navigate back to "/" and force refresh if necessary... OR navigate to settings
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
      <Heading mb="10px">Create Profile</Heading>
      What's your name?
      <Input
        value={playerName || ""}
        onChange={(e) => {
          setPlayerName(e.target.value);
        }}
      ></Input>
      <Button
        mt="10px"
        colorScheme="teal"
        isDisabled={!playerName}
        onClick={handleJoin}
      >
        Join Scorenado
      </Button>
    </Flex>
  );
};
export default CreateProfile;
