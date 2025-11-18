import React, { ReactNode } from 'react'
import { auth } from '../(root)/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';


const AdminLayout = async ({children} : {children: ReactNode}) => {
  const session = await auth();

  // If no session or user ID, redirect to sign-in page
  if (!session?.user?.id) redirect('/sign-in');


  return (
    <main className='flex min-h-screen w-full flex-row'>
      <Sidebar session={session}/>

      <div className="flex-1 flex flex-col bg-gray-50 ml-64">
        <Header session={session}/>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          {children}
        </main>
      </div>

    </main>
  )
}

export default AdminLayout