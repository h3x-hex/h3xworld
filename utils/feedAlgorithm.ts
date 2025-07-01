import { Post } from '@lens-protocol/client';

export interface RankedPost extends Post {
  score: number;
}

export const rankPosts = (posts: Post[]): RankedPost[] => {
  return posts
    .map((post) => {
      const reactions = (post.stats?.reactions?.up ?? 0) as number;
      const comments = (post.stats?.comments ?? 0) as number;
      const mirrors = (post.stats?.mirrors ?? 0) as number;
      const agePenalty = (Date.now() - new Date(post.timestamp).getTime()) / 1000;
      const score = reactions * 2 + comments + mirrors - agePenalty * 0.001;
      return { ...post, score };
    })
    .sort((a, b) => b.score - a.score);
};
