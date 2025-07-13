'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';
import { userAtom } from '@/store/authState';
import { useAtom } from 'jotai';

const useNavigation = () => {
  const pathname = usePathname();
  const [isHomeActive, setIsHomeActive] = useState(false);
  const [isExploreActive, setIsExploreActive] = useState(false);
  const [isNotificationsActive, setIsNotificationsActive] = useState(false);
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [isWalletActive, setIsWalletActive] = useState(false);
  const [isMarketplaceActive, setIsMarketplaceActive] = useState(false);
  const [isDashboardActive, setIsDashboardActive] = useState(false);
  const [isSettingsActive, setIsSettingsActive] = useState(false);
  const [isCreateActive, setIsCreateActive] = useState(false);

  const [user] = useAtom(userAtom);

  useEffect(() => {
    setIsHomeActive(false);
    setIsExploreActive(false);
    setIsNotificationsActive(false);
    setIsProfileActive(false);
    setIsChatActive(false);
    setIsWalletActive(false);
    setIsMarketplaceActive(false);
    setIsDashboardActive(false);
    setIsSettingsActive(false);
    setIsCreateActive(false)

    switch (pathname) {
      case '/home':
        setIsHomeActive(true);
        break;
      case '/explore':
        setIsExploreActive(true);
        break;
      case '/notifications':
        setIsNotificationsActive(true);
        break;
      case '/chats':
        setIsChatActive(true);
        break;
      case '/wallet':
        setIsWalletActive(true);
        break;
      case '/marketplace':
        setIsMarketplaceActive(true);
        break; 
      case '/dashboard':
        setIsDashboardActive(true);
        break;
      case '/settings':
        setIsSettingsActive(true);
        break;
      case '/create':
        setIsCreateActive(true);
      case `/${user.username}`:
        setIsProfileActive(true);
        break;
      default:
        // Handle any other cases here
        
        break;
    }
  }, [pathname]);

  return {
    isHomeActive,
    isExploreActive,
    isNotificationsActive,
    isProfileActive,
    isChatActive,
    isWalletActive,
    isMarketplaceActive,
    isDashboardActive,
    isSettingsActive,
    isCreateActive
  };
};

export default useNavigation;