import React from 'react'
import { useMediaQuery } from 'react-responsive'

const Clubs = () => {

    const isMobile = useMediaQuery({ query: '(max-width: 520px)' })

    


  return (
    <div>
        {
            isMobile? 

            <>
            <div className="mx-auto text-center">
                <p className="text-2xl font-bold pt-8">Clubs</p>
                <div className='divider divider-warning my-0 w-5/12 mx-auto'></div>

            </div>
                <p className='mx-auto text-center pb-64'>No NFTs collected yet!</p>
            </>

            :

            <>
            <div className="mx-auto text-center">
                <p className="text-2xl font-bold pt-8">Clubs</p>
                <div className='divider divider-warning my-0 w-2/12 mx-auto'></div>

            </div>
                <div className='flex flex-col gap-8 mx-auto'>
                    <ul className="menu menu-horizontal bg-transparent rounded-box mx-auto">
                        <li><button>Item 1</button></li>
                        <li><button>Item 2</button></li>
                        <li><button>Item 3</button></li>
                    </ul>
                </div>
            </>
        }
    </div>
  )
}

export default Clubs