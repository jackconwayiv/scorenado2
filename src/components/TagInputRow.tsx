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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiFillTag, AiOutlineTag } from "react-icons/ai";
interface TagInputRowProps {
  playerId: string | null;
  resultId: string | null;
  gameId: string | null;
  supabase: any;
}

const TagInputRow = ({
  playerId,
  resultId,
  gameId,
  supabase,
}: TagInputRowProps) => {
  // const result_id = 1;
  // const game_id = 1;

  const [tag, setTag] = useState<string | null>(null);
  const [tagArray, setTagArray] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<any>([]);

  useEffect(() => {
    console.log("firing tags useEffect");
    const fetchTagsForGame = async () => {
      try {
        let { data: fetchedTags } = await supabase
          .from("tags")
          .select("*")
          .eq("game_id", gameId);
        setTagOptions(fetchedTags);
        console.dir(fetchedTags);
      } catch (error) {
        console.error(error);
      }
    };
    if (gameId !== null) {
      fetchTagsForGame();
    }
  }, [gameId, supabase]);

  const removeTag = (tagToRemove: string) => {
    const extractionIndex = tagArray.indexOf(tagToRemove);
    const tagArrayCopy = [...tagArray];
    tagArrayCopy.splice(extractionIndex, 1);
    setTagArray(tagArrayCopy);
  };

  const addTag = (tagToAdd: string) => {
    if (tagToAdd.length < 1) {
      return;
    }
    const tagArrayCopy = [...tagArray];
    tagArrayCopy.push(tagToAdd);
    setTagArray(tagArrayCopy);
    setTag(null);
  };

  const handleTagAdd = async () => {
    try {
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex direction="column" mt="5px">
      <Wrap>
        {tagArray.length > 0 &&
          tagArray.map((mappedTag: string, idx: number) => {
            return (
              <Tag
                size="sm"
                borderRadius="full"
                variant="solid"
                colorScheme="green"
                key={idx}
              >
                <TagLeftIcon boxSize="12px" as={AiFillTag} />
                <TagLabel>{mappedTag}</TagLabel>
                <TagCloseButton onClick={() => removeTag(mappedTag)} />
              </Tag>
            );
          })}
      </Wrap>
      <Flex justifyContent="center" mt="5px">
        <InputGroup mr="10px">
          <InputLeftElement
            pointerEvents="none"
            color="gray.400"
            fontSize=".7em"
          >
            Tags
          </InputLeftElement>
          <Input
            value={tag || ""}
            bgColor="white"
            onChange={(e) => {
              if (e.target.value.length < 31) setTag(e.target.value);
            }}
            onBlur={(e) => addTag(e.target.value)}
          />
          <InputRightElement>
            <Button
              isDisabled={!tag}
              size="xs"
              onClick={() => tag && addTag(tag)}
            >
              +
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>
      <Flex mt="5px" justifyContent="center">
        <Wrap>
          {tagOptions.length > 0 &&
            tagOptions.map((availableTag: any, idx: number) => {
              return tagArray.indexOf(availableTag.name) !== -1 ? (
                <Tag
                  size="sm"
                  key={idx}
                  variant="subtle"
                  colorScheme="gray"
                  cursor="pointer"
                  // onClick={() => addTag(availableTag)}
                >
                  {" "}
                  <TagLeftIcon boxSize="12px" as={AiOutlineTag} />
                  <TagLabel>{availableTag.name}</TagLabel>
                </Tag>
              ) : (
                <></>
              );
            })}
        </Wrap>
      </Flex>
    </Flex>
  );
};
export default TagInputRow;
