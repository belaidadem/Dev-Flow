'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { QuestionsSchema } from '@/lib/validations';
import { useTheme } from '@/context/ThemeProvider';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import {
  createQuestion,
  editQuestion
} from '@/lib/actions/question.action';
import {
  useRouter,
  usePathname
} from 'next/navigation';
import { IQuestion } from '@/database/question.model';

interface Props {
  mongoUserId: string;
  type?: string;
  questionDetail?: IQuestion;
}

const Question = ({
  mongoUserId,
  type,
  questionDetail
}: Props) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [key, setKey] = useState(0);
  const { mode } = useTheme();
  const [content, setContent] = useState(
    questionDetail?.content ?? ''
  );
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== '') {
        if (tagValue.length > 15) {
          return form.setError('tags', {
            type: 'required',
            message:
              'Tag must be less then 15 characters.'
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue('tags', [
            ...field.value,
            tagValue
          ]);
          tagInput.value = '';
          form.clearErrors('tags');
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (
    tag: string,
    field: any
  ) => {
    const newTags = field.value.filter(
      (t: string) => t !== tag
    );

    form.setValue('tags', newTags);
  };

  useEffect(() => {
    setKey((prevKey: number) => prevKey + 1);
  }, [mode]);

  const groupTags = questionDetail?.tags?.map(
    (tag: any) => tag.name
  );

  // form functions
  const form = useForm<
    z.infer<typeof QuestionsSchema>
  >({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: questionDetail?.title || '',
      explanation: questionDetail?.content || '',
      tags: groupTags || []
      // title: '',
      // explanation: '',
      // tags: []
    }
  });

  async function onSubmit(
    values: z.infer<typeof QuestionsSchema>
  ) {
    setIsSubmitting(true);
    try {
      if (type === 'Edit') {
        await editQuestion({
          questionId:
            questionDetail?._id?.toString() ?? '',
          title: values.title,
          content: values.explanation,
          path: pathname
        });
        router.push(
          `/question/${questionDetail?._id}`
        );
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathname
        });
        router.push('/');
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full flex-col gap-10'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Question Title{' '}
                <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl className='mt-3.5'>
                <Input
                  className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                  {...field}
                />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
                Be specific and imagine you&apos;re
                asking a question to another person.
              </FormDescription>
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='explanation'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Detailed explanation of your problem{' '}
                <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl className='background-light900_dark300 mt-3.5'>
                <Editor
                  key={key}
                  apiKey={
                    process.env
                      .NEXT_PUBLIC_TINY_EDITOR_API_KEY
                  }
                  onInit={(_evt, editor) => {
                    editorRef.current = editor;
                    editor.setContent(content);
                  }}
                  initialValue={
                    questionDetail?.content || ' '
                  }
                  value={content}
                  // onBlur={field.onBlur}
                  onEditorChange={(newContent) => {
                    setContent(newContent);
                    field.onChange(newContent);
                  }}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'codesample',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table'
                    ],
                    toolbar:
                      'undo redo | codesample | bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent |',
                    skin:
                      mode === 'dark'
                        ? 'oxide-dark'
                        : 'oxide',
                    content_css:
                      mode === 'dark'
                        ? 'dark'
                        : 'default'
                  }}
                />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
                Introduce the problem and expand on
                what you put in the title. Minimum 100
                characters.
              </FormDescription>
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Tags{' '}
                <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl className='mt-3.5'>
                <>
                  <Input
                    className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    placeholder='Add tags...'
                    onKeyDown={(e) =>
                      handleInputKeyDown(e, field)
                    }
                    disabled={
                      field.value.length >= 3 ||
                      type === 'Edit'
                    }
                  />
                  {field.value.length > 0 && (
                    <div className='flex-start mt-2.5 gap-2.5'>
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className='subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize'
                          onClick={() =>
                            type !== 'Edit'
                              ? handleTagRemove(
                                  tag,
                                  field
                                )
                              : () => {}
                          }
                        >
                          {tag}
                          {type !== 'Edit' && (
                            <Image
                              src='/assets/icons/close.svg'
                              alt='close icon'
                              width={12}
                              height={12}
                              className='cursor-pointer object-contain invert-0 dark:invert'
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
                Add up to 3 tags to describe what your
                question is about. You need to press
                enter to add a tag.
              </FormDescription>
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='primary-gradient w-fit !text-light-900'
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              {type === 'Edit'
                ? 'Editing...'
                : 'Posting...'}
            </>
          ) : (
            <>
              {type === 'Edit'
                ? 'Edit Question'
                : 'Ask a Question'}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
