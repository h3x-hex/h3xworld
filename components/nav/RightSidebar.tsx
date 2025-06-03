'use client'

import {
  ChatBubbleOvalLeftEllipsisIcon,
  BuildingStorefrontIcon,
  PresentationChartBarIcon,
  WalletIcon,
  UserIcon,
  BellIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'
import useNavigation from '@/hooks/useNavigation'
import MediaQuery from 'react-responsive'



function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const RightSidebar = () => {

  const {
    isHomeActive,
    isExploreActive,
    isNotificationsActive,
    isProfileActive,
    isChatActive,
    isWalletActive,
    isMarketplaceActive,
    isDashboardActive,
  } = useNavigation();

  const navigation = [
    { name: 'Home', href: '/home', icon: HomeIcon, current: isHomeActive },
    { name: 'Explore', href: '/explore', icon: MagnifyingGlassIcon, current: isExploreActive },
    { name: 'Notifications', href: '/notifications', icon: BellIcon, current: isNotificationsActive },
    { name: 'Chats', href: '/chats', icon: ChatBubbleOvalLeftEllipsisIcon, current: isChatActive },
    { name: 'Profile', href: '/profile', icon: UserIcon, current: isProfileActive },
    { name: 'Wallet', href: '/wallet', icon: WalletIcon, current: isWalletActive },
    { name: 'Marketplace', href: '/marketplace', icon: BuildingStorefrontIcon, current: isMarketplaceActive },
    { name: 'Dashboard', href: '/dashboard', icon: PresentationChartBarIcon, current: isDashboardActive },
    { name: 'More', href: '/home', icon: EllipsisHorizontalIcon, current: isDashboardActive },
  ]

  return (
    <div>
      <MediaQuery minWidth={551} maxWidth={1279}>
        <div>
          {/* Static sidebar for desktop */}
          <div className="fixed inset-y-0 z-50 flex w-20 flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-stone-950 px-3 border-r-[2px] border-gray-600">
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
                      {navigation.map((item, idx) => (
                        <div className="tooltip tooltip-right" data-tip={item.name} key={idx}>
                        <li key={item.name} className='mx-auto'>
                          
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
                    <a
                      href="#"
                      className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-stone-900 border-t-2 border-gray-600"
                    >
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="size-8 rounded-full bg-gray-800"
                      />
                      <span className="sr-only">Your profile</span>
                      <span aria-hidden="true">Tom Cook</span>
                    </a>
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
          <div className="fixed right-0 inset-y-0 z-50 flex w-96 flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-stone-950 px-6 border-l-[1px] border-gray-600">
              
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

export default RightSidebar