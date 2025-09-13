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

// Custom CSS for animations and scrollbar styling
const StyleInjector: React.FC = () => (
    <style>{`
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(1rem);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fadeInUp {
            animation: fadeInUp 0.5s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
        }

        .chat-container::-webkit-scrollbar {
            width: 6px;
        }
        .chat-container::-webkit-scrollbar-track {
            background: transparent;
        }
        .chat-container::-webkit-scrollbar-thumb {
            background: #a5b4fc;
        }
        .chat-container::-webkit-scrollbar-thumb:hover {
            background: #818cf8;
        }
    `}</style>
);

// Main App Component
const Bot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatContent[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showDisclaimer, setShowDisclaimer] = useState<boolean>(true);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const apiKey = "AIzaSyCdxvwIYOAWdAnP5sB6qWW1s138PXXYLGo"; // API key is not needed for gemini-2.5-flash-preview-05-20
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const systemPrompt = `You are 'Helper', a compassionate and supportive AI companion specifically designed for students' mental well-being. Your purpose is to provide a safe, non-judgmental space for students to discuss challenges like academic stress, exam anxiety, social pressures, and feeling overwhelmed.

        **Your Core Principles:**
        1.  **Empathy and Validation:** Always start by acknowledging the student's feelings. Use phrases like, "It sounds like you're dealing with a lot of pressure," "That's a completely valid way to feel," or "Thank you for trusting me with this."
        2.  **Offer Coping Strategies & Curated Resources:**
            * First, provide simple, evidence-based coping mechanisms. Suggest techniques like the 5-4-3-2-1 Grounding Technique, Box Breathing, or the Pomodoro Technique for studying.
            * Then, if a student discusses a specific issue (e.g., "anxiety," "can't sleep," "stress," "lonely"), you MUST offer to find helpful resources. Ask them: "I can also look for some helpful videos, relaxation audio, or guides on this topic for you. Would you like that? I can search in English, Hindi, Punjabi, or Haryanvi."
            * If they agree, provide a short, curated list of 2-3 helpful, credible resources. You must format the links as full, clickable URLs. Search for real, relevant YouTube videos and articles from reputable Indian health sources.
            * **Format your response clearly**. For example:
                'Here are a few resources that might be helpful for managing stress:'
                **Videos (YouTube):**
                * **'How to Reduce Stress and Anxiety' (Hindi):** A calming video with practical tips. [Provide a real, relevant youtube.com link]
                * **'3-Minute Mindful Breathing Meditation' (English):** A short, guided meditation. [Provide a real, relevant youtube.com link]
                **Relaxation Audio:**
                * **'Deep Sleep Music' (Punjabi):** Calming music to help you relax. [Provide a real, relevant youtube.com link]
                **Guides:**
                * **'Managing Exam Anxiety' (English):** An article from a reputable source like the Health Collective India or a similar wellness site. [Provide a real, relevant link to an article]
        3.  **You are NOT a Therapist:** You must never claim to be a mental health professional. You cannot provide diagnoses or medical advice. If a user asks for these, you must gently decline and guide them toward professional help. Say something like, "I can't offer a diagnosis, but I strongly encourage you to speak with a campus counselor or a healthcare professional who can give you the expert support you deserve."
        4.  **Safety First (India-Specific):** If a user expresses thoughts of self-harm, suicide, or harming others, you must immediately provide crisis support information relevant to India. Respond with: "It sounds like you are in a lot of pain, and it's incredibly brave of you to talk about it. It's really important to talk to someone who can support you right now. You can connect with people who can help by calling the KIRAN Mental Health Helpline at 1800-599-0019. These services are free, confidential, and available 24/7. Please reach out to them; they are there to help."
        5.  **Maintain a Calm, Encouraging Tone:** Your language should always be gentle and supportive.
        6.  **Maintain Boundaries:** Do not create personal stories or pretend to have feelings. You are an AI.
        7.  **Keep it Conversational:** Ask open-ended questions to encourage the student to elaborate, like "What's on your mind today?" or "How has that been affecting your studies?"
        8.  **Multilingual Support:** You must detect the user's language and respond in the same language. You can converse fluently in English, Hindi, Punjabi, and Haryanvi. Maintain all your core principles regardless of the language.`;
    
    // Effect to apply the theme class to the root element
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
    }, [theme]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const initialMessageText = "Hello, I'm Helper, your student support companion. I'm here to listen and can offer some simple coping strategies if you're feeling stressed or overwhelmed. You can talk to me in English, Hindi, Punjabi, or Haryanvi.\n\nWhat's on your mind today?";
        const initialBotMessage: Message = { sender: 'bot', text: initialMessageText };
        const initialHistory: ChatContent = { role: 'model', parts: [{ text: initialMessageText }] };

        setMessages([initialBotMessage]);
        setChatHistory([initialHistory]);
        setIsLoading(false);
    }, []);

    const parseMarkdown = (text: string): string => {
        // Enhanced to find URLs and convert them to clickable links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\* (.*)/g, '<br>• $1')
            .replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-500 underline hover:text-indigo-700">$1</a>');
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

    const handleClearChat = () => {
        const initialMessageText = "Hello, I'm Helper. I'm here to listen again whenever you need it.";
        const initialBotMessage: Message = { sender: 'bot', text: initialMessageText };
        const initialHistory: ChatContent = { role: 'model', parts: [{ text: initialMessageText }] };
        setMessages([initialBotMessage]);
        setChatHistory([initialHistory]);
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="bg-gradient-to-br from-sky-50 via-teal-50 to-emerald-50 dark:from-sky-900 dark:via-teal-900 dark:to-emerald-900 flex items-center justify-center min-h-screen font-sans">
            <StyleInjector />
            <div className="w-full max-w-2xl h-[90vh] md:h-[80vh] flex flex-col bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-200/50 dark:shadow-sky-900/50 mx-4 my-4 border border-white/50 dark:border-slate-700/50">
                <header className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-4 rounded-t-2xl shadow-lg shadow-teal-500/20 flex items-center justify-between transition-colors">
                    <div>
                        <h1 className="text-xl font-bold">Student Mental Health Companion</h1>
                        <p className="text-sm opacity-90">A safe space for your thoughts</p>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Toggle theme">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:hidden"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden dark:block"><path d="M12 3a6.364 6.364 0 0 0 0 18 6.364 6.364 0 0 0 0-18Z"/><path d="M12 9v6"/><path d="M15 10.5h-6"/></svg>
                        </button>
                         <button onClick={handleClearChat} className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Clear chat">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                    </div>
                </header>

                {showDisclaimer && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs text-center border-b border-amber-200/50 dark:border-amber-500/20 transition-colors">
                        <p>
                            <strong>Important:</strong> I am an AI, not a medical professional. If you are in crisis, please seek immediate help. You can call the <strong>KIRAN Mental Health Helpline at 1800-599-0019</strong> (24/7, free).
                            <button onClick={() => setShowDisclaimer(false)} className="font-bold ml-2 p-1 rounded-full hover:bg-amber-200/50 dark:hover:bg-amber-800/50 transition-colors">[X]</button>
                        </p>
                    </div>
                )}
                
                <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto chat-container">
                    <div className="flex flex-col space-y-4">
                        {messages.map((msg, index) => (
                             <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}>
                                <div
                                    className={`chat-message max-w-xs md:max-w-md p-3 rounded-2xl whitespace-pre-wrap transition-all duration-300 ${
                                        msg.sender === 'user'
                                            ? 'bg-indigo-500 text-white rounded-br-none shadow-lg shadow-indigo-500/30'
                                            : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-md shadow-slate-300/20 dark:shadow-black/20 border border-slate-100 dark:border-slate-600'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {isLoading && (
                     <div className="px-6 pb-2 animate-fadeInUp">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                            <span className="text-sm text-indigo-500 dark:text-indigo-400">Helper is thinking...</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/40 rounded-b-2xl transition-colors">
                    <div className="flex items-center bg-white dark:bg-slate-700 rounded-full border border-slate-200/80 dark:border-slate-600 focus-within:ring-2 focus-within:ring-indigo-400 transition-all duration-300 shadow-sm">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="How are you feeling today?"
                            disabled={isLoading}
                            className="w-full p-3 bg-transparent border-none rounded-full focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                        />
                        <button type="submit" disabled={isLoading} className="p-2 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-slate-600 transition-all duration-300 rounded-full mr-2 disabled:opacity-50 disabled:hover:bg-transparent">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 3 3 9-3 9 19-9Z"/><path d="M6 12h16"/></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Bot;

