'use client';

import { Button, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
// @ts-expect-error - CSS module types may be missing in the project; to properly fix this add a declaration file (e.g. global.d.ts) with: declare module '*.css';
import "easymde/dist/easymde.min.css";


const NewEventPage = () => {
  return (
    <div className="max-w-xl space-y-3">
        <h1>Create New Volunteer Event</h1>
        <TextField.Root placeholder="Event Title" variant="classic" />
        <SimpleMDE placeholder="Event Description"/>
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