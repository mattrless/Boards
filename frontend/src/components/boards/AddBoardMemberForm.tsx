"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import addBoardMemberSchema, {
  type AddBoardMemberSchema,
} from "@/lib/schemas/boards/add-board-member.schema";

type AddBoardMemberFormProps = {
  isPending: boolean;
  submitError?: string | null;
  onSubmitEmail: (email: string) => void;
  resetSignal: number;
};

export default function AddBoardMemberForm({
  isPending,
  submitError,
  onSubmitEmail,
  resetSignal,
}: AddBoardMemberFormProps) {
  const form = useForm<AddBoardMemberSchema>({
    resolver: zodResolver(addBoardMemberSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    form.reset({ email: "" });
  }, [form, resetSignal]);

  function onSubmit(data: AddBoardMemberSchema) {
    onSubmitEmail(data.email.trim());
  }

  return (
    <form
      id="add-board-member-form"
      className="w-full"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="gap-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Add user to board</FieldLabel>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    placeholder="user@example.com"
                    autoComplete="email"
                    type="email"
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  form="add-board-member-form"
                  disabled={isPending}
                >
                  {isPending ? "Adding..." : "Add"}
                </Button>
              </div>
            </Field>
          )}
        />

        {submitError ? <FieldError>{submitError}</FieldError> : null}
      </FieldGroup>
    </form>
  );
}
