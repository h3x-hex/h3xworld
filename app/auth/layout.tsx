import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode}) => {
    return (
        <section className='w-full h-full relative bg-stone-950'>
            <div className='h-full flex items-center justify-center'>
                {children}
            </div>
        </section>
    )
}

export default AuthLayout;