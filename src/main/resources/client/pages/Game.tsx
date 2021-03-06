import { Box, Flex, HStack } from "@chakra-ui/react";
import _partition from "lodash.partition";
import React from "react";
import Card from "../components/Card";
import { useSelector } from "../data/store";
import Opponent from "../components/Opponent";
import Container from "../components/Container";
import Actions from "../components/Actions";
import { Droppable } from "react-beautiful-dnd";
import MobileTabs from "../components/MobileTabs";
import FinalScores from "../components/FinalScores";

export default function Game() {
  const game = useSelector((state) => state.currentGame);
  const settings = useSelector((state) => state.settings);
  const isDragging = useSelector((state) => state.dragAndDrop.isDragging);
  const dragAndDropLists = useSelector((state) => state.dragAndDrop.lists);
  const [[me], otherPlayers] = _partition(game.players, ["id", settings.id]);

  if (game.round === 3 && game.players.every((p) => p.hand.length === 0)) {
    return <FinalScores />;
  }

  return (
    <Flex
      background="red.200"
      w="100vw"
      h="100vh"
      overflow="auto"
      flexDirection="column"
      justifyContent="space-between"
    >
      <MobileTabs labels={["Opponents", "Played Cards"]} defaultIndex={1}>
        <Container height={64}>
          {otherPlayers.map((o) => (
            <Opponent player={o} key={o.id} />
          ))}
        </Container>
        <Container
          height={64}
          centerItems={false}
          innerProps={{ padding: "1rem" }}
        >
          {me?.cardsPlayed.map((card, i) => (
            <Card card={card} key={card.id} index={i} isSelectable={false} />
          ))}
          <Droppable droppableId="cardsPlayed" direction="horizontal">
            {(provided, snapshot) => (
              <HStack
                border={isDragging ? "2px dashed black" : undefined}
                padding={isDragging ? "0 1rem" : "2px calc(1rem + 2px)"}
                borderRadius="md"
                flex={1}
                h="full"
                alignItems="center"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {dragAndDropLists.cardsPlayed.map((card, i) => (
                  <Card
                    card={card}
                    key={card.id}
                    index={i}
                    canBeDragged={me.canDrag}
                    isSelectable={me.canDrag}
                  />
                ))}
                {provided.placeholder}
              </HStack>
            )}
          </Droppable>
        </Container>
      </MobileTabs>
      <Droppable droppableId="hand" direction="horizontal">
        {(provided, snapshot) => (
          <Container
            height={64}
            centerItems={false}
            innerProps={{
              height: 64,
              border: isDragging ? "2px dashed black" : undefined,
              padding: isDragging ? "0 1rem" : "2px calc(1rem + 2px)",
              borderRadius: "md",
            }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {dragAndDropLists.hand.map((card, i) => (
              <Card
                card={card}
                key={card.id}
                index={i}
                canBeDragged={me.canDrag}
                isSelectable={me.canDrag}
              />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
      <Box background="white" h={24} shadow="dark-lg">
        <Container height={24} margin="0">
          <Actions />
        </Container>
      </Box>
    </Flex>
  );
}
