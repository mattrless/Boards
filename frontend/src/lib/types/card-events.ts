export type CardEventBase = {
  boardId: number;
  listId: number;
  cardId: number;
  timestamp: string;
};

export type CardDataDto = {
  id: number;
  title: string;
  description: string;
  position: number;
};

export type CardCreatedUpdatedEvent = CardEventBase & {
  data: CardDataDto;
};

export type CardMovedDataDto = {
  id: number;
  position: number;
  targetListId: number;
  prevCardId: number | null;
  nextCardId: number | null;
};

export type CardMovedEvent = CardEventBase & {
  sourceListId: number;
  data: CardMovedDataDto;
};

export type CardDeletedEvent = CardEventBase;
