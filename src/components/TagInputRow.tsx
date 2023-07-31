import { SmallAddIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
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
interface TagInputRowProps {
  resultId: string | null;
  gameId: string | null;
  supabase: supabaseType;
  user: any;
  finalized: boolean;
}

const TagInputRow = ({
  resultId,
  gameId,
  supabase,
  user,
  finalized,
}: TagInputRowProps) => {
  const [newTagName, setNewTagName] = useState<string | null>(null);
  const [appliedTags, setAppliedTags] = useState<any>([]);
  const [tagOptions, setTagOptions] = useState<any>([]);
  const [arrayOfAppliedTagIDs, setArrayOfAppliedTagIDs] = useState<number[]>(
    []
  );
  const toast = useToast();
  useEffect(() => {
    console.log("firing tags useEffect");
    const fetchTagsForGame = async () => {
      try {
        let { data: fetchedTags } = await supabase
          .from("tags")
          .select("*")
          .eq("is_session_tag", false)
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
    const fetchTagsForPlayer = async () => {
      try {
        let { data: result_tags } = await supabase
          .from("result_tags")
          .select("*, tags (*)")
          .eq("result_id", resultId);
        const fetchedAppliedTags = result_tags?.map(
          (result_tag: any) => result_tag.tags
        );
        setAppliedTags(fetchedAppliedTags);
      } catch (error) {
        console.error(error);
      }
    };
    if (resultId !== null) {
      fetchTagsForPlayer();
    }
  }, [gameId, resultId, supabase, user]);

  const removeTagFromResult = async (tagIdToRemove: number) => {
    try {
      await supabase
        .from("result_tags")
        .delete()
        // .select()
        .eq("result_id", resultId)
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
        .limit(1);
      if (fetchedTag && fetchedTag.length === 0) {
        const { data: createdTag } = await supabase
          .from("tags")
          .insert([{ name: tagNameToQuery, game_id: gameId }])
          .select();
        if (createdTag && createdTag.length > 0) tagToSave = createdTag[0];
        const newTagOptions = [...tagOptions, tagToSave];
        setTagOptions(newTagOptions);
      } else {
        if (fetchedTag && fetchedTag.length > 0) tagToSave = fetchedTag[0];
      }
      await supabase
        .from("result_tags")
        .insert([{ result_id: resultId, tag_id: tagToSave.id }])
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
    <Flex direction="column">
      <Wrap>
        {appliedTags.length > 0 &&
          appliedTags.map((mappedTag: any, idx: number) => {
            return (
              <Tag
                size="sm"
                borderRadius="full"
                variant="solid"
                colorScheme="green"
                key={idx}
              >
                <TagLeftIcon boxSize="12px" as={AiFillTag} />
                <TagLabel>{mappedTag.name}</TagLabel>
                <TagCloseButton
                  onClick={() => removeTagFromResult(mappedTag.id)}
                />
              </Tag>
            );
          })}
      </Wrap>
      {!finalized && (
        <Flex direction="column" justifyContent="center" mt="5px">
          <Text fontSize="12px">Add optional tags:</Text>
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
export default TagInputRow;
