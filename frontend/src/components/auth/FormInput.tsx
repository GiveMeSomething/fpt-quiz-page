import React, { HTMLInputTypeAttribute } from 'react'

interface FormInputProps {
    label: string
    type: HTMLInputTypeAttribute
}

// Using forwardRef() to pass react-hook-form's ref into component ref
const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>((props, ref) => {
    const inputId = 'user' + props.label
    const inputPlaceholder = 'Enter ' + props.label.toLowerCase()
    return (
        <>
            <label htmlFor={inputId} className="capitalize">
                {props.label}
            </label>
            <input
                id={inputId}
                ref={ref}
                className="w-full px-4 py-2 rounded-full my-2 border-gray-400 border-2"
                type={props.type}
                placeholder={inputPlaceholder}
            />
        </>
    )
})

export default FormInput
