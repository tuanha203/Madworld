import React from 'react'
import NumberCard from 'components/modules/numbered-element'
import { FilledButton, FilledButtonDark } from 'components/common/buttons'

interface ISignUpCardProps{
    status: string
} 

const SignUpCard = ({ status }: ISignUpCardProps) => {

    const activeNumberCard = (status: string) => {
        if (status == "active") {
            return "primary"
        }
        else {
            return "disabled"
        }
    }

    const isButtonDisabled = (status: string) => {
        if (status == "active") {
            return false;
        } else {
            return true;
        }
    }

    return (
        <div className={`sign-up-card ${status} w-[360px] flex flex-col items-center gap-4 text-center p-8 ${(status == "disabled") ? "bg-background-dark-900" : "bg-background-dark-600"} `}>
            <NumberCard customClass={`!text--title-medium ${(status == "disabled") ? "text-[#E3E3E3]/[.34]" : "text-black"}`} size="large" mood={activeNumberCard(status)} />
            <div className='flex flex-col text--headline-small uppercase text-center'>
                <span className={` ${(status == "disabled") ? "text-[#E3E3E3]/[.34]" : "text-white"}`}>Sign up</span>
                <span className={` ${(status == "disabled") ? "text-[#E3E3E3]/[.34]" : "text-primary-dark"}`}>TO ALLOW LIST</span>
            </div>
            <div className={`w-3/5 pb-3 text--body-medium ${(status == "disabled") ? "text-[#E3E3E3]/[.34]" : "text-white"} `}>
                Tempor nostrud minim
                rure consequat
                commodo sunt
            </div>
            <div className={`${status}`}>
                <FilledButton disabled={isButtonDisabled(status)} text="Sign Up Now" />
            </div>
        </div>
    )
}

SignUpCard.defaultProps = {
    status: "active"
}

export default SignUpCard