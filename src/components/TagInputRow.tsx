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
  Wrap,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiFillTag, AiOutlineTag } from "react-icons/ai";
interface TagInputRowProps {
  resultId: string | null;
  gameId: string | null;
  supabase: any;
}

const TagInputRow = ({ resultId, gameId, supabase }: TagInputRowProps) => {
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
          .eq("game_id", gameId);
        setTagOptions(fetchedTags);
      } catch (error) {
        console.error(error);
      }
    };
    if (gameId !== null) {
      fetchTagsForGame();
    }
  }, [gameId, supabase]);

  const removeTagFromResult = async (tagIdToRemove: number) => {
    try {
      await supabase
        .from("result_tags")
        .delete()
        .select()
        .match({ result_id: resultId, tag_id: tagIdToRemove });
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
      let tagToSave = { id: null };
      let { data: fetchedTag } = await supabase
        .from("tags")
        .select("*")
        .eq("name", tagNameToQuery)
        .limit(1);
      if (fetchedTag.length === 0) {
        const { data: createdTag } = await supabase
          .from("tags")
          .insert([{ name: tagNameToQuery, game_id: gameId }])
          .select();
        tagToSave = createdTag[0];
      } else {
        tagToSave = fetchedTag[0];
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
      <Flex justifyContent="center" mt="5px">
        <InputGroup mr="10px">
          <InputLeftElement
            pointerEvents="none"
            color="gray.400"
            fontSize=".5em"
          >
            Tags
          </InputLeftElement>
          <Input
            value={newTagName || ""}
            bgColor="white"
            size="md"
            onChange={(e) => {
              if (e.target.value.length < 31) setNewTagName(e.target.value);
            }}
            onBlur={(e) => saveTag(e.target.value)}
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
                    <TagLeftIcon boxSize="12px" as={AiOutlineTag} />
                    <TagLabel>{availableTag.name}</TagLabel>
                  </Tag>
                );
              })}
        </Wrap>
      </Flex>
    </Flex>
  );
};
export default TagInputRow;
