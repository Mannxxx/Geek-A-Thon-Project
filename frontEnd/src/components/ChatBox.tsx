import { useEffect, useState } from 'react'

const my_array = Array.from(Array(30), (_, index) => (index + 1).toString());

export function ChatBox() {

    const [chats, setChats] = useState<string[]>(my_array);

    function sendMessage() {
        const chatBox = document.getElementById('chatBox');

        const messageInput: any = document.querySelector('.form-control');
        const messageText: string = messageInput?.value?.trim();

        if (!chatBox || !messageText) return;

        setChats([messageText, ...chats])

        // Clear the message input
        messageInput.value = '';
        scrollToBottom();
    }

    const scrollToBottom = () => {
        const chatBox = document.getElementById('chatBox');
        if (!chatBox) return
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    useEffect(() => {
        // Scroll to the bottom initially when the component mounts
        scrollToBottom();
    }, []);

    return (

        <div className="container-fluid h-100 col-lg-4 mt-3 mt-lg-0" id="chatBox-container">
            <div className="card">
                <div className="card-header">
                    Chat
                </div>
                <div className="card-body d-flex flex-column">
                    <div className="chat-box flex-grow-1 overflow-auto" id="chatBox">
                        {chats.map((item, index: number) =>
                            <div key={index} className="message">{item}</div>
                        )}
                    </div>
                    <div className="input-group mt-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type your message..."
                            aria-label="Type your message..."
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-primary"
                                type="submit"
                                onClick={sendMessage}
                            >
                                <i className="fa fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}