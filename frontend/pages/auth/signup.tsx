import React from 'react'
import Image from 'next/image'
import withFocusedInput from '@components/auth/withFocusedInput'

interface SignupPropsType {
    forwardRef: React.RefObject<HTMLInputElement>
}
const Signup: React.FunctionComponent<SignupPropsType> = (props: SignupPropsType) => {
    return (
        <div className="w-screen h-screen">
            <div className="grid grid-cols-10 h-full">
                <div className="col-span-6 relative">
                    <Image src="/image/sub-banner-2.jpg" layout="fill" objectFit="cover" />
                </div>
                <div className="col-span-4 grid m-2">
                    <div className="flex justify-center items-center">
                        <h1 className="text-4xl">Signup</h1>
                    </div>
                    <div className="container text-xl m-2 flex flex-col items-start justify-start">
                        <div className="bg-white w-full h-full">
                            <div className="flex flex-col items-start justify-start p-2 w-full">
                                <label htmlFor="user-email">Email</label>
                                <input
                                    type="text"
                                    id="user-email"
                                    name="user-email"
                                    className="w-full px-4 py-2 rounded-full my-2 border-gray-400 border-2"
                                    placeholder="Enter email"
                                    ref={props.forwardRef}
                                />
                            </div>
                            <div className="flex flex-col items-start justify-start p-2 w-full">
                                <label htmlFor="user-password">Password</label>
                                <input
                                    type="password"
                                    id="user-password"
                                    name="user-password"
                                    className="w-full px-4 py-2 rounded-full my-2 border-gray-400 border-2"
                                    placeholder="Enter password"
                                />
                            </div>
                            <div className="flex items-center justify-center w-full mt-6">
                                <button className="px-10 py-2 rounded-full uppercase text-white bg-fresh-2-500">Sign up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withFocusedInput(Signup)
