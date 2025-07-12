"use client"

import React from 'react';
import { userAtom } from '@/store/authState';
import { useAtom } from 'jotai';
import OnboardingWrapper from '../onboarding/OnboardingWrapper';
import HomeFeed from './Home';


const HomeWrapper = () => {

    const [user] = useAtom(userAtom);

    if(user.username == null || user.accountAddress == null)
    {
        return <OnboardingWrapper/>
    }

    return (
        <>
            <HomeFeed user={user}/>
        </>
    );
};

export default HomeWrapper;
