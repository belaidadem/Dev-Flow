'use client';
import { deleteAnswer } from '@/lib/actions/answer.action';
import { deleteQuestion } from '@/lib/actions/question.action';
import Image from 'next/image';
import {
  usePathname,
  useRouter
} from 'next/navigation';
import React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { toast } from '../ui/use-toast';

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleEdit = () => {
    router.push(
      `/question/edit/${JSON.parse(itemId)}`
    );
  };

  const handleDelete = async () => {
    if (type === 'Question') {
      const result = await deleteQuestion({
        questionId: JSON.parse(itemId),
        path: pathname
      });

      if (!result?.response) {
        toast({
          title: 'Deleted successfully',
          description: 'Question deleted successfully'
        });
      } else {
        toast({
          title: 'Failed to delete',
          description:
            'Failed to delete the question. Please try again.',
          variant: 'destructive'
        });
      }
    } else if (type === 'Answer') {
      await deleteAnswer({
        answerId: JSON.parse(itemId),
        path: pathname
      });
    }
  };
  return (
    <div className='flex items-center justify-end gap-3 max-sm:w-full'>
      {type === 'Question' && (
        <Image
          src='/assets/icons/edit.svg'
          alt='Edit'
          width={14}
          height={14}
          className='cursor-pointer object-contain'
          onClick={handleEdit}
        />
      )}

      <AlertDialog>
        <AlertDialogTrigger>
          <Image
            src='/assets/icons/trash.svg'
            alt='Delete'
            width={14}
            height={14}
            className='cursor-pointer object-contain'
          />
        </AlertDialogTrigger>
        <AlertDialogContent className='border-gray-800 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-300'>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will
              permanently delete your question.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-500 text-white dark:bg-red-700'
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteAction;
