'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    MessageCircle,
    X,
    Send,
    Loader2,
    Bot,
    User,
    Sparkles,
    RotateCcw,
    ChevronRight,
    Check,
    MapPin,
    Calendar,
    Briefcase,
    GraduationCap,
    TrendingUp,
    Star,
    Zap,
    Trophy,
    Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Option {
    id: string;
    label: string;
    description: string;
    emoji: string;
    imageUrl?: string;
}

interface ProgressInfo {
    current: number;
    total: number;
    stage: string;
    percentage: number;
}

interface UniversityCard {
    id: number;
    name: string;
    city: string;
    photoUrl: string;
    shortDescription: string;
    foundedYear: number;
    matchingPrograms: string[];
    matchScore: number;
}

interface ProfessionResult {
    id: string;
    name: string;
    description: string;
    matchPercent: number;
    emoji: string;
    skills: string[];
    industries: string[];
    salaryRange: string;
    demandLevel: string;
}

interface ScaleConfig {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
}

interface ScaleItem {
    id: string;
    label: string;
    emoji: string;
    value: number;
}

interface QuickAction {
    id: string;
    label: string;
    emoji: string;
    action: string;
}

interface InteractiveElement {
    type: string;
    questionId: string;
    question: string;
    description: string;
    options: Option[];
    progress: ProgressInfo;
    universities: UniversityCard[];
    professions: ProfessionResult[];
    scale: ScaleConfig;
    scaleItems: ScaleItem[];
    quickActions: QuickAction[];
}

interface SessionContext {
    sessionId: string;
    currentStage: string;
    questionNumber: number;
    totalQuestions: number;
    isComplete: boolean;
    analysisData?: Record<string, unknown>;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    interactive?: InteractiveElement;
    sessionContext?: SessionContext;
}

