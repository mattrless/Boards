"use client";

import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BoardDetailsResponseDto } from "@/lib/api/generated/boardsAPI.schemas";
import GeneralBoardSettingsTab from "./GeneralBoardSettingsTab";
import BoardMembersSettingsTab from "./BoardMembersSettingsTab";

type BoardSettingsDialogProps = {
  board: BoardDetailsResponseDto;
  disabled?: boolean;
};

export default function BoardSettingsDialog({
  board,
  disabled = false,
}: BoardSettingsDialogProps) {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Board settings"
                disabled={disabled}
              >
                <Settings className="size-6" />
              </Button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent side="right">Board settings</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{board.name} settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="tab-1" className="gap-4">
          <div className="flex justify-center">
            <TabsList className="gap-1">
              <TabsTrigger value="tab-general">General</TabsTrigger>
              <TabsTrigger value="tab-members">Members</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="tab-general">
            <GeneralBoardSettingsTab board={board} />
          </TabsContent>
          <TabsContent value="tab-members">
            <BoardMembersSettingsTab board={board} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
