import {
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import supabaseType from "../resources/types";
import CreateSession from "./CreateSession";
import MySessions from "./MySessions";
import QuickStats from "./QuickStats";

interface LandingPageProps {
  supabase: supabaseType;
  user: any;
}

const LandingPage = ({ supabase, user }: LandingPageProps) => {
  return (
    <Flex direction="column" alignItems="center">
      <Heading mt="10px" size="lg">
        Welcome {user.user_metadata.name}!
      </Heading>
      <QuickStats supabase={supabase} user={user} />
      <Tabs
        variant="soft-rounded"
        colorScheme="purple"
        align="center"
        mt="10px"
        width="400px"
        isLazy
      >
        <TabList>
          <Tab>Add Game</Tab>
          <Tab>My Games</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CreateSession supabase={supabase} user={user} />
          </TabPanel>
          <TabPanel>
            <MySessions supabase={supabase} user={user} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
export default LandingPage;
