import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Card, Flex, Heading, useToast } from "@chakra-ui/react";
import supabaseType from "../resources/types";
import TagInputRow from "./TagInputRow";

interface PlayerDisplayBoxProps {
  result: any;
  supabase: supabaseType;
  gameId: string;
}

const PlayerDisplayBox = ({
  result,
  supabase,
  gameId,
}: PlayerDisplayBoxProps) => {
  //gameId, resultId, and supabase needed for tag input row
  const toast = useToast();
  const handleDelete = async () => {
    try {
      await supabase.from("results").delete().eq("id", result.id);
      toast({
        title: `${result.name} was successfully deleted!`,
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
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
    <Flex margin="5px" mt="10px" direction="column" width="390px">
      <Card
        padding="10px"
        bgColor={result.is_winner ? `yellow.100` : `blue.100`}
      >
        <Flex direction="column">
          {/* <Text>Avatar or 6-digit confirm code</Text> */}
          <Flex direction="row" justifyContent="space-between">
            <Heading size="md">{result.name}</Heading>
            <Box>{result.is_winner ? "WINNER" : " "}</Box>
            <Box>{result.points} points</Box>
          </Flex>
          {/* <Box fontSize="8px">
            {result.id} is the ID, which will be the param on the confirm score
            QR code route{" "}
          </Box> */}
          <TagInputRow
            resultId={result.id}
            gameId={gameId}
            supabase={supabase}
          />
          <Button
            size="xs"
            width="20px"
            mt="5px"
            colorScheme="red"
            alignSelf="end"
            onClick={handleDelete}
          >
            <DeleteIcon />
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};
export default PlayerDisplayBox;
