import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";

const TagInputRow = () => {
  const result_id = 1;
  const game_id = 1;

  const [tag, setTag] = useState<string | null>(null);
  return (
    <InputGroup mr="10px">
      <InputLeftElement
        pointerEvents="none"
        color="gray.400"
        fontSize=".7em"
        children="Tags"
      />
      <Input
        // value={tag || ""}
        // onChange={(e) => setTag(e.target.value)}
        // placeholder={`tags`}
        width="275px"
        bgColor="white"
      />
      <InputRightElement>
        <Button size="xs">+</Button>
      </InputRightElement>
    </InputGroup>
  );
};
export default TagInputRow;
