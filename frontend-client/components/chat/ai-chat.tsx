'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
    id: 'welcome',
    role: 'assistant',
    content: `Привет! 👋 Я AI-помощник Oquga.kz. Помогу тебе с выбором профессии и университета в Казахстане.

**Что я умею:**
• 🎯 Провести тест на профориентацию
• 💼 Подобрать подходящие профессии
• 🏛️ Рекомендовать университеты
• 📚 Рассказать о специальностях и требованиях

Напиши **"тест"** чтобы начать профориентацию, или задай любой вопрос!`,
    timestamp: new Date(),
};

const QUICK_ACTIONS = [
    { label: '🎯 Пройти тест', message: 'Хочу пройти тест на профориентацию' },
    { label: '💼 Выбор профессии', message: 'Помоги выбрать профессию' },
    { label: '🏛️ Университеты', message: 'Расскажи про лучшие университеты Казахстана' },
    { label: '📝 Про ЕНТ', message: 'Расскажи про ЕНТ и гранты' },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function AiChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const resetChat = () => {
        setMessages([WELCOME_MESSAGE]);
        setInput('');
    };

    const sendMessage = async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const chatHistory = [...messages.filter(m => m.id !== 'welcome'), userMessage].map(m => ({
                role: m.role,
                content: m.content,
            }));

            const response = await fetch(`${API_BASE_URL}/api/v1/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: chatHistory }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to get response');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.message,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '😔 Извините, произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const handleQuickAction = (message: string) => {
        sendMessage(message);
    };

    const formatMessage = (content: string) => {
        return content.split('\n').map((line, i) => {
            let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
            return (
                <span key={i}>
                    <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
                    {i < content.split('\n').length - 1 && <br />}
                </span>
            );
        });
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className={cn(
                    'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg',
                    'bg-primary hover:bg-primary/90 text-white',
                    'transition-all duration-300 hover:scale-110',
                    isOpen && 'hidden'
                )}
                size="icon"
                aria-label="Открыть чат с AI помощником"
            >
                <MessageCircle className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                </span>
            </Button>

            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-h-[80vh] max-w-[calc(100vw-48px)] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="flex items-center justify-between p-4 border-b bg-primary text-white rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-primary"></span>
                            </div>
                            <div>
                                <h3 className="font-semibold">AI Помощник</h3>
                                <p className="text-xs text-white/80">Профориентация и выбор вуза</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={resetChat}
                                className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                                title="Начать заново"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    'flex gap-3',
                                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                )}
                            >
                                <div
                                    className={cn(
                                        'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                                        message.role === 'user'
                                            ? 'bg-primary text-white'
                                            : 'bg-muted'
                                    )}
                                >
                                    {message.role === 'user' ? (
                                        <User className="h-4 w-4" />
                                    ) : (
                                        <Sparkles className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                                        message.role === 'user'
                                            ? 'bg-primary text-white rounded-br-md'
                                            : 'bg-muted rounded-bl-md'
                                    )}
                                >
                                    <div className="whitespace-pre-wrap break-words">
                                        {formatMessage(message.content)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {messages.length === 1 && !isLoading && (
                        <div className="px-4 pb-3">
                            <p className="text-xs text-muted-foreground mb-2">Быстрые действия:</p>
                            <div className="flex flex-wrap gap-2">
                                {QUICK_ACTIONS.map((action) => (
                                    <button
                                        key={action.label}
                                        onClick={() => handleQuickAction(action.message)}
                                        className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors border border-border hover:border-primary/50"
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
                        <div className="flex gap-2">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Напишите сообщение..."
                                className="flex-1 resize-none rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 max-h-32 min-h-[44px]"
                                rows={1}
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || isLoading}
                                className="h-11 w-11 rounded-xl shrink-0"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 text-center">
                            AI может ошибаться. Проверяйте важную информацию.
                        </p>
                    </form>
                </div>
            )}
        </>
    );
}
