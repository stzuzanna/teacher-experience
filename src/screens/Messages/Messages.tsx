import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ChevronLeftIcon, SendIcon, SearchIcon, ImageIcon, Sparkles } from "lucide-react";
import { BASE_PATH } from "../../constants";
import { BottomNavBar } from "../../components/BottomNavBar";
import { DeviceContainer } from "../../components/DeviceContainer";

interface Message {
  id: string;
  sender: 'olivia' | 'sandra' | 'claire' | 'michael' | 'sarah';
  content: string;
  spanishContent?: string;
  timestamp: string;
  isTranslated?: boolean;
  senderName?: string;
  senderRole?: string;
  avatar?: string;
}

interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp?: string;
  avatar: string;
  isGroup?: boolean;
  unreadCount?: number;
}

const chats: Chat[] = [
  {
    id: '1',
    title: 'Claire Potter (Manager)',
    lastMessage: 'Holiday request sent — could you take a quick look? 😊',
    timestamp: 'Today 9:20am',
    avatar: `${BASE_PATH}/frame-12.png`,
    unreadCount: 1
  },
  {
    id: '2',
    title: 'Teacher Team',
    lastMessage: "Open shift tomorrow — Michael and Sarah have it covered. Thanks!",
    timestamp: 'Today 9:25am',
    avatar: `${BASE_PATH}/frame-12.png`,
    isGroup: true,
    unreadCount: 2
  }
];

const individualChatMessages: Message[] = [
  {
    id: '0',
    sender: 'sandra',
    content: 'Hi Claire, could I take Thursday and Friday off next week? Family trip planned. ',
    spanishContent: 'Hola Claire, ¿podría tomarme libre el jueves y viernes de la próxima semana? Tenemos un viaje familiar. ',
    timestamp: 'Yesterday 3:10pm',
    isTranslated: true
  },
  {
    id: '0.5',
    sender: 'claire',
    senderName: 'Claire Potter',
    senderRole: 'Manager',
    avatar: `${BASE_PATH}/frame-12.png`,
    content: "Thanks for the heads‑up! Please submit the holiday request in the app and I'll approve it.",
    spanishContent: '¡Gracias por avisar! Por favor envía la solicitud de vacaciones en la app y la aprobaré.',
    timestamp: 'Yesterday 3:15pm',
    isTranslated: true
  },
  {
    id: '1',
    sender: 'sandra',
    content: 'Submitted now. Do you need me to find cover for my shift?',
    spanishContent: 'Listo. ¿Necesitas que busque a alguien que cubra mi turno?',
    timestamp: 'Today 9:12am',
    isTranslated: true
  },
  {
    id: '2',
    sender: 'claire',
    senderName: 'Claire Potter',
    senderRole: 'Manager',
    avatar: `${BASE_PATH}/frame-12.png`,
    content: "Appreciate it! I've posted in the teacher group for a cover on Thu 8–4. I'll confirm shortly.",
    spanishContent: '¡Gracias! He publicado en el grupo de profesores para cubrir el jueves de 8–16. Confirmo en breve.',
    timestamp: 'Today 9:20am',
    isTranslated: true
  }
];

const groupChatMessages: Message[] = [
  {
    id: '1',
    sender: 'claire',
    senderName: 'Claire Potter',
    senderRole: 'Manager',
    avatar: `${BASE_PATH}/frame-12.png`,
    content: 'Open shift tomorrow (Thu) 8:00–16:00 in Bunnies Room. Overtime approved — who can cover?',
    spanishContent: 'Turno disponible mañana (jue) 8:00–16:00 en Bunnies. Horas extra aprobadas — ¿quién puede cubrir?',
    timestamp: 'Today 9:05am',
    isTranslated: true
  },
  {
    id: '2',
    sender: 'michael',
    senderName: 'Michael Johnson',
    content: 'I can cover 8–12 if someone can take the afternoon.',
    spanishContent: 'Puedo cubrir de 8–12 si alguien toma la tarde.',
    timestamp: 'Today 9:08am',
    isTranslated: true
  },
  {
    id: '3',
    sender: 'sarah',
    senderName: 'Sarah Martinez',
    content: 'I can do 12–16. Happy to split with Michael.',
    spanishContent: 'Puedo hacer 12–16. Feliz de dividir con Michael.',
    timestamp: 'Today 9:10am',
    isTranslated: true
  },
  {
    id: '4',
    sender: 'olivia',
    senderName: 'Olivia Wilson',
    content: 'If needed, I can take the full shift. Just let me know!',
    spanishContent: 'Si hace falta, puedo tomar el turno completo. ¡Decidme!',
    timestamp: 'Today 9:12am',
    isTranslated: true
  },
  {
    id: '5',
    sender: 'claire',
    senderName: 'Claire Potter',
    senderRole: 'Manager',
    avatar: `${BASE_PATH}/frame-12.png`,
    content: 'Thanks team! Michael (8–12) and Sarah (12–16) confirmed. Olivia, please stay on standby in case plans change.',
    spanishContent: '¡Gracias equipo! Michael (8–12) y Sarah (12–16) confirmados. Olivia, quédate en reserva por si cambia algo.',
    timestamp: 'Today 9:18am',
    isTranslated: true
  }
];

