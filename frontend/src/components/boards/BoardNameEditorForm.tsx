"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import updateBoardNameSchema, {
  type UpdateBoardNameSchema,
} from "@/lib/schemas/boards/update-board-name.schema";

type BoardNameEditorFormProps = {
  initialName: string;
  isPending: boolean;
  submitError?: string | null;
  onCancel?: () => void;
  onSubmitName: (name: string) => void;
  layout?: "stack" | "inline";
  showCancel?: boolean;
};

export default function BoardNameEditorForm({
  initialName,
  isPending,
  submitError,
  onCancel,
  onSubmitName,
  layout = "stack",
  showCancel = true,
}: BoardNameEditorFormProps) {
  const form = useForm<UpdateBoardNameSchema>({
    resolver: zodResolver(updateBoardNameSchema),
    defaultValues: {
      name: initialName,
    },
  });

  useEffect(() => {
    form.reset({ name: initialName });
  }, [form, initialName]);

  function onSubmit(data: UpdateBoardNameSchema) {
    onSubmitName(data.name);
  }

  return (
    <form
      id="edit-board-name-form"
      className="w-full"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="gap-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              {layout === "inline" ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      maxLength={50}
                      disabled={isPending}
                      placeholder="My awesome board"
                      autoComplete="off"
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </div>
                  <Button
                    type="submit"
                    className={cn("w-full", "sm:w-auto")}
                    form="edit-board-name-form"
                    disabled={isPending}
                  >
                    {isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              ) : (
                <>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    maxLength={50}
                    disabled={isPending}
                    placeholder="My awesome board"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </>
              )}
            </Field>
          )}
        />

        {layout === "stack" ? (
          <div className={cn("grid gap-2", showCancel && "grid-cols-2")}>
            {showCancel ? (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isPending}
                onClick={onCancel}
              >
                Cancel
              </Button>
            ) : null}
            <Button
              type="submit"
              className="w-full"
              form="edit-board-name-form"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : null}

        {submitError ? <FieldError>{submitError}</FieldError> : null}
      </FieldGroup>
    </form>
  );
}
