import { QuestionOutlineIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tag,
  TagCloseButton,
  TagLabel,
  TagLeftIcon,
  Text,
  Wrap,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiFillTag } from "react-icons/ai";
import supabaseType from "../resources/types";

interface SessionTagRowProps {
  user: any;
  supabase: supabaseType;
  finalized: boolean;
  gameId: string;
  sessionId: string;
}

const SessionTagRow = ({
  user,
  supabase,
  finalized,
  gameId,
  sessionId,
}: SessionTagRowProps) => {
  const [newTagName, setNewTagName] = useState<string | null>(null);
  const [appliedTags, setAppliedTags] = useState<any>([]);
  const [tagOptions, setTagOptions] = useState<any>([]);
  const [arrayOfAppliedTagIDs, setArrayOfAppliedTagIDs] = useState<number[]>(
    []
  );
  const toast = useToast();

  useEffect(() => {
    //could fetch this at parent level and push the filtered versions down to the children
    console.log("firing session tags useEffect");
    const fetchTagsForGame = async () => {
      try {
        let { data: fetchedTags } = await supabase
          .from("tags")
          .select("*")
          .eq("is_session_tag", true)
          .eq("game_id", gameId)
          .eq("user_id", user.id);
        setTagOptions(fetchedTags);
      } catch (error) {
        console.error(error);
      }
    };
    if (gameId !== null) {
      fetchTagsForGame();
    }
    const fetchTagsForSession = async () => {
      try {
        let { data: session_tags } = await supabase
          .from("session_tags")
          .select("*, tags (*)")
          .eq("session_id", sessionId);
        const fetchedAppliedTags = session_tags?.map(
          (session_tag: any) => session_tag.tags
        );
        setAppliedTags(fetchedAppliedTags);
      } catch (error) {
        console.error(error);
      }
    };
    if (sessionId !== null) {
      fetchTagsForSession();
    }
  }, [gameId, sessionId, supabase, user]);

  const removeTagFromSession = async (tagIdToRemove: number) => {
    try {
      await supabase
        .from("session_tags")
        .delete()
        .eq("session_id", sessionId)
        .eq("tag_id", tagIdToRemove);
      const newAppliedTags = appliedTags.filter(
        (tag: any) => tag.id !== tagIdToRemove
      );
      setAppliedTags(newAppliedTags);
      const newArrayOfAppliedTagIDs = newAppliedTags.map((tag: any) => tag.id);
      setArrayOfAppliedTagIDs(newArrayOfAppliedTagIDs);
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

  const saveTag = async (tagNameToQuery: string) => {
    if (tagNameToQuery.length < 1) {
      return;
    }
    try {
      let tagToSave;
      let { data: fetchedTag } = await supabase
        .from("tags")
        .select("*")
        .eq("name", tagNameToQuery)
        .eq("game_id", gameId)
        .eq("is_session_tag", true)
        .limit(1);
      if (fetchedTag && fetchedTag.length === 0) {
        const { data: createdTag } = await supabase
          .from("tags")
          .insert([
            {
              name: tagNameToQuery,
              game_id: gameId,
              user_id: user.id,
              is_session_tag: true,
            },
          ])
          .select();
        if (createdTag && createdTag.length > 0) tagToSave = createdTag[0];
        const newTagOptions = [...tagOptions, tagToSave];
        setTagOptions(newTagOptions);
      } else {
        if (fetchedTag && fetchedTag.length > 0) tagToSave = fetchedTag[0];
      }
      await supabase
        .from("session_tags")
        .insert([{ session_id: sessionId, tag_id: tagToSave.id }])
        .select();
      const newArrayOfTags = [...appliedTags, tagToSave];
      setAppliedTags(newArrayOfTags);
      const newArrayOfAppliedTagIDs = newArrayOfTags.map((tag: any) => tag.id);
      setArrayOfAppliedTagIDs(newArrayOfAppliedTagIDs);
      setNewTagName(null);
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
    <Flex direction="column" mt="10px" width="370px">
      <Wrap>
        {appliedTags.length > 0 &&
          appliedTags.map((mappedTag: any, idx: number) => {
            return (
              <Tag
                size="sm"
                borderRadius="full"
                variant="solid"
                colorScheme="teal"
                key={idx}
              >
                <TagLeftIcon boxSize="12px" as={AiFillTag} />
                <TagLabel>{mappedTag.name}</TagLabel>
                <TagCloseButton
                  onClick={() => removeTagFromSession(mappedTag.id)}
                />
              </Tag>
            );
          })}
      </Wrap>
      {!finalized && (
        <Flex direction="column" justifyContent="center" mt="5px">
          <Flex alignItems="center" mb="5px">
            <Text fontSize="12px">Game Tags:</Text>

            <Popover>
              <PopoverTrigger>
                <QuestionOutlineIcon cursor="help" ml="5px" />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>What are TAGS?</PopoverHeader>
                <PopoverBody>
                  You can tag a game session with words or short phrases, such
                  as "learning game" or "hard mode".
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
          <InputGroup mr="10px">
            <InputLeftElement
              pointerEvents="none"
              color="gray.400"
              fontSize=".5em"
            >
              Tag
            </InputLeftElement>
            <Input
              value={newTagName || ""}
              bgColor="white"
              size="md"
              onChange={(e) => {
                if (e.target.value.length < 31) setNewTagName(e.target.value);
              }}
            />
            <InputRightElement>
              <Button
                isDisabled={!newTagName}
                size="xs"
                onClick={() => newTagName && saveTag(newTagName)}
              >
                +
              </Button>
            </InputRightElement>
          </InputGroup>
        </Flex>
      )}
      {!finalized && (
        <Flex mt="5px" justifyContent="center">
          <Wrap>
            {tagOptions.length > 0 &&
              tagOptions
                .filter(
                  (tagObject: any) =>
                    arrayOfAppliedTagIDs.indexOf(tagObject.id) === -1
                )
                .map((availableTag: any, idx: number) => {
                  return (
                    <Tag
                      size="sm"
                      key={idx}
                      variant="subtle"
                      colorScheme="gray"
                      cursor="pointer"
                      onClick={() => saveTag(availableTag.name)}
                    >
                      {" "}
                      <TagLeftIcon boxSize="12px" as={SmallAddIcon} />
                      <TagLabel>{availableTag.name}</TagLabel>
                    </Tag>
                  );
                })}
          </Wrap>
        </Flex>
      )}
    </Flex>
  );
};
export default SessionTagRow;
