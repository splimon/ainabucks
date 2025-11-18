import EventCreationForm from '@/components/admin/events/EventCreationForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NewEvents = () => {

  return (
    <>
    <Button asChild className='bg-white text-black border border-gray-200 hover:bg-gray-300'>
        <Link href='/admin/events'>
        <ArrowLeft className="w-4 h-4" />
        Go Back
        </Link>
    </Button>

    <section className='w-full max-w'>
        <EventCreationForm />
    </section>
    </>
  )
}

export default NewEvents