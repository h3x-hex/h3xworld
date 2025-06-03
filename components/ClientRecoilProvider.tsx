'use client'

import { Provider } from 'jotai'
import React from 'react';

export default function ClientJotaiProvider({
    children
} : {
    children: React.ReactNode;
}) {
    return <Provider>{children}</Provider>
}