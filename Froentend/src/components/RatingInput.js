import React from 'react';

const RatingInput = ({ currentRating, onRate }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div style={{ fontSize: '1.5em', cursor: 'pointer' }}>
            {stars.map((star) => (
                <span
                    key={star}
                    onClick={() => onRate(star)}
                    style={{ color: star <= currentRating ? 'gold' : 'lightgray' }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default RatingInput;