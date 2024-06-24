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

type AuditLogType = {
  _id: string;
  action: string;
  entityId: string;
  entityType: string;
  entityTitle: string;
  orgId: string;
  userId: string;
  userImage: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
};
