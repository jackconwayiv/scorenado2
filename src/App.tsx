import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import "./App.css";
import InputForm from "./components/InputForm";

function App() {
  return (
    <Flex justifyContent="center">
      <Flex width="420px" mt="20px">
        <Tabs
          isFitted
          width="420px"
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
      </Flex>
    </Flex>
  );
}

export default App;
