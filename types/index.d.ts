import Board from "@/models/Board";
import mongoose, { ObjectId } from "mongoose";

type TypeList = mogoose.models.List;

type BoardType = {
  _id: string;
  title: string;
  orgId: string;
  imageId: string;
  imageThumbUrl: string;
  imageFullUrl: string;
  imageLinkHTML: string;
  imageUserName: string;
  lists?: ListType[];
};

type ListType = {
  _id: string;
  title: string;
  order: number;
  boardId: string;
  board?: BoardType;
  cards?: CardType[];
};

type CardType = {
  _id: string;
  title: string;
  order: number;
  description: string;
  listId: string;
  list?: ListType;
};
