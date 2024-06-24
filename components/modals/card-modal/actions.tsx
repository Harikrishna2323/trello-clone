"use client";
import { Copy, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardType } from "@/types";
import { useAction } from "@/hooks/use-action";
import { copyCard } from "@/actions/cards/copy-card";
import { deleteCard } from "@/actions/cards/delete-card";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useCardModal } from "@/hooks/use-card-model";

interface ActionsProps {
  data: CardType;
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams();
  const cardModal = useCardModal();

  const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: (data) => {
        toast.message(`Card ${data.title} copied`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: (data) => {
        toast.success(`Card ${data.title} deleted`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const onCopy = () => {
    const boardId = params.boardId;

    executeCopyCard({ id: data._id, boardId });
  };

  const onDelete = () => {
    const boardId = params.boardId;

    executeDeleteCard({ id: data._id, boardId });
  };
  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        variant={"gray"}
        className="w-full justify-start"
        size={"inline"}
        onClick={onCopy}
        disabled={isLoadingCopy}
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        variant={"destructive"}
        className="w-full justify-start hover:text-white"
        size={"inline"}
        onClick={onDelete}
        disabled={isLoadingDelete}
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200 " />
      <Skeleton className="w-full h-8 bg-neutral-200 " />
      <Skeleton className="w-full h-8 bg-neutral-200 " />
    </div>
  );
};
