'use client';

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button, Callout, TextArea, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { useSession } from 'next-auth/react'; // or your auth hook
import { zodResolver } from '@hookform/resolvers/zod';
import { VolunteerEventSchema } from "@/app/validationSchemas";
import { z } from "zod";
import ErrorMessage from "../components/ErrorMessage";

type CreateEventForm = z.infer<typeof VolunteerEventSchema>;

const NewEventPage = () => {
  const router = useRouter();
  // const { data: session } = useSession();
  const userId = 1; // replace with session?.user.id once you have it
  const {register, handleSubmit, formState: {errors}} = useForm<CreateEventForm>({
    resolver: zodResolver(VolunteerEventSchema)
  });
  const [error, setError] = useState('');

  return (
    <div className="max-w-xl">
      {error &&
        <Callout.Root color="red" role="alert" className="mb-5">
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>
            {error}
          </Callout.Text>
        </Callout.Root>}

      <form 
      className="space-y-3" 
      onSubmit={handleSubmit(async (data) => {
        try {
          const response = await fetch('/api/volunteer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...data,
              ainaBucksAwarded: Number(data.ainaBucksAwarded),
              volunteerHours: Number(data.volunteerHours),
              userId,
            }),
          });

          if (!response.ok) {
            const result = await response.json().catch(() => null);
            setError(result?.errors?.[0]?.message ?? 'Failed to create event. Please check the form and try again.');
            return;
          }

          setError('');
          router.push('/volunteer');
        } catch (error) {
          setError('Failed to create event. Please try again.');
        }
      })}>
          <h1>Create New Volunteer Event</h1>
          <TextField.Root placeholder="Event Title" variant="classic" {...register('title')} />
          <ErrorMessage>{errors.title?.message}</ErrorMessage>

          <TextArea placeholder="Event Description" variant="classic" resize="vertical" {...register('description')} />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>

          <TextField.Root placeholder="Event Date (e.g. 12/31/2025)" variant="classic" {...register('date')} />
          <ErrorMessage>{errors.date?.message}</ErrorMessage>

          <TextField.Root placeholder="Event Time (e.g. 14:00)" variant="classic" {...register('time')} />
          <ErrorMessage>{errors.time?.message}</ErrorMessage>

          <TextField.Root placeholder="Event Location" variant="classic" {...register('location')} />
          <ErrorMessage>{errors.location?.message}</ErrorMessage>

          <TextField.Root placeholder="Aina Bucks Awarded (e.g. 50)" variant="classic" {...register('ainaBucksAwarded')} />
          <ErrorMessage>{errors.ainaBucksAwarded?.message}</ErrorMessage>

          <TextField.Root placeholder="Volunteer Hours (e.g. 5)" variant="classic" {...register('volunteerHours')} />
          <ErrorMessage>{errors.volunteerHours?.message}</ErrorMessage>
          <Button>Submit</Button>
      </form>
    </div>
  )
}

export default NewEventPage;
