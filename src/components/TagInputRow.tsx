import { Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react";

const TagInputRow = () => {
  const result_id = 1;
  const game_id = 1;

  const [tag, setTag] = useState<string | null>(null);
  return (
    <Flex>
      <Text width="85px" p="10px" textAlign="right">
        Tag:{" "}
      </Text>
      <Input
        value={tag || ""}
        onChange={(e) => setTag(e.target.value)}
        width="230px"
        bgColor="white"
      />
    </Flex>
  );
};
export default TagInputRow;
