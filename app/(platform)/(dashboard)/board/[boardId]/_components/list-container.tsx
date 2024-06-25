"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/lists/update-list-order";

import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
import { ListType } from "@/types";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/cards/update-card-order";

interface ListContainerProps {
  data: Array<ListType>;
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Cards reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  // DRAG END FUNCTIONALITY
  const onDragEnd = (result: any) => {
    const { destination, source, type, draggableId } = result;

    if (!destination) {
      return;
    }

    // IF - Droped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // CASE - 1 --- User moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index }) // debugging : added +1 to index
      );

      setOrderedData(items);
      //  TRIGGER SERVER ACTION
      executeUpdateListOrder({ items, boardId });
    }

    // CASE - 2 ---  User moves a card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // Get Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list._id === source.droppableId
      );

      const destList = newOrderedData.find(
        (list) => list._id === destination.droppableId
      );

      if (!sourceList || !destList) return;

      // Check if cards exists on source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exists on source list
      if (!destList.cards) {
        destList.cards = [];
      }

      // CASE - 2 (a) --- Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderdCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderdCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderdCards;

        setOrderedData(newOrderedData);
        // TRIGGER SERVER ACTION
        executeUpdateCardOrder({
          cardId: draggableId,
          boardId,
          items: reorderdCards,
          destListId: destination.droppableId,
        });

        // CASE - 2 (b) --- Moving the card to different list
      } else {
        console.log("another list move");
        // remove card from source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        // order update - Source list
        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // order update - destination list
        destList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderedData);
        // TODO SERVER ACTION
        executeUpdateCardOrder({
          cardId: draggableId,
          boardId,
          items: destList.cards,
          destListId: destination.droppableId,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData?.map((list, index) => {
              return <ListItem key={list._id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
