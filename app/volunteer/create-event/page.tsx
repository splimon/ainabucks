'use client';

import { Button, TextArea, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
// import { useSession } from 'next-auth/react'; // or your auth hook

interface CreateEventForm {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  ainaBucksAwarded: number;
  volunteerHours: number;
  userId: number;
}

const NewEventPage = () => {
  const router = useRouter();
  // const { data: session } = useSession();
  const userId = 1; // replace with session?.user.id once you have it
  const {register, handleSubmit} = useForm<CreateEventForm>();

  return (
    <form 
    className="max-w-xl space-y-3" 
    onSubmit={handleSubmit(async (data) => {
      await fetch('/api/volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {...data, 
            ainaBucksAwarded: Number(data.ainaBucksAwarded), // Convert from string to number
            volunteerHours: Number(data.volunteerHours), // Convert from string to number
            userId: userId}),
      });
      // Redirect to volunteer events page after event creation
      router.push('/volunteer');
    })}>
        <h1>Create New Volunteer Event</h1>
        <TextField.Root placeholder="Event Title" variant="classic" {...register('title')} />
        <TextArea placeholder="Event Description" variant="classic" resize="vertical" {...register('description')} />
        <TextField.Root placeholder="Event Date (e.g. 12/31/2025)" variant="classic" {...register('date')} />
        <TextField.Root placeholder="Event Time (e.g. 14:00)" variant="classic" {...register('time')} />
        <TextField.Root placeholder="Event Location" variant="classic" {...register('location')} />
        <TextField.Root placeholder="Aina Bucks Awarded (e.g. 50)" variant="classic" {...register('ainaBucksAwarded')} />
        <TextField.Root placeholder="Volunteer Hours (e.g. 5)" variant="classic" {...register('volunteerHours')} />
        <Button>Submit</Button>
    </form>
  )
}

export default NewEventPage;