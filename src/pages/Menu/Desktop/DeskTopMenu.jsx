import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../../assets/menu/Logo.png'

const DeskTopMenu = () => {
    const navigate = useNavigate()

    const [roundLoop, setRoundLoop] = useState(1)

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent page reload
        const roundNumber = Number(roundLoop); // ensure it's a number
        console.log(roundNumber);
        localStorage.setItem('roundLoop', roundNumber);
        navigate('/lobby'); // Pass round state
    };

    useEffect(() => {
        localStorage.removeItem('roundLoop');
    }, []);

    return (
        <form onSubmit={handleSubmit}>
            <div className='flex h-screen Bg-mid justify-evenly'>
                <div className='flex flex-col text-white font-semibold justify-evenly m-32'>
                    <div className='text-8xl '>
                        SPACE
                        <p>
                            RECRUIT
                        </p>
                    </div>
                    <div className='flex flex-col text-4xl text-center gap-9'>
                        <div>
                            How Many Round ?
                        </div>
                        <div className='flex justify-center'>
                            <div className='grid grid-cols-3 gap-5 justify-between items-center bg-white rounded-2xl text-black'>
                                <button
                                    type="button"
                                    className='p-3 rounded-2xl text-5xl hover:text-pro-orange'
                                    onClick={() => setRoundLoop((prev) => Math.max(1, prev - 1))} // Min: 1
                                >
                                    -
                                </button>
                                <span className=''>{roundLoop}</span>
                                <button
                                    type="button"
                                    className='p-3  rounded-2xl text-5xl hover:text-pro-orange'
                                    onClick={() => setRoundLoop((prev) => Math.min(10, prev + 1))} // Max: 10
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className='text-8xl text-center text-black bg-white p-4 rounded-2xl hover:text-pro-orange'>
                        BEGIN
                    </button>
                </div>
                <div className='relative hidden 2xl:flex'>
                    <div className='flex items-end'>
                        <img src={Logo} className='pointer-events-none h-[90vh]' />
                        <div className="absolute top-0 left-0 w-full h-full bg-opacity-50"></div>
                    </div>
                    <div className='flex flex-col w-1/2 absolute bottom-32 text-end right-24 gap-8'>
                        <div>
                            "JOIN THE SPACE RECRUITS
                            PUSH THE FRONTIERS OF HUMANITY!”
                        </div>
                        <div className='text-sm'>
                            Bravery. Intelligence. Dedication.
                            The galaxy needs pioneers like you.
                            Enlist today and shape the future among the stars!"
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default DeskTopMenu
