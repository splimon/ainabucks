import Navbar from '@/components/ui/home/Navbar'
import React, { ReactNode } from 'react'

const Layout = ({ children } : { children: ReactNode }) => {
  return <main className='root-container'>
    <div className='mx-auto max-w'>
        <Navbar />
        <div className='mt-20 pb-20'>
            {children}
        </div>
    </div>
 </main>
}

export default Layout