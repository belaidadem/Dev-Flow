'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { ProfileSchema } from '@/lib/validations';
import {
  usePathname,
  useRouter
} from 'next/navigation';
import { updateUser } from '@/lib/actions/user.action';
import { IUser } from '@/database/user.model';

interface Params {
  clerkId: string;
  user: IUser;
}

const Profile = ({ clerkId, user }: Params) => {
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name,
      username: user.username || '',
      portfolioWebsite: user.portfolioWebsite || '',
      location: user.location || '',
      bio: user.bio || ''
    }
  });

  async function onSubmit(
    values: z.infer<typeof ProfileSchema>
  ) {
    setIsSubmitting(true);

    try {
      // update user profile
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          portfolioWebsite: values.portfolioWebsite,
          location: values.location,
          bio: values.bio
        },
        path: pathname
      });

      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mt-9 flex w-full flex-col gap-9'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col space-y-3.5'>
              <FormLabel>
                Name{' '}
                <span className='text-primary-500'>
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='John Doe'
                  className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col space-y-3.5'>
              <FormLabel>
                Username{' '}
                <span className='text-primary-500'>
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='john_doe'
                  className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col space-y-3.5'>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder='Where are you from?'
                  className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='portfolioWebsite'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col space-y-3.5'>
              <FormLabel>Protfolio Link</FormLabel>
              <FormControl>
                <Input
                  placeholder='johndoe.com'
                  className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col space-y-3.5'>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`What's special about you?`}
                  className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 h-32 min-h-[56px] border'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='mt-7 flex justify-end'>
          <Button
            type='submit'
            className='primary-gradient w-fit text-white'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
