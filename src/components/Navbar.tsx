import { Flex, Heading, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <Flex width="405px" direction="column" alignItems="center">
      <Heading onClick={() => navigate(`/`)} size="4xl">
        Scorenado
      </Heading>
      <Flex direction="row" justifyContent="space-around" width="400px">
        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList>
            <Tab onClick={() => navigate(`/`)}>Welcome</Tab>
            <Tab onClick={() => navigate(`/profile`)}>Profile</Tab>
            <Tab onClick={() => navigate(`/leaderboard`)}>Leaderboards</Tab>
          </TabList>
        </Tabs>
      </Flex>
    </Flex>
  );
};
export default Navbar;
