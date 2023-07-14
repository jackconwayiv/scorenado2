import {
  Button,
  Flex,
  Heading,
  Input,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
interface AdminProps {
  supabase: any;
}
const Admin = ({ supabase }: AdminProps) => {
  const [games, setGames] = useState<any>([]);
  const [gameName, setGameName] = useState<string | null>(null);

  useEffect(() => {
    console.log("firing admin useeffect");
    const fetchAllGames = async () => {
      try {
        let { data: games } = await supabase.from("games").select("*");
        if (games.length > 0) setGames(games);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllGames();
  }, [supabase]);

  const handleAddGame = async (gameName: string) => {
    try {
      const { data } = await supabase
        .from("games")
        .insert([{ name: gameName }])
        .select();
      const newGamesArray = [...games];
      newGamesArray.push(data[0]);
      setGames(newGamesArray);
      setGameName(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex direction="column" alignItems="center">
      <Heading>Admin Panel</Heading>
      <Flex direction="row" justifyContent="space-between" mt="20px">
        <Flex direction="column" alignItems="center">
          <Heading size="lg">Games</Heading>
          <List mt="15px">
            {games &&
              games.length > 0 &&
              games.map((game: any) => (
                <ListItem key={game.id}>{game.name}</ListItem>
              ))}
          </List>
        </Flex>
        <Flex direction="column" alignItems="center" ml="20px">
          <Text>Game Name:</Text>
          <Input
            value={gameName || ""}
            mt="10px"
            onChange={(e) => setGameName(e.target.value)}
          />
          <Button
            mt="10px"
            colorScheme="green"
            isDisabled={!gameName}
            onClick={() => {
              gameName && handleAddGame(gameName);
            }}
          >
            Add Game
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Admin;
