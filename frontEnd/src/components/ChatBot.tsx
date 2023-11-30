import { useEffect, useState } from 'react';
import { ChatCard } from './ChatCard';
import { chatGPTForOlympics } from 'src/util';

export function ChatBot() {

    const [currentTxt, setCurrentTxt] = useState('');

    const [chats, setChats] = useState<any>([{
        "res": {
            "txt": "Hello",
            "createdAt": new Date()
        },
    }, {
        "res": {
            "txt": "Ask me anything about olympics :)",
            "createdAt": new Date()
        }
    }])

    useEffect(() => {
        chats.forEach(async (item: any, index: number) => {

            if (item.res.txt || item.res.createdAt) return;

            const resTxt = await chatGPTForOlympics({ txt: item.req.txt });

            if (index === -1) return;

            chats[index].res.txt = resTxt;
            chats[index].res.createdAt = new Date();

            setChats([...chats]);
        })
        scrollToBottom();
    }, [chats])


    async function handleSend(e: any) {

        e?.preventDefault();

        if (!currentTxt) return;

        setChats([...chats, {
            "req": {
                "txt": currentTxt.trim(),
                "createdAt": new Date(),
            },
            "res": {
                "txt": null,
                "createdAt": null
            }
        }])
        setCurrentTxt('');
    }

    const scrollToBottom = () => {
        const chatBox = document.getElementById('chat-bot-body');
        if (!chatBox) return
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    return (
        <div className='container'>
            <button
                className="btn"
                id="chatbot-btn"
                data-bs-toggle="modal"
                data-bs-target="#chatbot"
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20
                }}
            >
                <img src='/chatbot.png' alt='bot' />
            </button>
            <div className="modal fade" id="chatbot">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content h-80">
                        <div className="modal-header">
                            <h4>Olympic AI Chatbot</h4>
                            <button className="btn-close" data-bs-dismiss="modal" data-bs-target="#modal"></button>
                        </div>
                        <div className="modal-body" style={{ minHeight: '50vh' }} id='chat-bot-body'>
                            {chats.map((item: any, index: number) =>
                                <div key={index}>
                                    {item.req && <ChatCard
                                        chat={item.req}
                                        align='right'
                                    />}
                                    {item.res && <ChatCard
                                        chat={item.res}
                                        align='left'
                                    />}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <form style={{ width: '100%' }} onSubmit={handleSend}>
                                <div className='form-group' style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    columnGap: 20
                                }}>
                                    <input
                                        type="text"
                                        className='form-control'
                                        style={{ width: "100%" }}
                                        value={currentTxt}
                                        onInput={(e: any) => {
                                            setCurrentTxt(e.target.value)
                                        }}
                                        placeholder='Type your message here'
                                        autoFocus={true}
                                    />
                                    <button
                                        type='submit'
                                        className="btn btn-primary"
                                        onClick={handleSend}>
                                        <i className="fa-regular fa-paper-plane"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
