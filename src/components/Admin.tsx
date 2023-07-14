import {
  Button,
  Flex,
  Heading,
  Input,
  List,
  ListItem,
  Select,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
interface AdminProps {
  supabase: any;
}
const Admin = ({ supabase }: AdminProps) => {
  const [games, setGames] = useState<any>([]);
  const [tags, setTags] = useState<any>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [gameName, setGameName] = useState<string | null>(null);
  const [tagName, setTagName] = useState<string | null>(null);

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
    const fetchAllTags = async () => {
      try {
        let { data: tags } = await supabase.from("tags").select("*");
        if (tags.length > 0) setTags(tags);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllGames();
    fetchAllTags();
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

  const handleAddTag = async (tagName: string, selectedGame: string) => {
    try {
      const { data } = await supabase
        .from("tags")
        .insert([{ name: tagName, game_id: selectedGame }])
        .select();
      const newTagsArray = [...tags];
      newTagsArray.push(data[0]);
      setTags(newTagsArray);
      setTagName(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex direction="column" alignItems="center">
      <Heading>Admin Panel</Heading>
      <Flex direction="row" justifyContent="space-between" mt="20px">
        <Flex direction="column" alignItems="center">
          <Heading size="lg">Tags</Heading>
          <List mt="15px">
            {tags &&
              tags.length > 0 &&
              tags
                .filter((tag: any) => tag.game_id === selectedGame)
                .map((tag: any) => (
                  <ListItem key={tag.id}>{tag.name}</ListItem>
                ))}
          </List>
        </Flex>
        <Flex direction="column" alignItems="center" ml="20px">
          <Text>For Game:</Text>
          <Select
            placeholder="Select game"
            onChange={(e) => setSelectedGame(e.target.value)}
          >
            {games &&
              games.length > 0 &&
              games.map((game: any) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
          </Select>
          <Text mt="10px">Add Tag:</Text>
          <Input
            value={tagName || ""}
            mt="10px"
            onChange={(e) => setTagName(e.target.value)}
          />
          <Button
            mt="10px"
            colorScheme="green"
            isDisabled={!tagName || !selectedGame}
            onClick={() => {
              tagName && selectedGame && handleAddTag(tagName, selectedGame);
            }}
          >
            Add Tag
          </Button>
        </Flex>
      </Flex>
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
          <Text>Add Game:</Text>
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
