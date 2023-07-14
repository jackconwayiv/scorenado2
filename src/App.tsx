import {
  Button,
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
import { ImExit } from "react-icons/im";
import "./App.css";
import InputForm from "./components/InputForm";

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

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
  };

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return (
      <Flex direction="column" justifyContent="center" alignItems="center">
        <Heading size="4xl">Scorenado</Heading>
        <Flex width="400px" mt="20px" justifyContent="center">
          <Tabs
            isFitted
            width="400px"
            variant="solid-rounded"
            colorScheme="purple"
          >
            <TabList mb="1em">
              <Tab>Input</Tab>
              <Tab>Profile</Tab>
              <Tab>Scores</Tab>
              <Tab>Calendar</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <InputForm />
              </TabPanel>
              <TabPanel>
                <p>profile!</p>
              </TabPanel>
              <TabPanel>
                <p>data!</p>
              </TabPanel>
              <TabPanel>
                <p>calendar!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Button padding="0" onClick={handleLogOut}>
            <ImExit />
          </Button>
        </Flex>
      </Flex>
    );
  }
}
export default App;
