import VerifyEmailForm from '@/components/auth/forms/verify-email-form'
import React, { Suspense } from 'react'

const VerifyEmailPage = () => {

    

  return (
    <div>
      <Suspense>
        <VerifyEmailForm/>
      </Suspense>
    </div>
  )
}

export default VerifyEmailPage