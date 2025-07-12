'use client'

import {
  ChatBubbleOvalLeftEllipsisIcon,
  PresentationChartBarIcon,
  UserIcon,
  BellIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import useNavigation from '@/hooks/useNavigation'
import MediaQuery from 'react-responsive'
import { useAtom } from 'jotai'
import { userAtom } from '@/store/authState'
import { useRouter } from 'next/navigation'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Sidebar = () => {
  const [user] = useAtom(userAtom);
  
  const router = useRouter();

  const {
    isHomeActive,
    isExploreActive,
    isNotificationsActive,
    isProfileActive,
    isChatActive,
    isDashboardActive,
  } = useNavigation();

  const navigation1 = [
    { name: 'Home', href: '/home', icon: HomeIcon, current: isHomeActive },
    { name: 'Explore', href: '/explore', icon: MagnifyingGlassIcon, current: isExploreActive },
    { name: 'Notifications', href: '/notifications', icon: BellIcon, current: isNotificationsActive },
    { name: 'Chats', href: '/chats', icon: ChatBubbleOvalLeftEllipsisIcon, current: isChatActive },
    { name: 'Profile', href: `/${user.username}`, icon: UserIcon, current: isProfileActive },
    { name: 'Dashboard', href: '/dashboard', icon: PresentationChartBarIcon, current: isDashboardActive },
  ]

  return (
    <div className='w-72'>
      <MediaQuery minWidth={551} maxWidth={1279}>
        <div>
          {/* Static sidebar for desktop */}
          <div className="fixed inset-y-0 z-50 flex w-20 flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-stone-950 px-3 border-r-[1px] border-gray-600">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="/logo.png"
                  width={48}
                  className="pl-2"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7 mx-auto pl-1">
                  <li>
                    <ul role="list" className=" space-y-3 mx-auto">
                      {navigation1.map((item) => (
                        <div className="tooltip tooltip-right" data-tip={item.name} key={item.name}>
                          <li className='mx-auto'>
                              <a
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? 'bg-stone-900 text-yellow-500'
                                    : 'text-gray-300 hover:bg-stone-900 hover:text-yellow-500',
                                  'group flex gap-x-3 rounded-full p-2 text-lg font-semibold w-12',
                                )}
                              >
                                <item.icon aria-hidden="true" className="size-7 shrink-0 mx-auto" />
                              </a>
                            
                          </li>
                        </div>
                      ))}
                    </ul>
                  </li>
                  <li className='mx-auto'>
                    <button className='btn btn-outline border-yellow-500 rounded-full text-yellow-500 hover:bg-yellow-500 hover:text-black w-10 h-10 text-2xl font-bold pb-2'>+</button>
                  </li>
                  <li className="-mx-6 mt-auto">
                    <div
                      className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-stone-900 border-t-[1px] border-gray-600"
                    >
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="size-8 rounded-full bg-gray-800"
                      />
                      <span className="sr-only">Your profile</span>
                      <p>{user.username}</p>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <main className="py-10 lg:pl-72">
            <div className="px-4 sm:px-6 lg:px-8">{/* Your content */}</div>
          </main> 
        </div>
      </MediaQuery>
      <MediaQuery minWidth={1280} maxWidth={99999}>
        <div>
          {/* Static sidebar for desktop */}
          <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-stone-950 px-6 border-r-[1px] border-gray-600">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="/logo.png"
                  width={48}
                  className=""
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li className=''>
                    <ul role="list" className="space-y-3">
                      {navigation1.map((item) => (
                        <li key={item.name}>
                          <div
                            className={classNames(
                              item.current
                                ? 'bg-stone-900 text-yellow-500'
                                : 'text-gray-300 hover:bg-stone-900 hover:text-yellow-500',
                              'group flex gap-x-3 rounded-full p-2 text-lg font-semibold cursor-pointer',
                            )}
                            onClick={() => router.push(item.href)}
                          >
                            <item.icon aria-hidden="true" className="size-7 shrink-0" />
                            {item.name}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className='-mx-3'>
                    <button className='btn btn-outline border-yellow-500 rounded-full text-yellow-500 hover:bg-yellow-500 hover:text-black w-64 h-10 shadow-none' onClick={() => router.push('/create')}>Create</button>
                  </li>
                  <li className="-mx-6 mt-auto">
                    <div className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-stone-900 border-t-[1px] border-gray-600">
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="size-8 rounded-full bg-gray-800"
                      />
                      <span className="sr-only">Your profile</span>
                      <p className=''>{user.username}</p>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <main className="lg:pl-72">
            <div className="px-4 sm:px-6 lg:px-8">{/* Your content */}</div>
          </main>
        </div>
      </MediaQuery>
      
    </div>
  )
}

export default Sidebar