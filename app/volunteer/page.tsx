import Link from "next/link"
import { Button } from "@radix-ui/themes";

const VolunteerPage = () => {
  return (
    <div>
      <h1>VolunteerPage</h1>
      <Button><Link href="/volunteer/create-event">Create Volunteer Event</Link></Button>
    </div>
  )
}

export default VolunteerPage