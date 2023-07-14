import {
  Button,
  Checkbox,
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
import { useState } from "react";
import { AiFillTag, AiOutlineTag } from "react-icons/ai";
interface TagInputRowProps {
  name: string;
  winning: boolean;
  setWinning: any;
}

const TagInputRow = ({ name, winning, setWinning }: TagInputRowProps) => {
  // const result_id = 1;
  // const game_id = 1;

  const [tag, setTag] = useState<string | null>(null);
  const [tagArray, setTagArray] = useState<string[]>([]);

  const availableTagArray = [
    "white boy",
    "got Avatar",
    "tier III",
    "tier II",
    "tier I",
  ];

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
            width="275px"
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
        <Checkbox
          isDisabled={!name}
          isChecked={winning}
          mr="10px"
          colorScheme="purple"
          onChange={() => setWinning(!winning)}
        >
          Winner
        </Checkbox>
      </Flex>
      <Flex mt="5px" justifyContent="center">
        <Wrap>
          {availableTagArray.length > 0 &&
            availableTagArray.map((availableTag: string, idx: number) => {
              return tagArray.indexOf(availableTag) === -1 ? (
                <Tag
                  size="sm"
                  key={idx}
                  variant="subtle"
                  colorScheme="gray"
                  cursor="pointer"
                  onClick={() => addTag(availableTag)}
                >
                  {" "}
                  <TagLeftIcon boxSize="12px" as={AiOutlineTag} />
                  <TagLabel>{availableTag}</TagLabel>
                </Tag>
              ) : (
                <Flex key={idx}></Flex>
              );
            })}
        </Wrap>
      </Flex>
    </Flex>
  );
};
export default TagInputRow;
