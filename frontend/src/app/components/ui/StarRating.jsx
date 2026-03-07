function StarIcon({ filled }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={filled ? "#FFC27A" : "#E7E9EB"} aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <StarIcon key={i} filled={i < rating} />
      ))}
    </div>
  );
}
