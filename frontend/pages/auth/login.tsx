import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AuthForm from '@components/auth/AuthForm'

const Login = () => {
    return (
        <div className="w-screen h-screen">
            <div className="grid grid-cols-10 h-full">
                <div className="col-span-6 relative">
                    <Image src="/image/sub-banner-2.jpg" layout="fill" objectFit="cover" />
                </div>
                <div className="col-span-4 grid m-2">
                    <div className="row-span-2">
                        <AuthForm label="Log in" action="login" />
                    </div>
                    <div className="flex flex-col items-center justify-center border-t-2 w-4/5 mx-auto row-span-1">
                        <h4 className="font-bold">Don&apos;t have an account?</h4>
                        <div className="flex items-center justify-center w-full mt-8 text-xl">
                            <div className="px-10 py-2 rounded-full uppercase text-white bg-fresh-2-500">
                                <Link href="/auth/signup">Sign up</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
