import React from 'react'
import { useMediaQuery } from 'react-responsive'

const Campaigns = () => {

    const isMobile = useMediaQuery({ query: '(max-width: 520px)' })


  return (
    <div>
        {
            isMobile? 

            <>
            <div className="mx-auto text-center">
                <p className="text-2xl font-bold pt-8">Campaigns</p>
                <div className='divider divider-warning my-0 w-5/12 mx-auto'></div>

            </div>
                <p className='mx-auto text-center pb-64'>No Campaigns started yet!</p>
            </>

            :

            <>
            <div className="mx-auto text-center">
                <p className="text-2xl font-bold pt-8">Campaigns</p>
                <div className='divider divider-warning my-0 w-2/12 mx-auto'></div>

            </div>
            <div className='mx-auto pt-8'>
                <div className="card bg-transparent hover:border-warning border-2 w-96 shadow-xl mx-auto">
                    <div className="card-body">
                        <div className='flex flex-row gap-8'>
                            <div className="radial-progress text-warning" style={{ "--value": 69 }} role="progressbar">
                                69%
                            </div>
                            <h2 className="card-title">First Campaign</h2>
                        </div>
                        <p>Please Support my Campaign to raise funds</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-warning">View Campaign</button>
                        </div>
                    </div>
                </div>
            </div>
            </>
        }
    </div>
  )
}

export default Campaigns