const WELCOME_MESSAGE: Message = {
    id: 'welcome',
    role: 'assistant',
    content: `👋 Привет! Я AI-помощник **Oquga.kz**

Помогу тебе найти идеальную профессию и университет в Казахстане!

**Что умею:**
🎮 Интерактивный квест по профориентации
🎯 Подбор профессий по твоим интересам
🏛️ Рекомендации университетов и программ`,
    timestamp: new Date(),
    interactive: {
        type: 'quick_actions',
        questionId: '',
        question: '',
        description: '',
        options: [],
        progress: { current: 0, total: 0, stage: '', percentage: 0 },
        universities: [],
        professions: [],
        scale: { min: 0, max: 0, minLabel: '', maxLabel: '' },
        scaleItems: [],
        quickActions: [
            { id: 'start_test', label: '🎮 Начать квест профориентации', emoji: '🎮', action: 'start_test' },
            { id: 'universities', label: '🏛️ Посмотреть университеты', emoji: '🏛️', action: 'show_universities' },
            { id: 'ask', label: '💬 Задать вопрос', emoji: '💬', action: 'open_chat' },
        ],
    },
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function AiChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionContext, setSessionContext] = useState<SessionContext | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
    const [rankedOptions, setRankedOptions] = useState<string[]>([]);
    const [scaleValues, setScaleValues] = useState<Record<string, number>>({});
    const [versusAnswers, setVersusAnswers] = useState<Record<string, string>>({});
    const [swipedCards, setSwipedCards] = useState<Set<string>>(new Set());
    const [likedCards, setLikedCards] = useState<Set<string>>(new Set());
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
        setSessionContext(null);
        resetInteractiveState();
    };

    const resetInteractiveState = () => {
        setSelectedOptions(new Set());
        setRankedOptions([]);
        setScaleValues({});
        setVersusAnswers({});
        setSwipedCards(new Set());
        setLikedCards(new Set());
    };

    const sendToServer = async (
        content: string,
        interactiveAnswer?: Record<string, unknown>
    ) => {
        setIsLoading(true);

        try {
            const chatHistory = messages
                .filter((m) => m.id !== 'welcome')
                .map((m) => ({
                    role: m.role,
                    content: m.content,
                }));

            if (content.trim()) {
                chatHistory.push({ role: 'user', content: content.trim() });
            }

            const requestBody: Record<string, unknown> = {
                messages: chatHistory,
            };

            if (interactiveAnswer) {
                requestBody.interactiveAnswer = interactiveAnswer;
            }

            if (sessionContext) {
                requestBody.sessionContext = sessionContext;
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.message,
                timestamp: new Date(),
                interactive: data.interactive,
                sessionContext: data.sessionContext,
            };

            setMessages((prev) => [...prev, assistantMessage]);

            if (data.sessionContext) {
                setSessionContext(data.sessionContext);
            }

            resetInteractiveState();
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '😔 Извините, произошла ошибка. Попробуйте ещё раз.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        await sendToServer(content);
    };

    const handleQuickAction = (action: string) => {
        switch (action) {
            case 'start_test':
                sendMessage('Хочу пройти тест на профориентацию');
                break;
            case 'show_universities':
                sendMessage('Покажи университеты Казахстана');
                break;
            case 'open_chat':
                inputRef.current?.focus();
                break;
            case 'restart_test':
                resetChat();
                setTimeout(() => sendMessage('Хочу пройти тест на профориентацию'), 100);
                break;
            default:
                sendMessage(action);
        }
    };

    const handleSingleChoice = (optionId: string, questionId: string) => {
        const option = messages
            .find((m) => m.interactive?.questionId === questionId)
            ?.interactive?.options?.find((o) => o.id === optionId);

        if (option) {
            const userMessage: Message = {
                id: Date.now().toString(),
                role: 'user',
                content: `${option.emoji} ${option.label}`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMessage]);
        }

        const interactiveAnswer = {
            questionId,
            type: 'single_choice',
            selectedOptionIds: [optionId],
        };

        sendToServer('', interactiveAnswer);
    };

    const handleMultipleChoice = (questionId: string) => {
        if (selectedOptions.size === 0) return;

        const selectedArray = Array.from(selectedOptions);
        const options = messages
            .find((m) => m.interactive?.questionId === questionId)
            ?.interactive?.options?.filter((o) => selectedOptions.has(o.id));

        if (options) {
            const userMessage: Message = {
                id: Date.now().toString(),
                role: 'user',
                content: options.map((o) => `${o.emoji} ${o.label}`).join(', '),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMessage]);
        }

        const interactiveAnswer = {
            questionId,
            type: 'multiple_choice',
            selectedOptionIds: selectedArray,
        };

        sendToServer('', interactiveAnswer);
    };

    const handleDragRank = (questionId: string) => {
        if (rankedOptions.length < 4) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: `Мой рейтинг: ${rankedOptions.slice(0, 4).join(' → ')}`,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        const interactiveAnswer = {
            questionId,
            type: 'drag_rank',
            selectedOptionIds: rankedOptions.slice(0, 4),
        };

        sendToServer('', interactiveAnswer);
    };

    const handleSkillBars = (questionId: string, maxPoints: number) => {
        const totalUsed = Object.values(scaleValues).reduce((a, b) => a + b, 0);
        if (totalUsed !== maxPoints) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: `Распределение: ${Object.entries(scaleValues)
                .filter(([, v]) => v > 0)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')}`,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        const interactiveAnswer = {
            questionId,
            type: 'skill_bars',
            scaleValues: scaleValues,
        };

        sendToServer('', interactiveAnswer);
    };

    const handleVersusChoice = (questionId: string) => {
        const options = messages.find((m) => m.interactive?.questionId === questionId)?.interactive?.options || [];
        if (Object.keys(versusAnswers).length < options.length) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: `Мои выборы: ${Object.values(versusAnswers).join(', ')}`,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        const interactiveAnswer = {
            questionId,
            type: 'versus_choice',
            selectedOptionIds: Object.values(versusAnswers),
        };

        sendToServer('', interactiveAnswer);
    };

    const handleSwipeCards = (questionId: string) => {
        const options = messages.find((m) => m.interactive?.questionId === questionId)?.interactive?.options || [];
        if (swipedCards.size < options.length) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: `Интересно: ${Array.from(likedCards).join(', ') || 'ничего'}`,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        const interactiveAnswer = {
            questionId,
            type: 'swipe_cards',
            selectedOptionIds: Array.from(likedCards),
        };

        sendToServer('', interactiveAnswer);
    };

    const handleProfessionSelect = async (professionId: string) => {
        setIsLoading(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/v1/ai/universities/profession/${professionId}`
            );
            const universities = await response.json();

            const profession = messages
                .find((m) => m.interactive?.type === 'profession_results')
                ?.interactive?.professions?.find((p) => p.id === professionId);

            const universityMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `🏛️ **Университеты для профессии "${profession?.name}"**\n\nВот лучшие варианты на основе твоего профиля:`,
                timestamp: new Date(),
                interactive: {
                    type: 'university_cards',
                    questionId: 'universities',
                    question: 'Рекомендованные университеты',
                    description: 'Нажми на университет для подробной информации',
                    options: [],
                    progress: { current: 0, total: 0, stage: '', percentage: 100 },
                    universities: universities,
                    professions: [],
                    scale: { min: 0, max: 0, minLabel: '', maxLabel: '' },
                    scaleItems: [],
                    quickActions: [
                        { id: 'back', label: '← Назад к профессиям', emoji: '←', action: 'back_to_professions' },
                        { id: 'restart', label: '🔄 Новый тест', emoji: '🔄', action: 'restart_test' },
                    ],
                },
            };

            setMessages((prev) => [...prev, universityMessage]);
        } catch (error) {
            console.error('Error fetching universities:', error);
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

    const toggleOption = (optionId: string) => {
        setSelectedOptions((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(optionId)) {
                newSet.delete(optionId);
            } else {
                newSet.add(optionId);
            }
            return newSet;
        });
    };

    const toggleRankedOption = (optionId: string) => {
        setRankedOptions((prev) => {
            if (prev.includes(optionId)) {
                return prev.filter((id) => id !== optionId);
            }
            if (prev.length < 4) {
                return [...prev, optionId];
            }
            return prev;
        });
    };

    const handleScaleChange = (itemId: string, value: number, maxPoints: number) => {
        const currentTotal = Object.entries(scaleValues)
            .filter(([k]) => k !== itemId)
            .reduce((sum, [, v]) => sum + v, 0);

        const maxAllowed = maxPoints - currentTotal;
        const newValue = Math.min(value, maxAllowed);

        setScaleValues((prev) => ({
            ...prev,
            [itemId]: newValue,
        }));
    };

    const handleVersusSelect = (pairId: string, winnerId: string) => {
        setVersusAnswers((prev) => ({
            ...prev,
            [pairId]: winnerId,
        }));
    };

    const handleSwipe = (optionId: string, liked: boolean) => {
        setSwipedCards((prev) => new Set(prev).add(optionId));
        if (liked) {
            setLikedCards((prev) => new Set(prev).add(optionId));
        }
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

    const renderProgressBar = (progress: ProgressInfo) => {
        if (!progress || progress.total === 0) return null;

        return (
            <div className="mb-4 px-1">
                <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {progress.stage}
                    </span>
                    <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3 text-yellow-500" />
                        {progress.current}/{progress.total}
                    </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700 ease-out rounded-full relative"
                        style={{ width: `${progress.percentage}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                    {progress.percentage > 0 && (
                        <Zap
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-2 w-2 text-yellow-400"
                            style={{ left: `calc(${progress.percentage}% - 8px)` }}
                        />
                    )}
                </div>
            </div>
        );
    };

    const renderImageChoice = (interactive: InteractiveElement) => {
        return (
            <div className="space-y-3">
                {renderProgressBar(interactive.progress)}
                <p className="font-semibold text-sm">{interactive.question}</p>
                {interactive.description && (
                    <p className="text-xs text-muted-foreground">{interactive.description}</p>
                )}
                <div className="grid grid-cols-2 gap-2">
                    {interactive.options?.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleSingleChoice(option.id, interactive.questionId)}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 bg-background hover:bg-primary/5 hover:border-primary/50 transition-all text-center group"
                        >
                            <span className="text-3xl group-hover:scale-110 transition-transform">
                                {option.emoji}
                            </span>
                            <div>
                                <div className="font-medium text-xs">{option.label}</div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">
                                    {option.description}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderScenarioChoice = (interactive: InteractiveElement) => {
        return (
            <div className="space-y-3">
                {renderProgressBar(interactive.progress)}
                <p className="font-semibold text-sm">{interactive.question}</p>
                {interactive.description && (
                    <p className="text-xs text-muted-foreground">{interactive.description}</p>
                )}
                <div className="grid gap-2">
                    {interactive.options?.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleSingleChoice(option.id, interactive.questionId)}
                            className="flex items-center gap-3 p-3 rounded-xl border bg-background hover:bg-muted/50 hover:border-primary/50 transition-all text-left group"
                        >
                            <span className="text-2xl">{option.emoji}</span>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm group-hover:text-primary transition-colors">
                                    {option.label}
                                </div>
                                <div className="text-xs text-muted-foreground">{option.description}</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderDragRank = (interactive: InteractiveElement) => {
        return (
            <div className="space-y-3">
                {renderProgressBar(interactive.progress)}
                <p className="font-semibold text-sm">{interactive.question}</p>
                <p className="text-xs text-muted-foreground">{interactive.description}</p>

                {rankedOptions.length > 0 && (
                    <div className="p-2 bg-primary/5 rounded-lg mb-2">
                        <p className="text-xs font-medium mb-2">Твой рейтинг:</p>
                        <div className="flex flex-wrap gap-1">
                            {rankedOptions.map((id, idx) => {
                                const opt = interactive.options?.find((o) => o.id === id);
                                return (
                                    <span
                                        key={id}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-xs"
                                    >
                                        {idx + 1}. {opt?.emoji} {opt?.label}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                    {interactive.options?.map((option) => {
                        const isSelected = rankedOptions.includes(option.id);
                        const position = rankedOptions.indexOf(option.id) + 1;
                        return (
                            <button
                                key={option.id}
                                onClick={() => toggleRankedOption(option.id)}
                                disabled={!isSelected && rankedOptions.length >= 4}
                                className={cn(
                                    'flex items-center gap-2 p-2 rounded-lg border transition-all text-left relative',
                                    isSelected
                                        ? 'bg-primary/10 border-primary'
                                        : 'bg-background hover:bg-muted/50',
                                    !isSelected && rankedOptions.length >= 4 && 'opacity-50'
                                )}
                            >
                                {isSelected && (
                                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-white rounded-full text-xs flex items-center justify-center font-bold">
                                        {position}
                                    </span>
                                )}
                                <span className="text-lg">{option.emoji}</span>
                                <span className="text-xs font-medium">{option.label}</span>
                            </button>
                        );
                    })}
                </div>

                <Button
                    onClick={() => handleDragRank(interactive.questionId)}
                    disabled={rankedOptions.length < 4}
                    className="w-full"
                    size="sm"
                >
                    Подтвердить ({rankedOptions.length}/4)
                </Button>
            </div>
        );
    };

    const renderSkillBars = (interactive: InteractiveElement) => {
        const maxPoints = interactive.question.includes('30') ? 30 : 100;
        const maxPerItem = maxPoints === 30 ? 10 : 50;
        const totalUsed = Object.values(scaleValues).reduce((a, b) => a + b, 0);
        const remaining = maxPoints - totalUsed;

        return (
            <div className="space-y-3">
                {renderProgressBar(interactive.progress)}
                <p className="font-semibold text-sm">{interactive.question}</p>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{interactive.description}</span>
                    <span
                        className={cn(
                            'font-bold px-2 py-0.5 rounded',
                            remaining === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        )}
                    >
                        Осталось: {remaining}
                    </span>
                </div>

                <div className="space-y-3">
                    {interactive.options?.map((item) => {
                        const value = scaleValues[item.id] || 0;
                        return (
                            <div key={item.id} className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span>{item.emoji}</span>
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-primary w-8 text-right">{value}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="range"
                                        min={0}
                                        max={maxPerItem}
                                        value={value}
                                        onChange={(e) =>
                                            handleScaleChange(item.id, parseInt(e.target.value), maxPoints)
                                        }
                                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Button
                    onClick={() => handleSkillBars(interactive.questionId, maxPoints)}
                    disabled={remaining !== 0}
                    className="w-full"
                    size="sm"
                >
                    {remaining === 0 ? 'Подтвердить распределение' : `Распредели ещё ${remaining} очков`}
                </Button>
            </div>
        );
    };

    const renderVersusChoice = (interactive: InteractiveElement) => {
        return (
            <div className="space-y-3">
                {renderProgressBar(interactive.progress)}
                <p className="font-semibold text-sm">{interactive.question}</p>
                <p className="text-xs text-muted-foreground">{interactive.description}</p>

                <div className="space-y-3">
                    {interactive.options?.map((pair) => {
                        const [opt1, opt2] = pair.description.split('|').map((s) => {
                            const [id, label] = s.split(':');
                            return { id, label };
                        });
                        const selected = versusAnswers[pair.id];

                        return (
                            <div key={pair.id} className="flex items-stretch gap-2">
                                <button
                                    onClick={() => handleVersusSelect(pair.id, opt1.id)}
                                    className={cn(
                                        'flex-1 p-3 rounded-lg border-2 transition-all text-sm font-medium',
                                        selected === opt1.id
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-background hover:bg-muted/50 border-muted'
                                    )}
                                >
                                    {opt1.label}
                                </button>
                                <div className="flex items-center px-2 text-xs text-muted-foreground font-bold">VS</div>
                                <button
                                    onClick={() => handleVersusSelect(pair.id, opt2.id)}
                                    className={cn(
                                        'flex-1 p-3 rounded-lg border-2 transition-all text-sm font-medium',
                                        selected === opt2.id
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-background hover:bg-muted/50 border-muted'
                                    )}
                                >
                                    {opt2.label}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <Button
                    onClick={() => handleVersusChoice(interactive.questionId)}
                    disabled={Object.keys(versusAnswers).length < (interactive.options?.length || 0)}
                    className="w-full"
                    size="sm"
                >
                    Продолжить ({Object.keys(versusAnswers).length}/{interactive.options?.length})
                </Button>
            </div>
        );
    };

    const renderSwipeCards = (interactive: InteractiveElement) => {
        const unswipedOptions = interactive.options?.filter((o) => !swipedCards.has(o.id)) || [];
        const currentCard = unswipedOptions[0];

        if (!currentCard) {
            return (
                <div className="space-y-3">
                    {renderProgressBar(interactive.progress)}
                    <div className="text-center py-4">
                        <p className="text-sm font-medium mb-2">Отлично! Ты оценил все сферы</p>
                        <p className="text-xs text-muted-foreground mb-4">
                            Понравилось: {likedCards.size} из {interactive.options?.length}
                        </p>
                        <Button
                            onClick={() => handleSwipeCards(interactive.questionId)}
                            className="w-full"
                            size="sm"
                        >
                            Продолжить
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {renderProgressBar(interactive.progress)}
                <p className="font-semibold text-sm">{interactive.question}</p>
                <p className="text-xs text-muted-foreground text-center">
                    {swipedCards.size + 1} / {interactive.options?.length}
                </p>

                <div className="relative">
                    <div className="p-6 rounded-xl border-2 bg-gradient-to-br from-background to-muted/30 text-center">
                        <span className="text-5xl mb-3 block">{currentCard.emoji}</span>
                        <h4 className="font-bold text-lg mb-1">{currentCard.label}</h4>
                        <p className="text-sm text-muted-foreground">{currentCard.description}</p>
                    </div>

                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={() => handleSwipe(currentCard.id, false)}
                            className="w-14 h-14 rounded-full border-2 border-red-300 bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-all hover:scale-110"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <button
                            onClick={() => handleSwipe(currentCard.id, true)}
                            className="w-14 h-14 rounded-full border-2 border-green-300 bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-500 transition-all hover:scale-110"
                        >
                            <Check className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderFinalScenario = (interactive: InteractiveElement) => {
        return (
            <div className="space-y-3">
                {renderProgressBar(interactive.progress)}
                <p className="font-semibold text-sm">{interactive.question}</p>
                <p className="text-xs text-muted-foreground">{interactive.description}</p>

                <div className="grid grid-cols-2 gap-2">
                    {interactive.options?.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleSingleChoice(option.id, interactive.questionId)}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 bg-gradient-to-br from-background to-muted/20 hover:border-primary/50 hover:shadow-md transition-all text-center group"
                        >
                            <span className="text-4xl group-hover:scale-110 transition-transform">
                                {option.emoji}
                            </span>
                            <div>
                                <div className="font-semibold text-sm">{option.label}</div>
                                <div className="text-[10px] text-muted-foreground mt-1">{option.description}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderMultipleChoice = (interactive: InteractiveElement) => {
        return (
            <div className="space-y-3">
                {renderProgressBar(interactive.progress)}
                <p className="font-semibold text-sm">{interactive.question}</p>
                <p className="text-xs text-muted-foreground">{interactive.description}</p>
                <div className="grid grid-cols-2 gap-2">
                    {interactive.options?.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => toggleOption(option.id)}
                            className={cn(
                                'flex items-center gap-2 p-2.5 rounded-lg border transition-all text-left',
                                selectedOptions.has(option.id)
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'bg-background hover:bg-muted/50'
                            )}
                        >
                            <span className="text-base">{option.emoji}</span>
                            <span className="text-xs font-medium flex-1">{option.label}</span>
                            {selectedOptions.has(option.id) && <Check className="h-3.5 w-3.5" />}
                        </button>
                    ))}
                </div>
                <Button
                    onClick={() => handleMultipleChoice(interactive.questionId)}
                    disabled={selectedOptions.size === 0}
                    className="w-full"
                    size="sm"
                >
                    Продолжить ({selectedOptions.size} выбрано)
                </Button>
            </div>
        );
    };

    const renderProfessionResults = (interactive: InteractiveElement) => {
        return (
            <div className="space-y-3">
                {interactive.professions?.map((profession, index) => (
                    <button
                        key={profession.id}
                        onClick={() => handleProfessionSelect(profession.id)}
                        className={cn(
                            'w-full p-4 rounded-xl border text-left transition-all hover:shadow-md',
                            'bg-background hover:bg-muted/50 hover:border-primary/50',
                            index === 0 && 'ring-2 ring-primary/30 border-primary/50'
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={cn(
                                    'text-3xl p-2 rounded-xl',
                                    index === 0 ? 'bg-primary/10' : 'bg-muted'
                                )}
                            >
                                {profession.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold">{profession.name}</span>
                                    <span
                                        className={cn(
                                            'text-sm font-bold px-2 py-0.5 rounded-full',
                                            profession.matchPercent >= 80
                                                ? 'bg-green-100 text-green-700'
                                                : profession.matchPercent >= 60
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-orange-100 text-orange-700'
                                        )}
                                    >
                                        {profession.matchPercent}%
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                    {profession.description}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Briefcase className="h-3 w-3" />
                                        {profession.salaryRange}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        {profession.demandLevel}
                                    </span>
                                </div>
                                {index === 0 && (
                                    <div className="mt-2 pt-2 border-t">
                                        <div className="flex flex-wrap gap-1">
                                            {profession.skills?.slice(0, 4).map((skill) => (
                                                <span key={skill} className="px-2 py-0.5 bg-muted rounded text-[10px]">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                        </div>
                    </button>
                ))}
            </div>
        );
    };

    const renderUniversityCards = (interactive: InteractiveElement) => {
        return (
            <div className="space-y-3">
                {interactive.universities?.map((uni, index) => (
                    <div
                        key={uni.id}
                        className={cn(
                            'p-3 rounded-xl border bg-background',
                            index === 0 && 'ring-2 ring-primary/20'
                        )}
                    >
                        <div className="flex gap-3">
                            <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                                {uni.photoUrl ? (
                                    <img src={uni.photoUrl} alt={uni.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <GraduationCap className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold text-sm line-clamp-1">{uni.name}</h4>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {uni.city}
                                            </span>
                                            {uni.foundedYear && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {uni.foundedYear}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                                        <Star className="h-3 w-3 text-primary fill-primary" />
                                        <span className="text-xs font-bold text-primary">{uni.matchScore}%</span>
                                    </div>
                                </div>
                                {uni.matchingPrograms && uni.matchingPrograms.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {uni.matchingPrograms.slice(0, 3).map((program) => (
                                            <span key={program} className="px-1.5 py-0.5 bg-muted rounded text-[10px]">
                                                {program}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => window.open(`/universities/${uni.id}`, '_blank')}
                        >
                            Подробнее об университете
                        </Button>
                    </div>
                ))}
            </div>
        );
    };

    const renderQuickActions = (actions: QuickAction[]) => {
        if (!actions || actions.length === 0) return null;

        return (
            <div className="flex flex-wrap gap-2 mt-3">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={() => handleQuickAction(action.action)}
                        className="px-3 py-1.5 text-xs bg-muted hover:bg-primary/10 hover:text-primary rounded-full transition-colors border border-transparent hover:border-primary/30"
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        );
    };

    const renderInteractive = (interactive: InteractiveElement) => {
        if (!interactive) return null;

        switch (interactive.type) {
            case 'image_choice':
                return renderImageChoice(interactive);
            case 'scenario_choice':
                return renderScenarioChoice(interactive);
            case 'drag_rank':
                return renderDragRank(interactive);
            case 'skill_bars':
            case 'budget_allocation':
                return renderSkillBars(interactive);
            case 'versus_choice':
                return renderVersusChoice(interactive);
            case 'swipe_cards':
                return renderSwipeCards(interactive);
            case 'final_scenario':
                return renderFinalScenario(interactive);
            case 'single_choice':
                return renderScenarioChoice(interactive);
            case 'multiple_choice':
                return renderMultipleChoice(interactive);
            case 'profession_results':
                return (
                    <>
                        {renderProfessionResults(interactive)}
                        {renderQuickActions(interactive.quickActions)}
                    </>
                );
            case 'university_cards':
                return (
                    <>
                        {renderUniversityCards(interactive)}
                        {renderQuickActions(interactive.quickActions)}
                    </>
                );
            case 'quick_actions':
                return renderQuickActions(interactive.quickActions);
            default:
                return null;
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className={cn(
                    'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg',
                    'bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white',
                    'transition-all duration-300 hover:scale-110',
                    isOpen && 'hidden'
                )}
                size="icon"
                aria-label="Открыть чат с AI помощником"
            >
                <MessageCircle className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500" />
                </span>
            </Button>

            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[650px] max-h-[85vh] max-w-[calc(100vw-48px)] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">AI Профориентатор</h3>
                                <p className="text-xs text-white/80">Найди свою профессию</p>
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
                                className={cn('flex gap-3', message.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                            >
                                <div
                                    className={cn(
                                        'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                                        message.role === 'user' ? 'bg-primary text-white' : 'bg-muted'
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
                                        'max-w-[85%] rounded-2xl text-sm',
                                        message.role === 'user'
                                            ? 'bg-primary text-white rounded-br-md px-4 py-2.5'
                                            : 'bg-muted rounded-bl-md px-4 py-2.5'
                                    )}
                                >
                                    <div className="whitespace-pre-wrap break-words">
                                        {formatMessage(message.content)}
                                    </div>
                                    {message.interactive && (
                                        <div className="mt-3 pt-3 border-t border-border/50">
                                            {renderInteractive(message.interactive)}
                                        </div>
                                    )}
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
                                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

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
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 text-center">
                            AI может ошибаться • Проверяйте важную информацию
                        </p>
                    </form>
                </div>
            )}
        </>
    );
}
