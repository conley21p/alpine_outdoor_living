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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-brand-textDark sm:text-4xl">What clients are saying</h2>
        <p className="mt-2 text-base text-gray-600">
          {reviews.length === 0 
            ? "These are placeholder testimonials and will be updated with live reviews."
            : "Real feedback from our valued customers"
          }
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((review, index) => (
          <article 
            key={`${review.customerName}-${index}`} 
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition-all hover:shadow-card-hover"
          >
            <div className="mb-4 flex items-center gap-0.5 text-xl text-brand-primary">
              {Array.from({ length: review.rating }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-gray-700">"{review.quote}"</p>
            <div className="mt-5 border-t border-gray-100 pt-4">
              <p className="font-bold text-brand-textDark">{review.customerName}</p>
              <p className="mt-1 text-xs font-medium text-gray-500">{review.service || publicConfig.industry}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
