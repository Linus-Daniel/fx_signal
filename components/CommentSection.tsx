import { Image,View, Text, TouchableOpacity } from "react-native";
import { tw } from "../utils/tailwind";
import { Comment } from "../types";
import Ionicons from "react-native-vector-icons/Ionicons";

// Comment Component
const CommentItem = ({ 
  comment, 
  onLike,
  onReply 
}: {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReply: (commentId: string) => void;
}) => {
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <View style={tw`mb-3`}>
      <View style={tw`flex-row`}>
        <Image
          source={{ uri: comment.user.photo }}
          style={tw`w-8 h-8 rounded-full mr-2`}
        />
        <View style={tw`flex-1`}>
          <View style={tw`bg-gray-100 rounded-lg p-2`}>
            <Text style={tw`font-bold text-sm`}>{comment.user.name}</Text>
            <Text style={tw`text-sm`}>{comment.text}</Text>
          </View>
          <View style={tw`flex-row items-center mt-1 ml-2`}>
            <Text style={tw`text-gray-500 text-xs mr-3`}>
              {formatTimeAgo(comment.timestamp)}
            </Text>
            <TouchableOpacity onPress={() => onLike(comment.id)}>
              <Text style={tw`text-gray-500 text-xs font-bold mr-3`}>
                {comment.likes} like{comment.likes !== 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onReply(comment.id)}>
              <Text style={tw`text-gray-500 text-xs font-bold`}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => onLike(comment.id)}
          style={tw`ml-2`}
        >
          <Ionicons
            name={comment.isLiked ? 'heart' : 'heart-outline'}
            size={14}
            color={comment.isLiked ? tw.color('rose-500') : tw.color('gray-400')}
          />
        </TouchableOpacity>
      </View>

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <View style={tw`ml-10 mt-2`}>
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              onLike={onLike}
              onReply={onReply}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default CommentItem;