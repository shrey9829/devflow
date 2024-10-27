"use client";
import React, { useRef, useTransition } from "react";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionsSchema } from "@/lib/validations";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { createQuestion, editQuestion } from "@/actions/question.actions";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import router from "next/router";

interface Props {
  userId: string;
  type?: string;
  questionDetails?: string | null;
}

const Question = ({ userId, type, questionDetails }: Props) => {
  const { theme } = useTheme();
  const [isLoading, setTransition] = useTransition();
  const editorRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const parsedQuestionDetails = questionDetails
    ? JSON.parse(questionDetails)
    : null;

  const groupedTags = parsedQuestionDetails?.tags?.map((tag: any) => tag.name);

  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: parsedQuestionDetails?.title || "",
      explanation: parsedQuestionDetails?.content || "",
      tags: groupedTags || [],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setTransition(() => {
      if (type === "edit") {
        editQuestion({
          questionId: parsedQuestionDetails._id,
          title: values.title,
          content: values.explanation,
          path: pathname,
        })
          .then((data: any) => {
            router.push(`/question/${parsedQuestionDetails._id}`);
          })
          .catch((e) => {
            //do something
            console.log(e);
          });
      } else {
        createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(userId),
          path: pathname,
        })
          .then((data: any) => {
            if (data.error) {
              //do something
            }
            console.log(data.success);
            router.push("/");
          })
          .catch((e) => {
            //do something
          });
      }
    });
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();
      console.log(field.value.length);

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters.",
          });
        }
        // Ensure field.value is initialized as an array
        let tags = form.getValues("tags") || [];

        if (!tags.includes(tagValue)) {
          tags.push(tagValue);
          form.setValue("tags", tags, { shouldValidate: true });
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const updatedTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", updatedTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>
                Question Title <span className="text-primary">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  disabled={isLoading}
                  className="min-h-[56px] bg-accent/50"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel>
                Detailed explanation of your problem{" "}
                <span className="text-primary">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  disabled={isLoading}
                  apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
                  onInit={(evt, editor) => {
                    //@ts-ignore
                    editorRef.current = editor;
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue={parsedQuestionDetails?.content || ""}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                    ],
                    skin: theme === "dark" ? "oxide-dark" : "oxide",
                    content_css: theme === "dark" ? "dark" : "light",
                    toolbar:
                      "undo redo | " +
                      "codesample | bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist" +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
                  }}
                />
              </FormControl>
              <FormDescription>
                Introduce the problem and expand on what ypu put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2">
              <FormLabel>
                Question Title <span className="text-primary">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    disabled={isLoading || type === "edit"}
                    placeholder="Add tags..."
                    className="min-h-[56px] bg-accent/50"
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex justify-start items-center mt-2.5 gap-2.5">
                      {field.value.map((tag, index) => (
                        <Badge
                          onClick={() =>
                            type !== "edit" && handleTagRemove(tag, field)
                          }
                          key={index}
                          className="flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize bg-slate-200 hover:bg-slate-100 text-slate-400 dark:text-slate-300 dark:invert dark:bg-slate-700/70 dark:hover:dark:bg-slate-600/70"
                        >
                          {tag}
                          {type !== "edit" && (
                            <Image
                              src={"/assets/icons/close.svg"}
                              alt="close icon"
                              width={12}
                              height={12}
                              className="cursor-pointer object-contain mt-0.5"
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription>
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <>{type === "edit" ? "Editing" : "Posting..."}</>
          ) : (
            <>{type === "edit" ? "Edit Question" : "Ask a question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
