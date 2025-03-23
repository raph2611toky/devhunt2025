import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

export interface Review {
  id: number;
  name: string;
  handle: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
  color?: string;
}

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className = '' }: ReviewCardProps) {
  return (
    <div
      className={`border-[2px] border-black text-deep-navy rounded-2xl p-8 w-full max-w-md ${className}`}
      style={{ backgroundColor: review.color }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-14 h-14">
          <AvatarImage src={review.avatar} alt={review.name} />
          <AvatarFallback>{review.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-[24px]">{review.name}</h3>
          <p className="text-[16px] font-medium">{review.handle}</p>
        </div>
      </div>
      <div className="flex gap-1 mb-4">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-current" />
        ))}
      </div>
      <p className="mb-4 text-[22px] font-medium">{review.comment}</p>
      <p className="text-sm font-medium">{review.date}</p>
    </div>
  );
}
