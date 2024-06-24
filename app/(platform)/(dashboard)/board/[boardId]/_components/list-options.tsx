"use client";

import { ListType } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
import { FormSubmit } from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { deleteList } from "@/actions/lists/delete-list";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";
import { copyList } from "@/actions/lists/copy-list";

interface ListOptionsProps {
  onAddCard: () => void;
  data: ListType;
}

export const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      console.log({ data });
      toast.message(`List "${data.title}" deleted`);
      closeRef?.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.message(`List "${data.title}" copied`);
      closeRef?.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDelete = (formData: FormData) => {
    const id = formData.get("id");
    const boardId = formData.get("boardId");

    executeDelete({ id, boardId });
  };

  const onCopy = (formData: FormData) => {
    const id = formData.get("id");
    const boardId = formData.get("boardId");

    executeCopy({ id, boardId });
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button asChild className="h-auto w-auto p-2 " variant="ghost">
          <MoreHorizontal className="h-4 w-4 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-500 pb-4">
          List Actions
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant={"ghost"}
        >
          Add card...
        </Button>
        <form action={onCopy}>
          <input hidden name="id" id="id" value={data._id} />
          <input hidden name="boardId" id="boardId" value={data.boardId} />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Copy List ...
          </FormSubmit>
        </form>
        <Separator />
        <form action={onDelete}>
          <input hidden name="id" id="id" value={data._id} />
          <input hidden name="boardId" id="boardId" value={data.boardId} />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm text-rose-600 hover:text-rose-600"
          >
            Delete this List
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
