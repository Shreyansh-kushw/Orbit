// Mock data for ORBIT platform

export interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  bio: string
  joinDate: string
  followers: number
  following: number
  totalPosts: number
  totalLikes: number
  totalViews: number
  isFollowing?: boolean
}

export interface Post {
  id: string
  author: User
  title: string
  content: string
  createdAt: string
  likes: number
  dislikes: number
  comments: number
  isLiked?: boolean
  isDisliked?: boolean
}

export interface Comment {
  id: string
  author: User
  content: string
  createdAt: string
  upvotes: number
  downvotes: number
  replies?: Comment[]
  isUpvoted?: boolean
  isDownvoted?: boolean
}

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'cosmicwanderer',
    displayName: 'Cosmic Wanderer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmic',
    bio: 'Exploring the digital cosmos one post at a time. Tech enthusiast and philosophy lover.',
    joinDate: '2024-01-15',
    followers: 12400,
    following: 892,
    totalPosts: 234,
    totalLikes: 45600,
    totalViews: 890000,
  },
  {
    id: '2',
    username: 'nebuladev',
    displayName: 'Nebula Dev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nebula',
    bio: 'Full-stack developer building the future. Open source contributor.',
    joinDate: '2024-02-20',
    followers: 8900,
    following: 456,
    totalPosts: 156,
    totalLikes: 32100,
    totalViews: 567000,
  },
  {
    id: '3',
    username: 'stardust_writer',
    displayName: 'Stardust Writer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=stardust',
    bio: 'Words are my universe. Science fiction author and dreamer.',
    joinDate: '2024-03-10',
    followers: 23500,
    following: 1200,
    totalPosts: 89,
    totalLikes: 78900,
    totalViews: 1200000,
  },
  {
    id: '4',
    username: 'quantumthinker',
    displayName: 'Quantum Thinker',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=quantum',
    bio: 'Physics PhD student. Making complex ideas simple.',
    joinDate: '2024-01-05',
    followers: 15600,
    following: 345,
    totalPosts: 312,
    totalLikes: 56700,
    totalViews: 980000,
  },
  {
    id: '5',
    username: 'voidexplorer',
    displayName: 'Void Explorer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=void',
    bio: 'Cryptocurrency analyst and blockchain enthusiast.',
    joinDate: '2024-04-01',
    followers: 6700,
    following: 234,
    totalPosts: 67,
    totalLikes: 12300,
    totalViews: 234000,
  },
]

export const mockPosts: Post[] = [
  {
    id: '1',
    author: mockUsers[0],
    title: 'The Future of AI: A Deep Dive into Neural Architecture',
    content: `Artificial intelligence is rapidly evolving, and the architectures powering these systems are becoming increasingly sophisticated. In this post, I want to explore the cutting-edge developments in neural network design and what they mean for the future of technology.

The transformer architecture, introduced in 2017, revolutionized how we approach sequence modeling. But we're now seeing new paradigms emerge that could be even more powerful. State space models, mixture of experts, and hybrid architectures are pushing the boundaries of what's possible.

What excites me most is the democratization of AI. Tools that were once only available to large corporations are now accessible to individual developers. This shift is creating a cambrian explosion of innovation that will reshape every industry.

The key challenges ahead include improving efficiency, reducing hallucinations, and developing better alignment techniques. But I'm optimistic that the collaborative nature of the AI research community will help us overcome these obstacles.`,
    createdAt: '2024-12-15T10:30:00Z',
    likes: 1247,
    dislikes: 23,
    comments: 89,
  },
  {
    id: '2',
    author: mockUsers[1],
    title: 'Why TypeScript Changed My Life as a Developer',
    content: `Three years ago, I was a JavaScript purist. I thought types were unnecessary overhead that slowed down development. I was wrong.

TypeScript has fundamentally changed how I approach software development. The type system isn't just about catching bugs – it's a documentation system, a design tool, and a refactoring assistant all rolled into one.

Here are the key benefits I've experienced:
- Instant feedback on API changes across your entire codebase
- Self-documenting code that's easier for new team members to understand
- Confidence when refactoring large codebases
- Better IDE support with intelligent autocomplete

The learning curve is real, but it's worth it. Start with strict mode enabled from day one – you'll thank yourself later.`,
    createdAt: '2024-12-14T15:45:00Z',
    likes: 892,
    dislikes: 45,
    comments: 156,
  },
  {
    id: '3',
    author: mockUsers[2],
    title: 'Writing Science Fiction in the Age of Real Space Exploration',
    content: `As a science fiction writer, I've always drawn inspiration from real space exploration. But something fascinating is happening – reality is catching up to our wildest imaginings.

SpaceX's Starship, NASA's Artemis program, and the emerging commercial space industry are making scenarios that seemed purely fictional just a decade ago suddenly plausible. This creates both challenges and opportunities for sci-fi writers.

The challenge is staying ahead of reality. When you can watch live streams of rocket landings that look like CGI, how do you write about space travel that still feels novel and exciting?

The opportunity is in exploring the human dimension. Technology might be advancing rapidly, but human nature remains constant. The best science fiction has always been about people, and that's more true than ever.`,
    createdAt: '2024-12-13T09:15:00Z',
    likes: 2341,
    dislikes: 12,
    comments: 234,
  },
  {
    id: '4',
    author: mockUsers[3],
    title: 'Quantum Computing: Separating Hype from Reality',
    content: `There's a lot of excitement – and confusion – around quantum computing. As someone who studies this field, I want to help separate the hype from the reality.

First, let's be clear: quantum computers are not going to replace classical computers for most tasks. They're specialized tools that excel at specific types of problems, particularly optimization and simulation.

The current state of quantum computing is often called the "NISQ era" – Noisy Intermediate-Scale Quantum. We have machines with tens to hundreds of qubits, but they're error-prone and difficult to program.

Real quantum advantage – solving problems that are genuinely impossible for classical computers – is still years away for most practical applications. But the field is progressing rapidly, and the foundational research happening now will pay dividends for decades.`,
    createdAt: '2024-12-12T14:20:00Z',
    likes: 1567,
    dislikes: 34,
    comments: 178,
  },
  {
    id: '5',
    author: mockUsers[4],
    title: 'The Philosophy of Decentralization',
    content: `Decentralization isn't just a technical architecture – it's a philosophy about how power should be distributed in society.

When we build decentralized systems, we're making a statement about trust, authority, and human coordination. We're saying that no single entity should have unilateral control over critical infrastructure.

But decentralization comes with tradeoffs. It's often slower, more expensive, and harder to upgrade than centralized alternatives. The key is understanding when these tradeoffs are worth it.

I believe decentralization is most valuable for systems that:
- Require censorship resistance
- Need to operate across jurisdictions
- Benefit from transparency and auditability
- Should survive the failure of any single organization

Not everything needs to be decentralized. But for the things that do, it's a powerful tool for building a more resilient and equitable world.`,
    createdAt: '2024-12-11T11:00:00Z',
    likes: 678,
    dislikes: 89,
    comments: 234,
  },
]

