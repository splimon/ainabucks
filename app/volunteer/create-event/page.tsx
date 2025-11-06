'use client';
import { Button, TextArea, TextField } from "@radix-ui/themes";
import React from "react";

const NewEventPage = () => {

  return (
    <div className="max-w-xl space-y-3">
        <h1>Create New Volunteer Event</h1>
        <TextField.Root placeholder="Event Title" variant="classic" />
        <TextArea resize="vertical" placeholder="Event Description" variant="classic" />
        <TextField.Root placeholder="Event Date" variant="classic" />
        <TextField.Root placeholder="Event Time" variant="classic" />
        <TextField.Root placeholder="Event Location" variant="classic" />
        <TextField.Root placeholder="Aina Bucks Awarded" variant="classic" />
        <TextField.Root placeholder="Volunteer Hours" variant="classic" />
        <Button>Submit</Button>
    </div>
  )
}

export default NewEventPage;