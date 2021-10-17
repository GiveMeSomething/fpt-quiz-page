import React from 'react'
import Image from 'next/image'
import withFocusedInput from '@components/auth/withFocusedInput'
import AuthForm from '@components/auth/AuthForm'

interface LoginPropsType {
    forwardRef: React.RefObject<HTMLInputElement>
}

const Login: React.FunctionComponent<LoginPropsType> = (props: LoginPropsType) => {
    return (
        <div className="w-screen h-screen">
            <div className="grid grid-cols-10 h-full">
                <div className="col-span-6 relative">
                    <Image src="/image/sub-banner-2.jpg" layout="fill" objectFit="cover" />
                </div>
                <div className="col-span-4 grid m-2">
                    <AuthForm label="Log in" forwardRef={props.forwardRef} />
                </div>
            </div>
        </div>
    )
}

export default withFocusedInput(Login)
