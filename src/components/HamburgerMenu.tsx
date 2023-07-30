import { HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const HamburgerMenu = () => {
  const navigate = useNavigate();
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
        size="sm"
      />
      <MenuList>
        <MenuItem onClick={() => navigate(`/`)}>Welcome</MenuItem>
        <MenuItem onClick={() => navigate(`profile`)}>Settings</MenuItem>
        {/* <MenuItem onClick={() => navigate(`players`)}>My Players</MenuItem> */}
        {/* <MenuItem onClick={() => navigate(`leaderboard`)}>
          Leaderboards
        </MenuItem> */}
        {/* <MenuItem icon={<AddIcon />} command="⌘T">
          New Tab
        </MenuItem> */}
      </MenuList>
    </Menu>
  );
};
export default HamburgerMenu;
