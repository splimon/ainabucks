'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { PiPlantFill } from "react-icons/pi";
import classNames from 'classnames';

const NavBar = () => {
  const currentPath = usePathname();
  // console.log('Current Path:', currentPath); // DEBUGGING

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/volunteer', label: 'Volunteer Events' },
    { href: '/rewards', label: 'Rewards' },
    { href: '/event-history', label: 'Event History' },
  ];

  return (
    <nav className='flex space-x-6 border-b mb-5 px-5 h-14 items-center'>
      <Link href="/"><PiPlantFill /></Link>
      <ul className='flex space-x-6'>
        {links.map(link => (
          <li key={link.href}>
            <Link className={classNames({
                'text-zinc-900': link.href === currentPath,
                'text-zinc-500': link.href !== currentPath,
                'hover:text-zinc-800': true,
                'transition-colors': true
            })}
            href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  ) 
}

export default NavBar