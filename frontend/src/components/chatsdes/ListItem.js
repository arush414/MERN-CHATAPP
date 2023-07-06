import React from "react";
import { Box, Flex, Text, Avatar } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      display="flex"
      alignItems="center"
      bgColor="#ebe8e4"
      cursor="pointer"
      borderRadius="lg"
      p={3}
      my={2}
      transition="background 0.3s, color 0.3s, transform 0.2s"
      _hover={{
        background: "teal",
        color: "white",
        transform: "scale(1.05)",
      }}
    >
      <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
      <Flex direction="column" ml={3} flex={1}>
        <Text fontWeight="bold" isTruncated>
          {user.name}
        </Text>
        <Flex align="center">
          <Text fontWeight="bold" mr={1}>
            Email:
          </Text>
          <Text flexShrink={0} overflow="hidden" textOverflow="ellipsis">
            {user.email}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default UserListItem;
