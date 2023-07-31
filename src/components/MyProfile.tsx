import { Avatar, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { ImExit } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import supabaseType from "../resources/types";
interface MyProfileProps {
  supabase: supabaseType;
  user: any;
}
const MyProfile = ({ supabase, user }: MyProfileProps) => {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    navigate("/");
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
  };

  return (
    <Flex direction="column" alignItems="center">
      <Heading mt="5px" size="lg">
        Settings
      </Heading>
      <Flex direction="column" alignItems="center" mt="20px">
        {user && user.id && (
          <Flex direction="column" alignItems="center" mt="5px">
            <Avatar
              name={user.identities[0].identity_data.full_name}
              src={user.identities[0].identity_data.avatar_url}
              referrerPolicy="no-referrer"
            />
            <Text mt="5px">{user.email}</Text>
          </Flex>
        )}
        <Button
          padding="0"
          mt="30px"
          width="120px"
          colorScheme="red"
          onClick={handleLogOut}
        >
          <ImExit /> Log Out
        </Button>
      </Flex>
    </Flex>
  );
};
export default MyProfile;
