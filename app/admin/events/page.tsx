import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const EventsPage = () => {
  return (
    <section className='w-full rounded-2xl bg-white p-7'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h2 className='text-xl font-semibold'>All Events</h2>
        <Button className='bg-green-700 hover:bg-green-800 hover:cursor-pointer' asChild>
          <Link href="/admin/events/new">
          + Create New Event
          </Link>
          </Button>
        </div>

        <div className='mt-7 w-full overflow-hidden'>
          <p>Events Table</p>
        </div>
    </section>
  )
}

export default EventsPage