
import { Testimonial } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Play } from "lucide-react";

interface TestimonialCardProps {
  testimonial: Testimonial;
  onPlay?: () => void;
}

const TestimonialCard = ({ testimonial, onPlay }: TestimonialCardProps) => {
  const { name, company, position, text, mediaType } = testimonial;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="h-12 w-12 border">
          <AvatarFallback className="bg-brand-100 text-brand-700">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="font-medium text-lg">{name}</h3>
          {(position || company) && (
            <p className="text-gray-500 text-sm">
              {position}
              {position && company && " at "}
              {company}
            </p>
          )}
        </div>
      </div>
      
      <blockquote className="italic text-gray-700 mb-4">
        "{text}"
      </blockquote>
      
      {mediaType !== "none" && (
        <div 
          className={`relative rounded-md overflow-hidden cursor-pointer ${
            mediaType === "video" ? "aspect-video bg-gray-100" : "h-12 bg-brand-50"
          }`}
          onClick={onPlay}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-brand-600 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-md">
              <Play size={20} />
            </div>
            <span className="absolute text-xs font-medium text-white top-1 right-2">
              {mediaType === "video" ? "Video" : "Audio"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialCard;
