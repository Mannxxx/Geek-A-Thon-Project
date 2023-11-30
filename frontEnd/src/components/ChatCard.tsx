// @ts-nocheck

import { timeHourMin } from "src/util/time"
import { GetTriangle } from "./GetTriangle"

export function ChatCard({ chat, align }) {

    return (align === 'right' ?
        <div className='msg myMsg'>
            <div className='msg-content'>
                <span>{chat.txt}</span>
                <sub className='time'>{timeHourMin(chat.createdAt)}</sub>
            </div>
            <GetTriangle pos={'right'} />
        </div> :
        <div className='msg'>
            <GetTriangle pos={'left'} />
            <div className='msg-content'>
                {chat.txt ?
                    <>
                        <span>{chat.txt}</span>
                        <sub className='time'>{timeHourMin(chat.createdAt)}</sub>
                    </> : <div className="dot-pulse"></div>
                }
            </div>
        </div>
    )
}