/* eslint-disable camelcase */
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import {
  createUser,
  deleteUser,
  updateUser
} from '@/lib/actions/user.action';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  console.log(Request);

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get(
    'svix-timestamp'
  );
  const svix_signature = headerPayload.get(
    'svix-signature'
  );

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing Svix headers');
    return new Response(
      'Error occurred -- no svix headers',
      { status: 400 }
    );
  }

  try {
    const payload = await req.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(WEBHOOK_SECRET);

    const evt: WebhookEvent = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    }) as WebhookEvent;

    const eventType = evt.type;

    if (eventType === 'user.created') {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
        username
      } = evt.data;
      const mongoUser = await createUser({
        clerkId: id,
        name: `${first_name} ${last_name || ''}`,
        username,
        email: email_addresses[0].email_address,
        picture: image_url
      });
      return NextResponse.json({
        message: 'OK',
        user: mongoUser
      });
    }

    if (eventType === 'user.updated') {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
        username
      } = evt.data;
      const mongoUser = await updateUser({
        clerkId: id,
        updateData: {
          name: `${first_name} ${last_name || ''}`,
          username,
          email: email_addresses[0].email_address,
          picture: image_url
        },
        path: `/profile/${id}`
      });
      return NextResponse.json({
        message: 'OK',
        user: mongoUser
      });
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;
      const deletedUser = await deleteUser({
        clerkId: id
      });
      return NextResponse.json({
        message: 'OK',
        user: deletedUser
      });
    }

    return NextResponse.json({
      message: 'OK',
      eventType
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response('Error occurred', {
      status: 400
    });
  }
}
