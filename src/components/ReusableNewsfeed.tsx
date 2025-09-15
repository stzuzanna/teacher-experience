import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EmojiReactionPicker } from "./EmojiReactionPicker";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { BASE_PATH } from "../constants";

// Single-file, dependency-free Newsfeed you can copy to another project.
// Includes: header, posts (text/photo/poll), likes, emoji reactions, comments.
// No external UI libs. Styles are inline/local to this component.

// Types
export type PostKind = "text" | "photo" | "poll";

export interface BasePost {
  id: string;
  kind: PostKind;
  authorName: string;
  authorAvatarUrl?: string;
  publishedAt?: string | Date;
}

export interface TextPost extends BasePost {
  kind: "text";
  title?: string;
  content: string;
}

export interface PhotoPost extends BasePost {
  kind: "photo";
  imageUrl: string;
  caption?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes?: number;
}

export interface PollPost extends BasePost {
  kind: "poll";
  question: string;
  options: PollOption[];
  multiple?: boolean;
  voters?: number; // total voters (used for multiple selection percentage)
}

export type Post = TextPost | PhotoPost | PollPost;

export interface ReusableNewsfeedProps {
  initialPosts?: Post[];
  allowComments?: boolean;
  allowReactions?: boolean;
  allowPollVoting?: boolean;
  className?: string;
}

// Utils
function coerceDate(value?: string | Date): Date | undefined {
  if (!value) return undefined;
  return value instanceof Date ? value : new Date(value);
}

function formatRelative(date?: Date): string {
  if (!date) return "";
  const diffMs = Date.now() - date.getTime();
  const s = Math.floor(diffMs / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

// Using shadcn UI components instead of minimal components

function IconHeart({ filled }: { filled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#EF4444" : "none"} stroke={filled ? "#EF4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.8 4.6c-1.9-1.9-5-1.9-6.9 0L12 6.5l-1.9-1.9c-1.9-1.9-5-1.9-6.9 0-2 2-2 5.1 0 7.1l1.9 1.9L12 21l6.9-7.3 1.9-1.9c2-2 2-5.1 0-7.2z" />
    </svg>
  );
}

function IconMessage() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  );
}

// Using enhanced EmojiReactionPicker component

