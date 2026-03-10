"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import createListSchema, {
  CreateListSchema,
} from "@/lib/schemas/lists/create-list.schema";
import { useQueryClient } from "@tanstack/react-query";
import {
  getListsControllerFindAllQueryKey,
  useListsControllerCreate,
} from "@/lib/api/generated/lists/lists";
import { useBoardIdParam } from "@/hooks/boards/use-board-id-param";
import { toast } from "sonner";
import { getErrorMessageByStatus } from "@/lib/errors/api-error";

type CreateListFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function CreateListForm({
  onSuccess,
  onCancel,
}: CreateListFormProps) {
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createListMutation = useListsControllerCreate();
  const boardId = useBoardIdParam();

  const form = useForm<CreateListSchema>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      title: "",
    },
  });

  function onSubmit(data: CreateListSchema) {
    setSubmitError(null);
    createListMutation.mutate(
      {
        boardId,
        data: { title: data.title },
      },
      {
        onSuccess: (res) => {
          if (res.status === 201) {
            queryClient.invalidateQueries({
              queryKey: getListsControllerFindAllQueryKey(boardId),
            });
            form.reset();
            toast.success("List created.");
            onSuccess?.();
            return;
          }
          setSubmitError(
            getErrorMessageByStatus(res.status, {
              400: "Invalid board data.",
              403: "You do not have permission to create boards.",
            }),
          );
        },
        onError: () => {
          setSubmitError("Something went wrong. Please try again.");
        },
      },
    );
  }

  return (
    <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <>
            <div className="flex items-start gap-2">
              <Field
                data-invalid={fieldState.invalid}
                className="min-w-0 flex-1"
              >
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  maxLength={50}
                  autoFocus
                  placeholder="My awesome list"
                  autoComplete="off"
                  className="h-8 text-base font-semibold"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
              <div className="flex items-center gap-1 pt-0.5">
                <Button
                  type="submit"
                  size="icon-xs"
                  variant="ghost"
                  aria-label="Add new list"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  aria-label="Cancel create list"
                  onClick={onCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {submitError ? <FieldError>{submitError}</FieldError> : null}
          </>
        )}
      />
    </form>
  );
}
