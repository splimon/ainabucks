'use client';

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button, Callout, Spinner, TextArea, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { useSession } from 'next-auth/react'; // or your auth hook
import { zodResolver } from '@hookform/resolvers/zod';
import { VolunteerEventSchema } from "@/app/validationSchemas";
import { z } from "zod";
import ErrorMessage from "../components/ErrorMessage";

// raw values from the form before Zod coercion runs
type VolunteerEventFormValues = z.input<typeof VolunteerEventSchema>;
// parsed payload returned by the schema (numbers are guaranteed here)
type VolunteerEventPayload = z.infer<typeof VolunteerEventSchema>;

const NewEventPage = () => {
  const router = useRouter();
  // const { data: session } = useSession();
  const userId = 1; // TODO: replace with session?.user.id once auth is wired up
  const {
    register, 
    handleSubmit, 
    formState: {errors},
    setValue
  } = useForm<VolunteerEventFormValues>({
    resolver: zodResolver(VolunteerEventSchema)
  });

  // inject userId into the form state so the resolver sees it
  useEffect(() => {
    setValue('userId', userId);
  }, [setValue, userId]);
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: VolunteerEventFormValues) => {
    setSubmitting(true); // show spinner + disable button immediately

    try {
      // parse + coerce with the schema so payload matches backend expectations
      const payload: VolunteerEventPayload = VolunteerEventSchema.parse({
        ...values,
        userId,
      });

      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(
          result?.errors?.[0]?.message ??
            'Failed to create event. Please check the form and try again.'
        );
        return;
      }

      setError('');
      router.push('/volunteer');
    } catch (err) {
      setError('Failed to create event. Please try again.');
    } finally {
      setSubmitting(false); // always clear loading state
    }
  };

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" role="alert" className="mb-5">
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <h1>Create New Volunteer Event</h1>

        <TextField.Root
          placeholder="Event Title"
          variant="classic"
          {...register('title')}
        />
        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        <TextArea
          placeholder="Event Description"
          variant="classic"
          resize="vertical"
          {...register('description')}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        <TextField.Root
          placeholder="Event Date (e.g. 12/31/2025)"
          variant="classic"
          {...register('date')}
        />
        <ErrorMessage>{errors.date?.message}</ErrorMessage>

        <TextField.Root
          placeholder="Event Time (e.g. 14:00)"
          variant="classic"
          {...register('time')}
        />
        <ErrorMessage>{errors.time?.message}</ErrorMessage>

        <TextField.Root
          placeholder="Event Location"
          variant="classic"
          {...register('location')}
        />
        <ErrorMessage>{errors.location?.message}</ErrorMessage>

        <TextField.Root
          placeholder="Aina Bucks Awarded (e.g. 50)"
          variant="classic"
          {...register('ainaBucksAwarded', { valueAsNumber: true })} // ensure RHF sends a number
        />
        <ErrorMessage>{errors.ainaBucksAwarded?.message}</ErrorMessage>

        <TextField.Root
          placeholder="Volunteer Hours (e.g. 5)"
          variant="classic"
          {...register('volunteerHours', { valueAsNumber: true })} // same idea here
        />
        <ErrorMessage>{errors.volunteerHours?.message}</ErrorMessage>

        <Button disabled={submitting}>
          Submit {submitting && <Spinner />} {/* inline spinner while posting */}
        </Button>
      </form>
    </div>
  )
}

export default NewEventPage;