// Enhanced Interactive Post with modern UI
function InteractivePost({
  post,
  isLiked,
  selectedReaction,
  likeCount,
  comments,
  onToggleLike,
  onReaction,
  onRemoveReaction,
  onAddComment,
  children,
}: {
  post: Post;
  isLiked: boolean;
  selectedReaction?: string;
  likeCount: number;
  comments: string[];
  onToggleLike: () => void;
  onReaction: (emoji: string) => void;
  onRemoveReaction?: () => void;
  onAddComment: (comment: string) => void;
  children: React.ReactNode;
}) {
  const [commentText, setCommentText] = useState('');
  const published = formatRelative(coerceDate(post.publishedAt));
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  const baseLikes = 2;
  const totalLikes = baseLikes + (isLiked ? 1 : 0);

  return (
    <Card className="relative w-full bg-white rounded-xl shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-col items-start gap-5 px-4 py-0">
          <div className="flex items-center gap-2 pt-4 pb-0 px-0 w-full">
            <Avatar className="w-8 h-8">
              <AvatarImage src={post.authorAvatarUrl || `${BASE_PATH}/avatar-default.png`} alt="Profile" />
              <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start justify-center gap-0.5">
              <div className="font-medium text-gray-900 text-sm">
                {post.authorName}
              </div>

              <div className="flex items-center gap-1.5 opacity-80">
                <div className="text-xs text-gray-600">
                  Published by {post.authorName}
                </div>

                <div className="w-1 h-1 bg-gray-400 rounded-sm" />

                <div className="text-xs text-gray-600">
                  {published || "Today"}
                </div>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="w-full">
            {children}
          </div>
        </div>

        {/* Actions and Engagement */}
        <div className="flex flex-col px-4">
          <div className="flex items-center justify-start gap-2 py-2">
            <EmojiReactionPicker
              isLiked={isLiked}
              selectedReaction={selectedReaction}
              onToggleLike={onToggleLike}
              onReaction={onReaction}
              onRemoveReaction={onRemoveReaction}
            />

            <Button
              variant="ghost"
              className="h-9 gap-1 pl-2 pr-[9px] py-2 rounded-lg h-auto"
              onClick={() => {
                commentInputRef.current?.focus();
                commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }}
            >
              <MessageCircleIcon className="w-[18px] h-[18px]" />
              <span className="text-sm text-gray-700">
                Comment
              </span>
            </Button>
          </div>

          {/* Like/Reaction Summary */}
          <div className="flex h-10 items-center gap-2.5 px-0 py-2 w-full">
            <div className="flex items-center gap-1 text-xs text-gray-700">
              {selectedReaction && (
                <>
                  <span className="text-lg">{selectedReaction}</span>
                  <span>😊</span>
                  <span>You and others reacted to this</span>
                </>
              )}
              {!selectedReaction && isLiked && `${totalLikes === 1 ? 'You like this' : `You and ${totalLikes - 1} ${totalLikes === 2 ? 'other' : 'others'} like this`}`}
              {!selectedReaction && !isLiked && totalLikes > 0 && `${totalLikes} ${totalLikes === 1 ? 'person likes' : 'people like'} this`}
              {!selectedReaction && !isLiked && totalLikes === 0 && 'Be the first to like this'}
            </div>
          </div>

          {/* Comments */}
          {comments.length > 0 && (
            <div className="flex flex-col gap-3 w-full mb-4">
              {comments.map((comment, index) => {
                const commentAuthors = [
                  { name: "Sandra Alvarez", avatar: `${BASE_PATH}/avatar-2.png` },
                  { name: "James Carter", avatar: `${BASE_PATH}/avatar-3.png` },
                  { name: "Emily Chen", avatar: `${BASE_PATH}/avatar-4.png` },
                ];
                const author = commentAuthors[index % commentAuthors.length];
                return (
                  <div key={index} className="flex items-start gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={author.avatar} alt={author.name} />
                      <AvatarFallback>
                        {author.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {author.name}
                      </div>
                      <div className="text-sm text-gray-700">
                        {comment}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Comment Input */}
          <form onSubmit={handleSubmitComment} className="flex items-center gap-2 py-3 w-full">
            <Avatar className="w-8 h-8">
              <AvatarImage src={`${BASE_PATH}/avatar-2.png`} alt="User avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <div className="flex h-9 items-center justify-between px-3 py-0 flex-1 bg-gray-50 rounded-lg">
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="border-0 bg-transparent p-0 text-sm text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                ref={commentInputRef}
              />

              <button
                type="submit"
                className="flex w-[18px] h-[18px] items-center justify-center"
                disabled={!commentText.trim()}
              >
                <MessageCircleIcon className="w-[18px] h-[18px] text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            </div>
          </form>

          <div className="text-xs text-gray-500 pb-4">
            Recipients: {post.authorName}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Post renderers
function RenderTextPost({ post }: { post: TextPost }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {post.title && <div style={{ fontWeight: 600, color: "#111827" }}>{post.title}</div>}
      <div style={{ color: "#374151", fontSize: 14, whiteSpace: "pre-wrap" }}>{post.content}</div>
    </div>
  );
}

function RenderPhotoPost({ post }: { post: PhotoPost }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.imageUrl}
        alt={post.caption ?? "Photo"}
        style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: 12, border: "1px solid #E5E7EB" }}
      />
      {post.caption && (
        <div style={{ color: "#374151", fontSize: 14 }}>{post.caption}</div>
      )}
    </div>
  );
}

function RenderPollPost({ post, onVote, userVotes }: { post: PollPost; onVote: (optionId: string) => void; userVotes: string[] }) {
  const votesArray = useMemo(() => post.options.map(o => o.votes ?? 0), [post.options]);
  const totalSelections = useMemo(() => votesArray.reduce((a, b) => a + b, 0), [votesArray]);
  const voters = useMemo(() => (post.multiple ? (post.voters ?? Math.max(...votesArray, 0)) : totalSelections), [post.multiple, post.voters, votesArray, totalSelections]);
  const hasVoted = userVotes.length > 0;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ fontWeight: 700, color: "#111827" }}>{post.question}</div>
      <div style={{ display: "grid", gap: 10 }}>
        {post.options.map((opt) => {
          const votes = opt.votes ?? 0;
          const pct = voters > 0 ? Math.round((votes / voters) * 100) : 0;
          const isSelected = userVotes.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => onVote(opt.id)}
              disabled={hasVoted && !isSelected && !(post.multiple)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                padding: "12px 14px",
                background: "#FFFFFF",
                overflow: "hidden",
                cursor: hasVoted && !isSelected && !(post.multiple) ? "default" : "pointer",
              }}
            >
              {hasVoted && (
                <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${pct}%`, background: "#EEF2FF" }} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1, color: "#111827" }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: "1px solid #CBD5E1",
                    background: isSelected ? "#6B46C1" : "#FFFFFF",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 12,
                  }}
                >
                  {isSelected ? "✓" : ""}
                </span>
                <span>{opt.text}</span>
              </div>
              <span style={{ position: "relative", zIndex: 1, fontWeight: 700, color: "#4F46E5" }}>{pct}%</span>
            </button>
          );
        })}
      </div>
      <div style={{ fontSize: 12, color: "#6B7280" }}>
        {Math.max(voters, totalSelections)} people voted {post.multiple ? "• Select multiple dates" : ""}
      </div>
    </div>
  );
}

// Main reusable feed
export const ReusableNewsfeed: React.FC<ReusableNewsfeedProps> = ({
  initialPosts,
  allowComments = true,
  allowReactions = true,
  allowPollVoting = true,
  className,
}) => {
  const defaultPosts: Post[] = useMemo(
    () => [
      {
        id: "p1",
        kind: "text",
        authorName: "Sandbox Childcare",
        publishedAt: new Date().toISOString(),
        title: "Welcome to the Newsfeed",
        content:
          "We'll share important updates, photos of your child, upcoming events, and more right here.",
      } as TextPost,
      {
        id: "p2",
        kind: "photo",
        authorName: "Little Explorers",
        publishedAt: new Date().toISOString(),
        imageUrl: "/pexels-daisy-anderson-5581091-1.png",
        caption: "Painting pumpkins tomorrow from the Activity Library!",
      } as PhotoPost,
      {
        id: "p3",
        kind: "poll",
        authorName: "Sandbox Childcare",
        publishedAt: new Date().toISOString(),
        question: "Which day works best for the Halloween party?",
        options: [
          { id: "o1", text: "Thursday", votes: 8 },
          { id: "o2", text: "Friday", votes: 12 },
          { id: "o3", text: "Monday", votes: 5 },
        ],
        multiple: false,
      } as PollPost,
    ],
    []
  );

  const posts = initialPosts ?? defaultPosts;

  // Interactions state per post
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [reactions, setReactions] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string[]>>({});
  const [pollVotes, setPollVotes] = useState<Record<string, string[]>>({});
  const [baseLikes, setBaseLikes] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    posts.forEach((p, idx) => {
      let likes = 2 + ((idx * 3) % 4);
      if (p.id === "birthday-post") likes = 18; // Boost likes for birthday post
      map[p.id] = likes;
    });
    return map;
  });

  useEffect(() => {
    // Initialize comments store for posts (seed a few friendly parent comments)
    setComments((prev) => {
      const next = { ...prev } as Record<string, string[]>;
      posts.forEach((p) => {
        if (!next[p.id] || next[p.id].length === 0) {
          if (p.kind === "photo") {
            next[p.id] = [
              "Thanks for the update — looks like they had a lovely time!",
              "Love seeing the garden activities, thank you!",
              "So nice to see smiles today — appreciate the photos!",
            ];
          } else if (p.id === "birthday-post") {
            next[p.id] = [
              "Happy birthday, Ms. Jenkins! Thank you for all that you do!",
              "Wishing you a wonderful day — with appreciation from the Alvarez family",
              "Best wishes and many happy returns! — The Carter family",
            ];
          } else {
            next[p.id] = [];
          }
        }
      });
      return next;
    });
  }, [posts]);

  const isLiked = useCallback((postId: string) => likedPosts.has(postId), [likedPosts]);
  const getReaction = useCallback((postId: string) => reactions[postId], [reactions]);
  const getComments = useCallback((postId: string) => comments[postId] ?? [], [comments]);
  const getPollVotes = useCallback((postId: string) => pollVotes[postId] ?? [], [pollVotes]);
  const getLikeCount = useCallback(
    (postId: string) => baseLikes[postId] + (isLiked(postId) || !!getReaction(postId) ? 1 : 0),
    [baseLikes, isLiked, getReaction]
  );

  const toggleLike = useCallback(
    (postId: string) => {
      if (!allowReactions) return;
      setLikedPosts((prev) => {
        const next = new Set(prev);
        if (next.has(postId)) next.delete(postId);
        else next.add(postId);
        return next;
      });
      // Remove reaction when toggling like off
      setReactions((prev) => {
        const next = { ...prev };
        if (next[postId]) delete next[postId];
        return next;
      });
    },
    [allowReactions]
  );

  const addReaction = useCallback(
    (postId: string, emoji: string) => {
      if (!allowReactions) return;
      setReactions((prev) => ({ ...prev, [postId]: emoji }));
      setLikedPosts((prev) => new Set(prev).add(postId));
    },
    [allowReactions]
  );

  const removeReaction = useCallback((postId: string) => {
    if (!allowReactions) return;
    setReactions((prev) => {
      const next = { ...prev };
      delete next[postId];
      return next;
    });
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.delete(postId);
      return next;
    });
  }, [allowReactions]);

  const addComment = useCallback(
    (postId: string, comment: string) => {
      if (!allowComments) return;
      setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] ?? []), comment] }));
    },
    [allowComments]
  );

  const addVote = useCallback(
    (postId: string, optionId: string) => {
      if (!allowPollVoting) return;
      const post = posts.find((p) => p.id === postId && p.kind === "poll") as PollPost | undefined;
      if (!post) return;
      setPollVotes((prev) => {
        const current = prev[postId] ?? [];
        let nextVotes: string[];
        if (post.multiple) {
          nextVotes = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
        } else {
          nextVotes = current.includes(optionId) ? [] : [optionId];
        }
        return { ...prev, [postId]: nextVotes };
      });
      // Increase displayed counts locally (non-persistent)
      const isSelecting = !(getPollVotes(postId).includes(optionId));
      if (isSelecting) {
        const p = posts.find((x) => x.id === postId) as PollPost | undefined;
        if (!p) return;
        p.options = p.options.map((o) => (o.id === optionId ? { ...o, votes: (o.votes ?? 0) + 1 } : o));
      }
    },
    [allowPollVoting, posts, getPollVotes]
  );

  return (
    <div className={className ?? ""}>
      <style>{`
        .nf-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: #2563EB; color: white; border-radius: 0 0 12px 12px; }
        .nf-title { font-weight: 700; letter-spacing: 0.2px; }
        .nf-feed { display: grid; gap: 12px; padding: 12px; }
      `}</style>

      <div className="nf-feed" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {posts.map((post) => {
          const liked = isLiked(post.id);
          const reaction = getReaction(post.id);
          const likeCount = getLikeCount(post.id);
          const postComments = getComments(post.id);

          if (post.kind === "text") {
            return (
              <InteractivePost
                key={post.id}
                post={post}
                isLiked={liked}
                selectedReaction={reaction}
                likeCount={likeCount}
                comments={postComments}
                onToggleLike={() => toggleLike(post.id)}
                onReaction={(e) => addReaction(post.id, e)}
                onRemoveReaction={() => removeReaction(post.id)}
                onAddComment={(c) => addComment(post.id, c)}
              >
                <RenderTextPost post={post} />
              </InteractivePost>
            );
          }

          if (post.kind === "photo") {
            return (
              <InteractivePost
                key={post.id}
                post={post}
                isLiked={liked}
                selectedReaction={reaction}
                likeCount={likeCount}
                comments={postComments}
                onToggleLike={() => toggleLike(post.id)}
                onReaction={(e) => addReaction(post.id, e)}
                onRemoveReaction={() => removeReaction(post.id)}
                onAddComment={(c) => addComment(post.id, c)}
              >
                <RenderPhotoPost post={post} />
              </InteractivePost>
            );
          }

          if (post.kind === "poll") {
            return (
              <InteractivePost
                key={post.id}
                post={post}
                isLiked={liked}
                selectedReaction={reaction}
                likeCount={likeCount}
                comments={postComments}
                onToggleLike={() => toggleLike(post.id)}
                onReaction={(e) => addReaction(post.id, e)}
                onRemoveReaction={() => removeReaction(post.id)}
                onAddComment={(c) => addComment(post.id, c)}
              >
                <RenderPollPost post={post} onVote={(oid) => addVote(post.id, oid)} userVotes={getPollVotes(post.id)} />
              </InteractivePost>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default ReusableNewsfeed;
