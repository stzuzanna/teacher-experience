import React, { useState } from "react";
import { 
  SearchIcon, 
  ImageIcon, 
  EyeIcon, 
  ActivityIcon,
  BarChart3Icon,
  ChevronDownIcon,
  XIcon
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
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

        {/* User Profile Section */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/avatar.png" alt="My profile" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">My news</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

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
                    onClick={() => setShowComposer(true)}
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
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-8 px-3 text-sm">Drafts</Button>
                    <button aria-label="Close" onClick={()=>setShowComposer(false)} className="p-2 text-gray-500 hover:text-gray-700"><XIcon className="w-5 h-5" /></button>
                  </div>
                </div>
                {/* To row with default pill */}
                <div className="px-5 py-3 border-b text-gray-700 flex items-center gap-3">
                  <div className="font-medium">To:</div>
                  <div className="flex flex-wrap gap-2">
                    {recipients.map((r, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#efe7ff] text-[#6b46c1] text-sm">
                        {r}
                        <button aria-label="Remove" onClick={()=> setRecipients(prev => prev.filter((_,i)=>i!==idx))}>×</button>
                      </span>
                    ))}
                  </div>
                  <div className="ml-auto text-gray-400">Search for recipients...</div>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                </div>
                {/* Toolbar removed */}
                {/* Editor area */}
                <div className="px-5 py-4">
                  <textarea value={composerText} onChange={(e)=>setComposerText(e.target.value)} placeholder="Write a post here..." className="w-full h-40 border-0 outline-none resize-none" />
                  <div className="mt-4 flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 px-3 text-sm"
                      onClick={()=>{
                        try {
                          // Reuse the same correction used in Messages (basic pass)
                          // quick, local grammar improvements
                          const fixes = [
                            [/\bteh\b/gi, 'the'], [/\brecieve\b/gi,'receive'], [/\bdefinately\b/gi,'definitely'], [/\balot\b/gi,'a lot'],
                            [/\boccured\b/gi,'occurred'], [/\bavailible\b/gi,'available'], [/\btmrw\b/gi,'tomorrow'], [/\bur\b/gi,'your'], [/\bu\b/gi,'you']
                          ];
                          let t = composerText;
                          fixes.forEach(([r,v]) => t = t.replace(r as any, v as any));
                          t = t.replace(/(^|\s)i(\s)/g, (m,p1,p2)=>`${p1}I${p2}`);
                          t = t.trim();
                          if (!t) { setComposerText(''); return; }
                          const cap = t.charAt(0).toUpperCase() + t.slice(1);
                          if (!/[.!?]$/.test(cap)) t = cap + '.'; else t = cap;
                          setComposerText(t);
                        } catch {}
                      }}
                    >
                      ✦ Sidekick
                    </Button>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={()=>setComposerTab('Media')} className={`w-10 h-10 rounded-full border flex items-center justify-center ${composerTab==='Media'?'bg-gray-100':''}`}><ImageIcon className="w-5 h-5" /></button>
                    <button onClick={()=>setComposerTab('Activity')} className={`w-10 h-10 rounded-full border flex items-center justify-center ${composerTab==='Activity'?'bg-gray-100':''}`}><ActivityIcon className="w-5 h-5" /></button>
                    <button disabled className="w-10 h-10 rounded-full border flex items-center justify-center opacity-60"><BarChart3Icon className="w-5 h-5" /></button>
                  </div>
                </div>
                {/* Footer */}
                <div className="px-5 py-3 border-t flex items-center justify-end">
                  <Button className="px-5" disabled={!composerText.trim()} onClick={()=>{
                    const newPost: Post = { id:`post-${Date.now()}`, kind:'text', authorName:'Little Explorers', authorAvatarUrl:'/avatar-4.png', publishedAt:new Date(), content: composerText.trim()} as any;
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

