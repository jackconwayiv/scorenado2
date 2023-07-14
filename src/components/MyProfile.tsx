import { Avatar, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ImExit } from "react-icons/im";
interface MyProfileProps {
  supabase: any;
}
const MyProfile = ({ supabase }: MyProfileProps) => {
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    console.log("firing profile useeffect");
    const fetchUser = async () => {
      try {
        const { data} = await supabase.auth.getSession();
        const fetchedUser = data.session.user;
        setUser(fetchedUser);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [supabase.auth]);

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
  };

  return (
    <Flex direction="column" alignItems="center">
      <Heading mt="5px">My Profile</Heading>
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
