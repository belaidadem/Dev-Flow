'use client';

import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AnswerSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Editor as TinyMCEEditor } from 'tinymce';
import { useTheme } from '@/context/ThemeProvider';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { createAnswer } from '@/lib/actions/answer.action';
import { usePathname } from 'next/navigation';

interface Params {
  question: string;
  authorId: string;
  questionId: string;
}

const Answer = ({
  question,
  questionId,
  authorId
}: Params) => {
  const pathname = usePathname();
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [key, setKey] = useState(0);
  const { mode } = useTheme();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    setKey((prevKey: number) => prevKey + 1);
  }, [mode]);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: ''
    }
  });

  const handleCreateAnswer = async (
    values: z.infer<typeof AnswerSchema>
  ) => {
    setIsSubmitting(true);
    console.log(question, authorId, questionId);
    try {
      const { answer } = await createAnswer({
        author: JSON.parse(authorId),
        content: values.answer,
        question: JSON.parse(questionId),
        path: pathname
      });

      form.reset();

      if (editorRef?.current) {
        const editor = editorRef.current as any;

        editor.setContent('');
      }
    } catch (error) {
      // console.log(question, authorId, questionId);
      console.log(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='mt-9'>
      <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
        <h4 className='paragraph-semibold text-dark400_light800'>
          Write Your Answer Here
        </h4>

        <Button className='btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-sm'>
          <Image
            src='/assets/icons/stars.svg'
            alt='star'
            width={12}
            height={12}
            className='object-contain'
          />
          Generate an AI Answer
        </Button>
      </div>
      <Form {...form}>
        <form
          className='mt-6 flex w-full flex-col gap-10'
          onSubmit={form.handleSubmit(
            handleCreateAnswer
          )}
        >
          <FormField
            control={form.control}
            name='answer'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col'>
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
                    initialValue=''
                    value={content}
                    onBlur={field.onBlur}
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

                <FormMessage className='text-red-500' />
              </FormItem>
            )}
          />

          <div className='flex justify-end'>
            <Button
              type='submit'
              className='primary-gradient w-fit text-white shadow-sm'
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Submitting...'
                : 'Submit Answer'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