interface MessagesProps {
  onNavigateBack: () => void;
  activeNavItem: string;
  onNavClick: (item: string) => void;
  embedded?: boolean;
}

export const Messages: React.FC<MessagesProps> = ({ 
  onNavigateBack, 
  activeNavItem, 
  onNavClick,
  embedded = false
}) => {
  const [currentView, setCurrentView] = useState<'list' | 'chat'>('list');
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Record<string, Message[]>>({
    '1': individualChatMessages,
    '2': groupChatMessages,
  });
  const [translatedMessages, setTranslatedMessages] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sidekickOpen, setSidekickOpen] = useState(false);
  const sidekickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!sidekickRef.current) return;
      if (!sidekickRef.current.contains(e.target as Node)) setSidekickOpen(false);
    };
    if (sidekickOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [sidekickOpen]);

  // Initialize messages when opening a chat
  useEffect(() => {
    if (currentView === 'chat' && activeChatId) {
      setMessages(conversations[activeChatId] || []);
    }
  }, [currentView, activeChatId, conversations]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChatClick = (chatId: string) => {
    setActiveChatId(chatId);
    setCurrentView('chat');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const count = files.length;
    const description = count === 1 ? `Sent a photo: ${files[0].name}` : `Sent ${count} photos`;
    const newMsg: Message = {
      id: (Date.now() + 2).toString(),
      sender: 'sandra',
      content: description,
      spanishContent: description,
      timestamp: getCurrentTime(),
      isTranslated: true
    };
    setMessages(prev => [...prev, newMsg]);
    setConversations(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));
    // reset input so the same file can be selected again
    e.target.value = '';
  };

  const ensureSentence = (t: string) => {
    const trimmed = t.trim();
    if (!trimmed) return "";
    const cap = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return /[.!?]$/.test(cap) ? cap : cap + ".";
  };

  const correctGrammarAndSpelling = (raw: string) => {
    let t = raw || "";
    // common misspellings
    const fixes: Array<[RegExp, string]> = [
      [/\bteh\b/gi, "the"],
      [/\brecieve\b/gi, "receive"],
      [/\bseperat(e|ed|ing|es)\b/gi, "separat$1"],
      [/\baccomodate\b/gi, "accommodate"],
      [/\bdefinately\b/gi, "definitely"],
      [/\balot\b/gi, "a lot"],
      [/\boccured\b/gi, "occurred"],
      [/\bavailible\b/gi, "available"],
      [/\bavailabl(e|ity)\b/gi, "available$1"],
      [/\btmrw\b/gi, "tomorrow"],
      [/\btmr\b/gi, "tomorrow"],
      [/\bpls\b/gi, "please"],
      [/\bplz\b/gi, "please"],
      [/\bthx\b/gi, "thanks"],
      [/\bur\b/gi, "your"],
      [/\bu\b/gi, "you"],
      [/\bwanna\b/gi, "want to"],
      [/\bgonna\b/gi, "going to"],
    ];
    fixes.forEach(([repl, val]) => (t = t.replace(repl, val)));

    // basic contractions & capitalization of I
    const contractions: Array<[RegExp, string]> = [
      [/\bim\b/gi, "I'm"],
      [/\bi\s+am\b/gi, "I am"],
      [/\bdont\b/gi, "don't"],
      [/\bcant\b/gi, "can't"],
      [/\bwont\b/gi, "won't"],
      [/\bdoesnt\b/gi, "doesn't"],
      [/\bdidnt\b/gi, "didn't"],
      [/\bshouldnt\b/gi, "shouldn't"],
      [/\bcouldnt\b/gi, "couldn't"],
      [/\bwasnt\b/gi, "wasn't"],
      [/\bwerent\b/gi, "weren't"],
      [/\bisnt\b/gi, "isn't"],
      [/\barent\b/gi, "aren't"],
    ];
    contractions.forEach(([repl, val]) => (t = t.replace(repl, val)));
    // uppercase standalone i pronoun
    t = t.replace(/(^|\s)i(\s)/g, (m, p1, p2) => `${p1}I${p2}`);

    // Collapse spaces
    t = t.replace(/\s{2,}/g, " ").trim();

    // Sentence casing and punctuation ending
    const sentences = t
      .split(/([.!?])\s+/)
      .reduce<string[]>((acc, part, idx, arr) => {
        if (!part) return acc;
        if (/[.!?]/.test(part) && acc.length) {
          acc[acc.length - 1] += part;
        } else {
          const s = part.trim();
          if (!s) return acc;
          const c = s.charAt(0).toUpperCase() + s.slice(1);
          acc.push(c);
        }
        return acc;
      }, []);
    t = sentences.join(" ");
    if (t && !/[.!?]$/.test(t)) t += ".";
    return t;
  };

  const sidekickApply = (kind: string) => {
    let text = newMessage;
    switch (kind) {
      case 'conversational':
        text = ensureSentence(text);
        text = text.replace(/^Dear\b/i, "Hi");
        if (!/\p{Emoji}/u.test(text)) text += " 🙂";
        break;
      case 'grammar':
        text = correctGrammarAndSpelling(text);
        break;
      case 'simpler':
        text = ensureSentence(text)
          .replace(/\b(very|really|just|kind of|sort of)\b/gi, "")
          .replace(/\s{2,}/g, " ");
        if (text.length > 120) text = text.slice(0, 117).trimEnd() + "...";
        break;
      case 'descriptive':
        text = ensureSentence(text) + " (including time, room, and any actions needed)";
        break;
      case 'polite':
        text = ensureSentence(text);
        if (!/please/i.test(text)) text = "Please " + text.charAt(0).toLowerCase() + text.slice(1);
        if (!/thank/i.test(text)) text += " Thank you!";
        break;
      case 'professional':
        text = ensureSentence(text).replace(/[🙂😀👍✨]/g, "");
        break;
      case 'shorter':
        text = text.trim();
        if (text.length > 80) text = text.slice(0, 77).trimEnd() + "...";
        break;
      default:
        break;
    }
    // Always run a final quick grammar/spelling pass to ensure robustness
    text = correctGrammarAndSpelling(text);
    setNewMessage(text);
    setSidekickOpen(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setActiveChatId('');
    setMessages([]);
    setTranslatedMessages(new Set());
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `Today ${displayHours}:${displayMinutes}${ampm}`;
  };

  const translateToSpanish = (text: string): string => {
    const translations: Record<string, string> = {
      "Thanks for letting me know!": "¡Gracias por avisarme!",
      "I'll take care of that right away.": "Me encargaré de eso de inmediato.",
      "Perfect, see you soon!": "¡Perfecto, nos vemos pronto!",
      "Got it, thanks! 😊": "¡Entendido, gracias! 😊",
      "No problem at all!": "¡No hay problema!",
      "I appreciate the update.": "Agradezco la actualización.",
      "Okay, I'll be right there.": "Está bien, estaré allí enseguida.",
      "Thank you for the information.": "Gracias por la información.",
      "Sounds good!": "¡Suena bien!",
      "Will do!": "¡Lo haré!"
    };
    return translations[text] || text;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: 'sandra',
        content: newMessage.trim(),
        spanishContent: translateToSpanish(newMessage.trim()),
        timestamp: getCurrentTime(),
        isTranslated: false
      };
      
      setMessages(prev => [...prev, newMsg]);
      setConversations(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), newMsg],
      }));
      setNewMessage('');
      
      // Simulate a response for manager chat
      if (activeChatId === '1') {
        setTimeout(() => {
          const responses = [
            'Approved — thanks for submitting.',
            "Noted. I’ll confirm cover and update you shortly.",
            'Thanks — enjoy your time off!',
            'Received. Please make sure your handover is in the logbook.',
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          const responseMsg: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'claire',
            content: randomResponse,
            spanishContent: translateToSpanish(randomResponse),
            timestamp: getCurrentTime(),
            isTranslated: false
          };
          
          setMessages(prev => [...prev, responseMsg]);
          setConversations(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), responseMsg],
          }));
        }, 1000 + Math.random() * 2000);
      }
    }
  };

  const toggleTranslation = (messageId: string) => {
    setTranslatedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const currentChat = chats.find(chat => chat.id === activeChatId);

  if (currentView === 'chat' && currentChat) {
    // Individual Chat View
    const chatContent = (
      <>
        {/* Chat Header */}
        <header className="bg-[#6b46c1] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToList}
            className="w-6 h-6 p-0 text-white hover:bg-white/20"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Button>

          <h1 className="text-white font-medium text-lg">
            {currentChat.title}
          </h1>

          <div className="w-6 h-6" />
        </header>

        {/* Chat Messages */}
        <main className="flex flex-col flex-1 overflow-y-auto bg-gray-50 px-6 py-4 gap-4 pb-20">
            <div className="flex flex-col gap-6">
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col gap-2">
                  {/* Sender Info - only show for other people's messages */}
                  {message.sender !== 'sandra' && (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage 
                          src={message.avatar || (message.sender === 'olivia' ? "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400" : `${BASE_PATH}/avatar-2.png`)} 
                          alt={message.senderName || (message.sender === 'olivia' ? "Olivia Wilson" : "Sandra A.")} 
                        />
                        <AvatarFallback>
                          {message.senderName ? message.senderName.split(' ').map(n => n[0]).join('') : (message.sender === 'olivia' ? 'OW' : 'SA')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 text-sm">
                          {message.senderName || (message.sender === 'olivia' ? 'Olivia Wilson' : 'You')}
                        </span>
                        {message.senderRole && (
                          <span className="text-xs text-gray-500">
                            {message.senderRole}
                          </span>
                        )}
                        {!message.senderRole && message.sender === 'olivia' && (
                          <span className="text-xs text-gray-500">
                            Employee (Bunnies Room)
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className={`max-w-[280px] p-3 rounded-2xl ${
                    message.sender === 'sandra'
                      ? 'bg-[#6b46c1] text-white ml-auto rounded-br-md' 
                      : 'bg-white text-gray-700 rounded-bl-md shadow-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">
                      {translatedMessages.has(message.id) && message.spanishContent 
                        ? message.spanishContent 
                        : message.content}
                    </p>
                  </div>

                  {/* Timestamp and Translation */}
                  <div className={`flex items-center gap-2 ${message.sender === 'sandra' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-gray-500">
                      {message.timestamp}
                    </span>
                    {message.spanishContent && (
                      <button
                        onClick={() => toggleTranslation(message.id)}
                        className="text-xs text-[#6b46c1] hover:underline cursor-pointer"
                      >
                        {translatedMessages.has(message.id) ? 'Original' : 'Traducir'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
        </main>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0 mb-16">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFilesSelected}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="h-10 px-3 rounded-full text-sm"
              onClick={handleUploadClick}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Upload
            </Button>

            {/* Sidekick */}
            <div className="relative" ref={sidekickRef}>
              <Button
                type="button"
                variant="outline"
                className="h-10 px-3 rounded-full text-sm"
                onClick={() => setSidekickOpen((v) => !v)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Sidekick
              </Button>
              {sidekickOpen && (
                <div className="absolute bottom-12 left-0 w-72 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b">Change your message with Sidekick</div>
                  {[
                    { id: 'conversational', label: 'Make it conversational' },
                    { id: 'grammar', label: 'Correct grammar and spelling' },
                    { id: 'simpler', label: 'Make it simpler' },
                    { id: 'descriptive', label: 'Make it descriptive' },
                    { id: 'polite', label: 'Make it polite' },
                    { id: 'professional', label: 'Make it professional' },
                    { id: 'shorter', label: 'Make it shorter' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => sidekickApply(opt.id)}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                    >
                      {opt.label}
                    </button>
                  ))}
                  <div className="px-4 py-2 text-[11px] text-gray-500 border-t">Don’t include sensitive information when using Sidekick.</div>
                </div>
              )}
            </div>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="pr-10 h-10 bg-gray-100 border-0 rounded-full text-sm"
                ref={inputRef}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 w-8 h-8 bg-[#6b46c1] hover:bg-[#6b46c1]/90 rounded-full"
                disabled={!newMessage.trim()}
              >
                <SendIcon className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Bottom Navigation - fixed over content */}
        <div className="absolute bottom-0 left-0 right-0">
          <BottomNavBar 
            activeItem={activeNavItem}
            onItemClick={onNavClick}
          />
        </div>
      </>
    );
    if (embedded) return chatContent;
    return (
      <DeviceContainer>
        {chatContent}
      </DeviceContainer>
    );
  }

  // Messages List View
  const listContent = (
    <>
      {/* Purple Header */}
      <header className="bg-[#6b46c1] px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-4">
            <div className="w-6 h-6 bg-[#6b46c1] rounded-sm"></div>
          </div>
          <h1 className="text-white font-medium text-lg">Messages</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <SearchIcon className="w-5 h-5" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback className="bg-white text-[#6b46c1] text-sm">U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Messages List */}
      <main className="flex flex-col flex-1 overflow-y-auto px-6 py-4 gap-4 pb-20">
        <div className="divide-y divide-gray-200">
          {chats.map((chat) => {
            const conv = conversations[chat.id] || [];
            const last = conv[conv.length - 1];
            const preview = last ? last.content : chat.lastMessage || '';
            const time = last ? last.timestamp : chat.timestamp || '';
            return (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat.id)}
                className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={chat.avatar} alt={chat.title} />
                    <AvatarFallback>{chat.title.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {chat.unreadCount && chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {chat.title}
                      {chat.isGroup && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          Group
                        </span>
                      )}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {preview}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar 
        activeItem={activeNavItem}
        onItemClick={onNavClick}
      />
    </>
  );
  if (embedded) return listContent;
  return (
    <DeviceContainer>
      {listContent}
    </DeviceContainer>
  );
};
