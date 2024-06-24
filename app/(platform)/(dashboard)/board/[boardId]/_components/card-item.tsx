"use client";

import { useCardModal } from "@/hooks/use-card-model";
import { CardType } from "@/types";
import { Draggable } from "@hello-pangea/dnd";

interface CardItemProps {
  data: CardType;
  index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
  const cardModal = useCardModal();
  return (
    <Draggable draggableId={data._id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => cardModal.onOpen(data._id)}
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};
