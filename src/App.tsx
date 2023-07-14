import {
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import "./App.css";
import Admin from "./components/Admin";
import InputForm from "./components/InputForm";
import MyProfile from "./components/MyProfile";
import Scores from "./components/Scores";

const supabase = createClient(
  `https://zbmqjerscayutssmwkmm.supabase.co`,
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibXFqZXJzY2F5dXRzc213a21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM2NDc3NzAsImV4cCI6MTk5OTIyMzc3MH0.GAC_0ezrcWgIMlJKCm99UjChJpledSM1KKXCRLBqlPw`
);

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return (
      <Flex direction="column" justifyContent="center" alignItems="center">
        <Heading size="4xl">Scorenado</Heading>
        <Flex width="400px" mt="20px" justifyContent="center">
          <Tabs
            size="sm"
            align="center"
            width="400px"
            variant="solid-rounded"
            colorScheme="purple"
          >
            <TabList mb="1em">
              <Tab width="90px">Input</Tab>
              <Tab width="90px">Profile</Tab>
              <Tab width="90px">Scores</Tab>
              <Tab width="90px">Admin</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <InputForm supabase={supabase} />
              </TabPanel>
              <TabPanel>
                <MyProfile supabase={supabase} />
              </TabPanel>
              <TabPanel>
                <Scores />
              </TabPanel>
              <TabPanel>
                <Admin supabase={supabase} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Flex>
    );
  }
}
export default App;
