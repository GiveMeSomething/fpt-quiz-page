import React, { useEffect, useRef } from 'react'

export default function withFocusedInput<PropsType extends { forwardRef: Function }>(WrappedComponent: any) {
    return (props: PropsType) => {
        const focusedInputRef = useRef<HTMLInputElement>(null)

        // This focus effect only run onload
        useEffect(() => {
            if (focusedInputRef.current) {
                focusedInputRef.current.focus()
            }
        }, [])

        return <WrappedComponent {...props} forwardRef={focusedInputRef} />
    }
}
