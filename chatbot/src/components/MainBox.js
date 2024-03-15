

import React, { useState } from 'react';

function MainBox() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            message: "Hello I am AsymtosBot",
            sender: "AsymtosBot"
        }
    ]);

    const handleChange = (event) => {
        setInput(event.target.value)
    }

    const handleSend = async (event) => {
        event.preventDefault()
        const newMessage = {
            message: input,
            sender: "user"
        }

        const newMessages = [...messages, newMessage];

        setMessages(newMessages);

        setInput('');

        await processMessageToAsymtosBot(newMessages);
    }

    async function processMessageToAsymtosBot(chatMessages) {
        const API_KEY = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "AsymtosBot") {
                role = "assistant"
            } else {
                role = "user"
            }
            return (
                { role: role, content: messageObject.message }
            )
        });

        const systemMessage = {
            role: "system",
            content: "Explain all concept like i am 10 year old"
        }

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data.choices[0].message.content);
            setMessages(
                [
                    ...chatMessages,
                    {
                        message: data.choices[0].message.content,
                        sender: "AsymtosBot"
                    }
                ]
            )
        })
    }
    //code that renders on the browser
    return (
        <div className="container">
            <div className="response-area">
                {messages.map((message, index) => {
                    return (
                        <div className={message.sender === "AsymtosBot" ? 'gpt-message message' : 'user-message message'}>{message.message}</div>
                    );
                })}
            </div>
            <div className="prompt-area">
                <input type="text" placeholder="Send a message..." value={input} onChange={handleChange} />
                <button className="submit" type="submit" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}

export default MainBox;