export const mockComments: Comment[] = [
  {
    id: '1',
    author: mockUsers[1],
    content: 'This is such an insightful analysis! I particularly appreciate the nuanced take on the current limitations while maintaining optimism about the future.',
    createdAt: '2024-12-15T11:30:00Z',
    upvotes: 45,
    downvotes: 2,
    replies: [
      {
        id: '1-1',
        author: mockUsers[0],
        content: 'Thanks for the kind words! I think it\'s important to be realistic about where we are while still being excited about where we\'re going.',
        createdAt: '2024-12-15T12:15:00Z',
        upvotes: 23,
        downvotes: 0,
      },
    ],
  },
  {
    id: '2',
    author: mockUsers[2],
    content: 'I\'d love to see a follow-up post diving deeper into the specific architectural innovations you mentioned. State space models in particular seem fascinating.',
    createdAt: '2024-12-15T13:00:00Z',
    upvotes: 67,
    downvotes: 1,
  },
  {
    id: '3',
    author: mockUsers[3],
    content: 'Great points overall, but I think you\'re underselling the alignment challenges. The risks are more significant than many people realize.',
    createdAt: '2024-12-15T14:30:00Z',
    upvotes: 34,
    downvotes: 8,
    replies: [
      {
        id: '3-1',
        author: mockUsers[0],
        content: 'That\'s a fair criticism. I didn\'t want to make the post too long, but alignment definitely deserves its own deep dive.',
        createdAt: '2024-12-15T15:00:00Z',
        upvotes: 19,
        downvotes: 0,
      },
      {
        id: '3-2',
        author: mockUsers[4],
        content: 'I think the key is that we need both technical solutions and governance frameworks. Neither alone is sufficient.',
        createdAt: '2024-12-15T15:30:00Z',
        upvotes: 28,
        downvotes: 1,
      },
    ],
  },
]

export const trendingTopics = [
  { tag: 'AI', posts: 12400 },
  { tag: 'Programming', posts: 8900 },
  { tag: 'Science', posts: 7600 },
  { tag: 'Technology', posts: 6500 },
  { tag: 'Philosophy', posts: 4300 },
]

export const platformStats = {
  totalUsers: 125000,
  totalPosts: 890000,
  activeNow: 3400,
}

// Current authenticated user (for demo purposes)
export const currentUser: User = {
  id: 'current',
  username: 'orbituser',
  displayName: 'Orbit User',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=orbituser',
  bio: 'Just joined ORBIT! Excited to explore and connect with the community.',
  joinDate: '2024-12-01',
  followers: 156,
  following: 89,
  totalPosts: 12,
  totalLikes: 234,
  totalViews: 4500,
}
