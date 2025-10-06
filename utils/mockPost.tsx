import { Comment, Post } from "../types";

// utils/mockPosts.ts
export const generateMockPosts = (): Post[] => {
    const mockUsers = [
      { id: '1', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '2', name: 'Jamie Smith', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '3', name: 'Taylor Swift', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
      { id: '4', name: 'Current User', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
    ];
  
    const mockComments: Comment[] = [
      {
        id: 'comment1',
        user: mockUsers[1],
        text: 'Looks amazing! Where is this?',
        likes: 3,
        isLiked: false,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        replies: [
          {
            id: 'reply1',
            user: mockUsers[0],
            text: 'Thanks! This is at Sunset Beach',
            likes: 1,
            isLiked: true,
            timestamp: new Date(Date.now() - 1800000), // 30 mins ago
          },
          {
            id: 'reply2',
            user: mockUsers[2],
            text: 'I was there last week! So beautiful',
            likes: 0,
            isLiked: false,
            timestamp: new Date(Date.now() - 900000), // 15 mins ago
          }
        ]
      },
      {
        id: 'comment2',
        user: mockUsers[2],
        text: 'Love the vibes in this photo ✨',
        likes: 5,
        isLiked: false,
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      }
    ];
  
    return [
      {
        id: '1',
        user: mockUsers[0],
        content: {
          type: 'image',
          uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        },
        caption: 'Enjoying the sunset at the beach today! 🌅 #summer #vacation',
        likes: 124,
        comments: mockComments,
        timestamp: new Date(Date.now() - 86400000), 
        isLiked: false,
        showComments: false,
      },
    ];
  };