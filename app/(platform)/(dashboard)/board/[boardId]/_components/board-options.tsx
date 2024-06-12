"use client";

import { deleteBoard } from "@/actions/boards/delete-board";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { MoreHorizontal, X } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";

export const BoardOptions = ({ id }: { id: string }) => {
  const router = useRouter();

  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => {
      toast.error(error);
    },
    // onSuccess: (data) => {
    //   toast.success("Board Deleted");
    // },
  });

  const onDelete = () => {
    execute({ id });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board Actions
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 "
            variant={"ghost"}
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>

        <Button
          disabled={isLoading}
          variant="ghost"
          onClick={onDelete}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm text-rose-500"
        >
          Delete this Board
        </Button>
      </PopoverContent>
    </Popover>
  );
};
