import React, { useEffect, useRef, useState } from "react";
import { 
  SearchIcon, 
  ImageIcon, 
  EyeIcon, 
  ActivityIcon,
  BarChart3Icon,
  ChevronDownIcon,
  XIcon,
  Trash2Icon,
  UsersIcon,
  Sparkles
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useToast } from "../../contexts/ToastContext";
import { BottomNavBar } from "../../components/BottomNavBar";
import { ReusableNewsfeed, Post } from "../../components/ReusableNewsfeed";
import { DeviceContainer } from "../../components/DeviceContainer";

interface NewsFeedProps {
  onNavigateBack: () => void;
  activeNavItem: string;
  onNavClick: (item: string) => void;
  embedded?: boolean;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ 
  onNavigateBack, 
  activeNavItem, 
  onNavClick,
  embedded = false
}) => {
  const [activePostTab, setActivePostTab] = useState("Media");

  // Custom posts for the teacher experience
  const customPosts: Post[] = [
    {
      id: "explorers-photo",
      kind: "photo",
      authorName: "Little Explorers",
      authorAvatarUrl: "/avatar-4.png", 
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      imageUrl: "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=960&h=640&dpr=2",
      caption: "Today we had a great time enjoying some sun in the garden"
    },
    {
      id: "birthday-post",
      kind: "text",
      authorName: "Little Explorers",
      authorAvatarUrl: "/avatar-4.png",
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      content: "Happy birthday Ms. Jenkins! 🎉 We hope you have a wonderful day!"
    },
    {
      id: "halloween-poll",
      kind: "poll",
      authorName: "Little Explorers",
      authorAvatarUrl: "/avatar-4.png",
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      question: "Which day works best for the Halloween party?",
      options: [
        { id: "thursday", text: "Thursday", votes: 8 },
        { id: "friday", text: "Friday", votes: 15 },
        { id: "monday", text: "Monday", votes: 3 }
      ],
      multiple: false
    },
    {
      id: "parent-teacher-conference",
      kind: "event",
      authorName: "Little Explorers",
      authorAvatarUrl: "/avatar-4.png",
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      title: "Parent teacher conference",
      eventDateText: "Thu, 4th Sep 11:30am",
      rsvpByText: "Wed, 3rd Sep",
      groupsText: "Explorers (Staff), Explorers (Children)",
      statsText: "0 adults, 50 no reply",
      recipientsText: "Recipients: Sandbox Childcare"
    }
  ];

  // Composer state and dynamic posts
  const [showComposer, setShowComposer] = useState(false);
  const [composerText, setComposerText] = useState("");
  const [composerTab, setComposerTab] = useState<"Media" | "Activity">("Media");
  const [composerImageUrl, setComposerImageUrl] = useState("");
  const [recipients, setRecipients] = useState<string[]>(["Toddlers"]);
  const [posts, setPosts] = useState<Post[]>(customPosts);
  const [showDummyPicker, setShowDummyPicker] = useState(false);
  const [showRecipientPicker, setShowRecipientPicker] = useState(false);
  const recipientDropdownRef = useRef<HTMLDivElement | null>(null);
  const draftsAnchorRef = useRef<HTMLDivElement | null>(null);
  const draftsDropdownRef = useRef<HTMLDivElement | null>(null);
  const [showDrafts, setShowDrafts] = useState(false);
  const sidekickRef = useRef<HTMLDivElement | null>(null);
  const [sidekickOpen, setSidekickOpen] = useState(false);
  const composerTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [sidekickLoading, setSidekickLoading] = useState(false);
  const [sidekickError, setSidekickError] = useState<string | null>(null);
  const { showError, showInfo } = useToast();

  const dummyImages: string[] = [
    "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=960&h=640&dpr=2",
    "https://images.pexels.com/photos/8422171/pexels-photo-8422171.jpeg?auto=compress&cs=tinysrgb&w=960&h=640&dpr=2",
    "https://images.pexels.com/photos/3661393/pexels-photo-3661393.jpeg?auto=compress&cs=tinysrgb&w=960&h=640&dpr=2",
    "https://images.pexels.com/photos/8422158/pexels-photo-8422158.jpeg?auto=compress&cs=tinysrgb&w=960&h=640&dpr=2",
    "https://images.pexels.com/photos/8422100/pexels-photo-8422100.jpeg?auto=compress&cs=tinysrgb&w=960&h=640&dpr=2",
    "https://images.pexels.com/photos/3662840/pexels-photo-3662840.jpeg?auto=compress&cs=tinysrgb&w=960&h=640&dpr=2"
  ];

  const recipientOptions: { id: string; label: string; count: number; subtitle: string; avatar?: string; initials?: string; bgColor?: string; textColor?: string }[] = [
    { id: 'all-children', label: 'All children', count: 50, subtitle: '50 children', avatar: '/avatar-1.png' },
    { id: 'infants', label: 'Infants', count: 12, subtitle: '12 children', initials: 'I', bgColor: 'bg-[#f6f1fd]', textColor: 'text-[#4e169c]' },
    { id: 'toddlers', label: 'Toddlers', count: 20, subtitle: '20 children', initials: 'T', bgColor: 'bg-[#efe7ff]', textColor: 'text-[#6b46c1]' },
    { id: 'all-staff', label: 'All staff', count: 8, subtitle: '8 staff' },
  ];

  type Draft = { id: string; to: string; text: string; createdAt: Date };
  const initialDrafts: Draft[] = [
    { id: 'd1', to: 'All children', text: 'Reminder: Please bring a labeled water bottle tomorrow for outdoor play.', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000) },
    { id: 'd2', to: 'Toddlers', text: 'We are exploring colors this week. If you have any spare magazines for collages, please send them in.', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000 + 31 * 60 * 1000) },
    { id: 'd3', to: 'All staff', text: 'Staff meeting Friday 8:00am in the common room. Agenda: safety drill, curriculum updates.', createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) },
    { id: 'd4', to: 'Infants', text: 'Sleep logs will be sent at pickup. Please let us know if you want extra bibs kept here.', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000 + 43 * 60 * 1000) },
  ];
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);

  const formatDraftTime = (d: Date) => {
    try {
      return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).replace(',', '');
    } catch {
      return '';
    }
  };

  // Map Sidekick options to instruction prompts for AI
  const getSidekickInstruction = (kind: string) => {
    switch (kind) {
      case 'grammar':
        return 'Correct grammar and spelling in this text.';
      case 'simpler':
        return 'Rewrite this text in simpler language.';
      case 'descriptive':
        return 'Make this text more descriptive.';
      case 'polite':
        return 'Make this text more polite.';
      case 'professional':
        return 'Make this text sound professional.';
      case 'shorter':
        return 'Make this text more concise.';
      case 'conversational':
      default:
        return 'Rewrite this text to sound conversational and friendly for parents.';
    }
  };

  // Call OpenAI (or use a graceful local fallback if not configured)
  const callAI = async (instruction: string, content: string): Promise<string> => {
    const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY as string | undefined;
    if (!apiKey) {
      // Fallback locally and inform the user
      showInfo('AI not configured. Applied a basic local improvement.');
      return correctGrammarAndSpelling(content);
    }
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful writing assistant for teachers writing short updates to parents or staff. Return only the revised text, no explanations.' },
            { role: 'user', content: `${instruction}\n\nText:\n${content}` }
          ],
          temperature: 0.2,
        })
      });
      if (!res.ok) throw new Error(`AI request failed (${res.status})`);
      const data = await res.json();
      const out = data?.choices?.[0]?.message?.content?.trim();
      if (!out) throw new Error('Empty AI response');
      return out;
    } catch (e) {
      showError('Sidekick failed. Please try again.');
      throw e;
    }
  };

  // Sidekick helpers (mirrored from Messages)
  const ensureSentence = (t: string) => {
    const trimmed = (t || '').trim();
    if (!trimmed) return "";
    const cap = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return /[.!?]$/.test(cap) ? cap : cap + ".";
  };

  const correctGrammarAndSpelling = (raw: string) => {
    let t = raw || "";
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
    t = t.replace(/(^|\s)i(\s)/g, (m, p1, p2) => `${p1}I${p2}`);
    t = t.replace(/\s{2,}/g, " ").trim();

    const sentences = t
      .split(/([.!?])\s+/)
      .reduce<string[]>((acc, part) => {
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

  const sidekickApply = async (kind: string) => {
    if (sidekickLoading) return;
    const current = composerText;
    if (!current.trim()) { setSidekickOpen(false); return; }
    setSidekickError(null);
    setSidekickLoading(true);
    try {
      const instruction = getSidekickInstruction(kind);
      const aiText = await callAI(instruction, current);
      setComposerText(aiText);
    } catch {
      setSidekickError('Unable to apply Sidekick right now.');
    } finally {
      setSidekickLoading(false);
      setSidekickOpen(false);
      setTimeout(() => composerTextareaRef.current?.focus(), 0);
    }
  };

  // Close recipient dropdown on outside click
  useEffect(() => {
    if (!showRecipientPicker) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (recipientDropdownRef.current && target && !recipientDropdownRef.current.contains(target)) {
        setShowRecipientPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showRecipientPicker]);

  // Close drafts dropdown on outside click
  useEffect(() => {
    if (!showDrafts) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node | null;
      const inAnchor = draftsAnchorRef.current && target && draftsAnchorRef.current.contains(target);
      const inDropdown = draftsDropdownRef.current && target && draftsDropdownRef.current.contains(target);
      if (!inAnchor && !inDropdown) setShowDrafts(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDrafts]);

  // Close sidekick on outside click
  useEffect(() => {
    if (!sidekickOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (sidekickRef.current && target && !sidekickRef.current.contains(target)) {
        setSidekickOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [sidekickOpen]);

  // On Newsfeed we ignore the global add (drawer handled centrally in RoomOverview)

  const postTabs = [
    { id: "Media", icon: ImageIcon, label: "Media" },
    { id: "Activity", icon: ActivityIcon, label: "Activity" }
  ];

  const content = (
    <>
      {/* Purple Header closer to screenshot */}
        <header className="bg-[#6b46c1] px-4 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-[#6b46c1] rounded-sm" />
            </div>
            <span className="font-medium">Newsfeed</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <SearchIcon className="w-5 h-5" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback className="bg-white text-[#6b46c1] text-sm">U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Removed "My news" profile section */}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20">
          
          {/* Post Creation Section (card style like screenshot) */}
          <div className="py-6 bg-transparent flex justify-center">
            <div className="w-full max-w-[600px] mx-auto">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
                <button type="button" onClick={() => setShowComposer(true)} className="w-full text-left">
                  <div className="flex items-center">
                    <span className="text-[17px] text-gray-700">Start a new post</span>
                  </div>
                </button>
                <div className="h-px bg-gray-200 my-4" />
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="ghost"
                    className="justify-center gap-2 py-3 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowDummyPicker(true)}
                  >
                    <ImageIcon className="w-5 h-5" />
                    Media
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-center gap-2 py-3 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowComposer(true)}
                  >
                    <ActivityIcon className="w-5 h-5" />
                    Activity
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Newsfeed Component */}
          <ReusableNewsfeed 
            initialPosts={posts}
            allowComments={true}
            allowReactions={true}
            allowPollVoting={true}
            className="flex-1"
          />
          {showComposer && (
            <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center">
              <div className="w-full max-w-[720px] bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header row */}
                <div className="flex items-center justify-between px-5 py-3 border-b">
                  <div className="flex items-center gap-2 text-gray-800">
                    <Avatar className="w-8 h-8"><AvatarImage src="/avatar.png" /><AvatarFallback>U</AvatarFallback></Avatar>
                    <span className="font-medium">Susannah Sta</span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex items-center gap-3" ref={draftsAnchorRef}>
                    <div className="relative">
                      <Button variant="outline" className="h-8 px-3 text-sm" onClick={()=> setShowDrafts(s=>!s)}>Drafts</Button>
                      {showDrafts && (
                        <div ref={draftsDropdownRef} className="absolute right-0 mt-2 w-[420px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
                          <div className="max-h-[360px] overflow-auto">
                            {drafts.map((d)=> (
                              <div key={d.id} className="flex items-start gap-3 px-4 py-3 border-b last:border-0 hover:bg-gray-50">
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-gray-500 mb-1 flex items-center justify-between">
                                    <span>To: <span className="font-medium text-gray-700">{d.to}</span></span>
                                    <span>{formatDraftTime(d.createdAt)}</span>
                                  </div>
                                  <button type="button" onClick={()=>{ setComposerText(d.text); setRecipients([d.to]); setShowDrafts(false); }} className="block text-left text-[15px] text-gray-800 truncate">
                                    {d.text}
                                  </button>
                                </div>
                                <button aria-label="Delete draft" onClick={()=> setDrafts(prev => prev.filter(x=>x.id!==d.id))} className="p-2 text-gray-400 hover:text-gray-600">
                                  <Trash2Icon className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            {drafts.length===0 && (
                              <div className="px-4 py-6 text-sm text-gray-500 text-center">No drafts</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <button aria-label="Close" onClick={()=>setShowComposer(false)} className="p-2 text-gray-500 hover:text-gray-700"><XIcon className="w-5 h-5" /></button>
                  </div>
                </div>
                {/* To row with default pill */}
                <div className="px-5 py-3 border-b text-gray-700" onClick={()=> setShowRecipientPicker(true)}>
                  <div className="flex items-center gap-3">
                    <div className="font-medium">To:</div>
                    <div className="flex flex-wrap gap-2">
                      {recipients.map((r, idx) => (
                        <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#efe7ff] text-[#6b46c1] text-sm">
                          {r}
                          <button aria-label="Remove" onClick={(e)=>{ e.stopPropagation(); setRecipients(prev => prev.filter((_,i)=>i!==idx)); }}>×</button>
                        </span>
                      ))}
                    </div>
                    <div className="ml-auto text-gray-400 flex items-center gap-1">
                      <span>Search for recipients...</span>
                      <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                  {showRecipientPicker && (
                    <div className="mt-3 relative" ref={recipientDropdownRef}>
                      <div className="absolute left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        <div className="py-1">
                          {recipientOptions.map((opt) => {
                            const selected = recipients.includes(opt.label);
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={(e)=>{ e.stopPropagation(); setRecipients([opt.label]); setShowRecipientPicker(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left ${selected? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                              >
                                <span className="flex items-center gap-3 flex-1 min-w-0">
                                  <Avatar className="w-8 h-8">
                                    {opt.id === 'all-staff' ? (
                                      <AvatarFallback className="bg-gray-100 text-gray-700">
                                        <UsersIcon className="w-4 h-4" />
                                      </AvatarFallback>
                                    ) : opt.avatar ? (
                                      <AvatarImage src={opt.avatar} alt={opt.label} />
                                    ) : (
                                      <AvatarFallback className={`${opt.bgColor ?? 'bg-gray-100'} ${opt.textColor ?? 'text-gray-700'}`}>{opt.initials ?? opt.label.charAt(0)}</AvatarFallback>
                                    )}
                                  </Avatar>
                                  <span className="flex flex-col min-w-0">
                                    <span className="text-[15px] text-gray-900 truncate">{opt.label}</span>
                                    <span className="text-xs text-gray-500">{opt.subtitle}</span>
                                  </span>
                                </span>
                                {selected && <span className="text-[#6b46c1]">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Toolbar removed */}
                {/* Editor area */}
                <div className="px-5 py-4">
                  <textarea ref={composerTextareaRef} value={composerText} onChange={(e)=>setComposerText(e.target.value)} placeholder="Write a post here..." className="w-full h-40 border-0 outline-none resize-none" />
                  <div className="mt-4 flex items-center gap-3">
                    <div className="relative" ref={sidekickRef}>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 px-3 text-sm"
                        onClick={()=> setSidekickOpen(v=>!v)}
                      >
                        {sidekickLoading ? (
                          <>
                            <svg className="animate-spin h-4 w-4 mr-2 text-gray-600" viewBox="0 0 24 24" aria-hidden>
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            Working…
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Sidekick
                          </>
                        )}
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
                              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 disabled:opacity-60"
                              disabled={sidekickLoading}
                            >
                              {opt.label}
                            </button>
                          ))}
                          <div className="px-4 py-2 text-[11px] text-gray-500 border-t">Don’t include sensitive information when using Sidekick.</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={()=>setShowDummyPicker(true)} className={`w-10 h-10 rounded-full border flex items-center justify-center ${composerTab==='Media'?'bg-gray-100':''}`}><ImageIcon className="w-5 h-5" /></button>
                    <button onClick={()=>setComposerTab('Activity')} className={`w-10 h-10 rounded-full border flex items-center justify-center ${composerTab==='Activity'?'bg-gray-100':''}`}><ActivityIcon className="w-5 h-5" /></button>
                    <button disabled className="w-10 h-10 rounded-full border flex items-center justify-center opacity-60"><BarChart3Icon className="w-5 h-5" /></button>
                  </div>
                  {composerImageUrl && (
                    <div className="mt-4">
                      <div className="relative inline-block">
                        <img src={composerImageUrl} alt="Selected" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                        <button aria-label="Remove image" onClick={()=>setComposerImageUrl('')} className="absolute -top-2 -right-2 p-1 bg-white/90 rounded-full shadow border"><XIcon className="w-3 h-3" /></button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Footer */}
                <div className="px-5 py-3 border-t flex items-center justify-end">
                  <Button className="px-5" disabled={!(composerText.trim() || composerImageUrl)} onClick={()=>{
                    let newPost: Post;
                    if (composerImageUrl) {
                      newPost = { id:`post-${Date.now()}`, kind:'photo', authorName:'Little Explorers', authorAvatarUrl:'/avatar-4.png', publishedAt:new Date(), imageUrl: composerImageUrl, caption: composerText.trim() || undefined } as any;
                    } else {
                      newPost = { id:`post-${Date.now()}`, kind:'text', authorName:'Little Explorers', authorAvatarUrl:'/avatar-4.png', publishedAt:new Date(), content: composerText.trim()} as any;
                    }
                    setPosts((prev)=>[newPost, ...prev]);
                    setComposerText('');
                    setComposerImageUrl('');
                    setComposerTab('Media');
                    setShowComposer(false);
                  }}>Post</Button>
                </div>
              </div>
            </div>
          )}
          {showDummyPicker && (
            <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center">
              <div className="w-full max-w-[720px] bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b">
                  <div className="font-medium text-gray-800">Photos</div>
                  <button aria-label="Close" onClick={()=>setShowDummyPicker(false)} className="p-2 text-gray-500 hover:text-gray-700"><XIcon className="w-5 h-5" /></button>
                </div>
                <div className="px-5 py-4">
                  <div className="grid grid-cols-3 gap-3">
                    {dummyImages.map((url, idx) => (
                      <button key={idx} type="button" onClick={()=>{ setComposerImageUrl(url); setShowDummyPicker(false); if (!showComposer) setShowComposer(true); setComposerTab('Media'); }} className="relative group rounded-xl overflow-hidden border border-gray-200">
                        <img src={url} alt="Dummy" className="w-full h-28 object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* full-screen recipient modal removed in favor of inline dropdown */}
        </main>

        {/* Bottom Navigation */}
        <BottomNavBar 
          activeItem={activeNavItem}
          onItemClick={onNavClick}
        />
    </>
  );

  if (embedded) {
    return <>{content}</>;
  }
  return (
    <DeviceContainer>
      {content}
    </DeviceContainer>
  );
};

