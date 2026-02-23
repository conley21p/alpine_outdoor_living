import { publicConfig } from "@/lib/config";

export interface ReviewCard {
  quote: string;
  customerName: string;
  service?: string;
  rating: number;
  reviewDate?: string;
}

const defaultReviews: ReviewCard[] = [
  {
    quote: "Excellent service and very professional from start to finish.",
    customerName: "Local Customer",
    service: "General Service",
    rating: 5,
  },
  {
    quote: "Clear communication, fair pricing, and great results.",
    customerName: "Returning Client",
    service: "Recurring Service",
    rating: 5,
  },
  {
    quote: "They were on time and the quality exceeded expectations.",
    customerName: "Happy Homeowner",
    service: "Project Service",
    rating: 4,
  },
];

interface ReviewsSectionProps {
  reviews?: ReviewCard[];
  previewOnly?: boolean;
}

export function ReviewsSection({ reviews = [], previewOnly = false }: ReviewsSectionProps) {
  const data = (reviews.length > 0 ? reviews : defaultReviews).slice(
    0,
    previewOnly ? 3 : undefined,
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-brand-textDark">What clients are saying</h2>
        {reviews.length === 0 && (
          <p className="mt-2 text-sm text-slate-600">
            These are placeholder testimonials and will be updated with live reviews.
          </p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((review, index) => (
          <article key={`${review.customerName}-${index}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
            <p className="mb-3 text-amber-500">{"★".repeat(review.rating)}</p>
            <p className="text-sm text-slate-700">“{review.quote}”</p>
            <p className="mt-4 text-sm font-semibold text-brand-textDark">{review.customerName}</p>
            <p className="text-xs text-slate-500">{review.service || publicConfig.industry}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
