import React, { FunctionComponent, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import FormInput from './FormInput'

interface AuthFormProps {
    label: string
    action: 'login' | 'signup'
}

type FormValues = {
    userEmail: string,
    userPassword: string
}

const AuthForm: FunctionComponent<AuthFormProps> = (props: AuthFormProps) => {
    const { register, handleSubmit, setFocus } = useForm<FormValues>()

    useEffect(() => setFocus('userEmail'), [])

    const onSubmit = (data: FormValues) => {
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center w-full min-h-full">
            <div className="flex justify-center items-center">
                <h1 className="text-4xl uppercase">{props.label}</h1>
            </div>
            <div className="container text-xl m-2 flex flex-col items-start justify-start">
                <div className="bg-white w-full h-full">
                    <div className="flex flex-col items-start justify-start p-2 w-full">
                        <FormInput {...register('userEmail')} label="email" type="text" />
                    </div>
                    <div className="flex flex-col items-start justify-start p-2 w-full">
                        <FormInput {...register('userPassword')} label="password" type="password" />
                    </div>
                    <div className="flex items-center justify-center w-full mt-8">
                        <button type="submit" className="px-10 py-2 rounded-full uppercase text-white bg-fresh-2-500">
                            {props.label}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default AuthForm
