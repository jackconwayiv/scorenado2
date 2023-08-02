import { Avatar, Divider, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";

interface NavbarProps {
  user: any;
}

const Navbar = ({ user }: NavbarProps) => {
  const navigate = useNavigate();
  return (
    <Flex
      width="410px"
      direction="column"
      alignItems="center"
      mt="5px"
      mb="10px"
    >
      <Flex direction="row" width="400px" justifyContent="space-between">
        <Flex m="12px">
          <HamburgerMenu />
        </Flex>
        {/* <Heading cursor="pointer" onClick={() => navigate(`/`)} size="3xl">
          Scorenado
        </Heading> */}
        <h1
          style={{
            fontSize: "60px",
            cursor: "pointer",
          }}
          className="scripty"
          onClick={() => navigate(`/`)}
        >
          Scorenado
        </h1>
        {user && user.id && (
          <Avatar
            m="12px"
            size="sm"
            cursor="pointer"
            bgColor="teal"
            onClick={() => navigate(`profile`)}
            name={user.identities[0].identity_data.full_name}
            src={user.identities[0].identity_data.avatar_url}
            referrerPolicy="no-referrer"
          />
        )}
      </Flex>
      <Divider />
    </Flex>
  );
};
export default Navbar;
