import React, { FunctionComponent, RefObject } from 'react'

interface AuthFormProps {
    label: string,
    forwardRef: RefObject<HTMLInputElement>
}

const AuthForm: FunctionComponent<AuthFormProps> = ({ label, forwardRef }: AuthFormProps) => {
    return (
        <>
            <div className="flex justify-center items-center">
                <h1 className="text-4xl uppercase">
                    {label}
                </h1>
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
                            ref={forwardRef}
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
                        <button className="px-10 py-2 rounded-full uppercase text-white bg-fresh-2-500">
                            {label}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AuthForm
