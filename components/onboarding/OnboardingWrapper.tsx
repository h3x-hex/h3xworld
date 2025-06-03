import React, { createContext, useState } from 'react'
import StepWelcome from './StepWelcome'
import StepUsername from './StepUsername'
import StepCustomizeProfile from './StepCustomizeProfile'
import StepPin from './StepPin'
import StepPlan from './StepPlan'

export interface SocialLink {
  platform: string;
  url: string;
}

export interface OnboardingData {
  username: string;
  profileImage: File | null;
  coverImage: File | null;
  bio: string;
  dob: string;
  pin: string;
  socialLinks: SocialLink[];
  plan: string;
  location: string;
  occupation: string;
}

interface OnboardingContextType {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  onboardingData: OnboardingData
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingContextType['onboardingData']>>;
  steps: string[];
} 

export const OnboardingContext = createContext<OnboardingContextType | null>(null);


const OnboardingWrapper = () => {
    const [step, setStep] = useState(0);
    const [onboardingData, setOnboardingData] = useState<OnboardingData>({
      username: '',
      profileImage: null,
      coverImage: null,
      bio: ' ',
      dob: ' ',
      pin: ' ',
      socialLinks: [],
      plan: 'free',
      location: ' ',
      occupation: ' ',
    });

    const steps = [
      'Welcome to h3x.world',
      'Choose your username',
      'Customize your profile',
      'Create your pin',
      'Choose your plan'
    ];
  
    
    return (
      <OnboardingContext.Provider value={{ step, setStep, onboardingData, setOnboardingData, steps }}>
        {step === 0 && <StepWelcome />}
        {step === 1 && <StepUsername />}
        {step === 2 && <StepCustomizeProfile />}
        {step === 3 && <StepPin />}
        {step === 4 && <StepPlan />}
      </OnboardingContext.Provider>
    )
}

export default OnboardingWrapper