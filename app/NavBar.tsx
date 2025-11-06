import Link from 'next/link'
import { PiPlantFill } from "react-icons/pi";

const NavBar = () => {
  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/volunteer', label: 'Volunteer Opportunities' },
    { href: '/', label: 'Rewards' },
    { href: '/', label: 'Event History' },
  ];

  return (
    <nav className='flex space-x-6 border-b mb-5 px-5 h-14 items-center'>
      <Link href="/"><PiPlantFill /></Link>
      <ul className='flex space-x-6'>
        {links.map(link => (
          <li key={link.href}>
            <Link className="text-zinc-500 hover:text-zinc-800 transition-colors" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  ) 
}

export default NavBar