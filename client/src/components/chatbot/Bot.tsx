import React, { useState, useEffect, useRef, FormEvent } from 'react';

// Define the structure of a chat message
interface Message {
  sender: 'user' | 'bot';
  text: string;
}

// Define the structure for API chat history
interface ChatPart {
    text: string;
}

interface ChatContent {
    role: 'user' | 'model';
    parts: ChatPart[];
}


// Main App Component
const Bot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatContent[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showDisclaimer, setShowDisclaimer] = useState<boolean>(true);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const apiKey = "AIzaSyCdxvwIYOAWdAnP5sB6qWW1s138PXXYLGo"; // API key is not needed for gemini-2-pro
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const systemPrompt = `You are 'Aura', a compassionate and supportive AI companion designed for mental well-being. Your purpose is to provide a safe, non-judgmental space for users to express their thoughts and feelings.

        **Your Core Principles:**
        1.  **Empathy and Validation:** Always start by acknowledging and validating the user's feelings. Use phrases like "It sounds like you're going through a lot," "That must be really tough," or "Thank you for sharing that with me."
        2.  **You are NOT a Therapist:** You must never claim to be a mental health professional, therapist, or doctor. You cannot diagnose conditions or provide medical advice. If a user asks for a diagnosis or specific medical treatment, you must gently decline and strongly recommend they consult a qualified professional.
        3.  **Safety First:** If a user expresses thoughts of self-harm, suicide, or harming others, you must immediately provide crisis support information. Respond with something like: "It sounds like you are in a lot of pain, and it's brave of you to talk about it. It's really important to talk to someone who can support you right now. You can connect with people who can support you by calling or texting 988 in the US and Canada, or calling 111 in the UK, anytime. These services are free, confidential, and available 24/7. Please reach out to them."
        4.  **Encourage, Don't Prescribe:** You can suggest general, evidence-based wellness techniques like mindfulness, deep breathing exercises, journaling, or going for a walk. Frame these as gentle suggestions, not commands. For example: "Sometimes, when things feel overwhelming, a few slow, deep breaths can help ground us. Would you be open to trying that?"
        5.  **Maintain a Calm Tone:** Your language should always be calm, gentle, and encouraging.
        6.  **Maintain Boundaries:** Do not create personal stories or pretend to have feelings. You are an AI. Maintain this persona consistently.
        7.  **Keep it Conversational:** Ask open-ended questions to encourage the user to elaborate, like "How did that make you feel?" or "What's on your mind today?"
        8.  **Multilingual Support:** You must detect the user's language and respond in the same language. You can converse fluently in English, Hindi, Punjabi, and Haryanvi. If the user mixes languages (e.g., Hinglish), you should understand and respond appropriately in the mixed language. Maintain all your core principles regardless of the language.`;
    
    // Function to scroll to the bottom of the chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Set initial message on component mount
    useEffect(() => {
        const initialMessageText = "Hello, I'm Aura. I'm here to listen. You can talk to me in English, Hindi, Punjabi, or Haryanvi.\n\nWhat's on your mind today?";
        const initialBotMessage: Message = { sender: 'bot', text: initialMessageText };
        const initialHistory: ChatContent = { role: 'model', parts: [{ text: initialMessageText }] };

        setMessages([initialBotMessage]);
        setChatHistory([initialHistory]);
        setIsLoading(false);
    }, []);

    const parseMarkdown = (text: string): string => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\* (.*)/g, '<br>• $1');
    };

    const getBotResponse = async (prompt: string, currentChatHistory: ChatContent[]) => {
        setIsLoading(true);

        const payload = {
            contents: currentChatHistory,
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
        };

        try {
            let response;
            let retries = 3;
            let delay = 1000;

            for(let i = 0; i < retries; i++) {
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (response.ok) break;

                if (response.status === 429 || response.status >= 500) {
                    await new Promise(res => setTimeout(res, delay));
                    delay *= 2;
                } else {
                    break;
                }
            }

            if (!response || !response.ok) {
                throw new Error(`API request failed with status ${response?.status || 'unknown'}`);
            }

            const result = await response.json();
            const botMessageText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (botMessageText) {
                const newBotMessage: Message = { sender: 'bot', text: botMessageText };
                const newBotHistory: ChatContent = { role: 'model', parts: [{ text: botMessageText }] };
                setMessages(prev => [...prev, newBotMessage]);
                setChatHistory(prev => [...prev, newBotHistory]);
            } else {
                 const errorMsg = "I'm sorry, I'm having a little trouble thinking right now. Could you please try again?";
                 setMessages(prev => [...prev, { sender: 'bot', text: errorMsg }]);
            }

        } catch (error) {
            console.error('Error fetching bot response:', error);
            const errorMsg = "I seem to be having connection issues. Please check your internet and try again.";
            setMessages(prev => [...prev, { sender: 'bot', text: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const userMessageText = inputValue.trim();
        if (userMessageText) {
            const newUserMessage: Message = { sender: 'user', text: userMessageText };
            const newUserHistory: ChatContent = { role: 'user', parts: [{ text: userMessageText }] };
            
            const updatedMessages = [...messages, newUserMessage];
            const updatedHistory = [...chatHistory, newUserHistory];

            setMessages(updatedMessages);
            setChatHistory(updatedHistory);
            setInputValue('');
            getBotResponse(userMessageText, updatedHistory);
        }
    };

    return (
        <div className="bg-slate-100 flex items-center justify-center min-h-screen font-sans">
            <div className="w-full max-w-2xl h-[90vh] md:h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl mx-4 my-4">
                <header className="bg-emerald-600 text-white p-4 rounded-t-2xl shadow-md flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Mindful Companion</h1>
                        <p className="text-sm opacity-90">Your AI friend for thoughts and feelings</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M12 22a6.5 6.5 0 0 0 6.5-6.5H12V22Z"/><path d="M12 2a6.5 6.5 0 0 0-6.5 6.5h13A6.5 6.5 0 0 0 12 2Z"/><path d="M2 12a6.5 6.5 0 0 0 6.5 6.5V5.5A6.5 6.5 0 0 0 2 12Z"/><path d="M22 12a6.5 6.5 0 0 1-6.5 6.5V5.5A6.5 6.5 0 0 1 22 12Z"/></svg>
                </header>

                {showDisclaimer && (
                    <div className="p-3 bg-amber-100 text-amber-800 text-xs text-center border-b border-amber-200">
                        <p>
                            <strong>Important:</strong> I am an AI, not a medical professional. If you are in crisis, please seek immediate help. Contact the <a href="https://988lifeline.org/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">988 Lifeline</a> (call or text 988) or other local emergency services.
                            <button onClick={() => setShowDisclaimer(false)} className="font-bold ml-2">[X]</button>
                        </p>
                    </div>
                )}
                
                <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto">
                    <div className="flex flex-col">
                        {messages.map((msg, index) => (
                             <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`chat-message max-w-xs md:max-w-md mb-4 p-3 rounded-xl whitespace-pre-wrap ${
                                        msg.sender === 'user'
                                            ? 'bg-emerald-600 text-white rounded-br-none'
                                            : 'bg-slate-200 text-slate-800 rounded-bl-none'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {isLoading && (
                    <div className="px-6 pb-2">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-slate-500">Thinking...</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                    <div className="flex items-center bg-white rounded-full border border-slate-300 focus-within:ring-2 focus-within:ring-emerald-500">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="How are you feeling today?"
                            disabled={isLoading}
                            className="w-full p-3 bg-transparent border-none rounded-full focus:outline-none focus:ring-0 text-slate-700"
                        />
                        <button type="submit" disabled={isLoading} className="p-3 text-emerald-600 hover:text-emerald-500 transition-colors rounded-full mr-1 disabled:opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 3 3 9-3 9 19-9Z"/><path d="M6 12h16"/></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Bot;
