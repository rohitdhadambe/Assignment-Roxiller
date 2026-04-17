import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingInput = ({ currentRating, onRate }) => {
    // Local state to track hover for a better user experience
    const [hover, setHover] = useState(0);
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex items-center gap-1">
            {stars.map((star) => {
                const isActive = star <= (hover || currentRating);
                const isSelected = star <= currentRating;

                return (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onRate(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="relative p-1 focus:outline-none transition-transform active:scale-90"
                    >
                        <Star
                            size={24}
                            strokeWidth={isActive ? 0 : 2}
                            className={`transition-all duration-200 ${
                                isActive 
                                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]' 
                                    : 'text-slate-300 fill-transparent'
                            }`}
                        />
                        
                        {/* Hidden indicator for screen readers */}
                        <span className="sr-only">Rate {star} stars</span>
                    </button>
                );
            })}
        </div>
    );
};

export default RatingInput;