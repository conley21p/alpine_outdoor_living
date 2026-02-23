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
    <section className="mx-auto max-w-[90rem] px-6 py-20 lg:px-12 lg:py-32">
      <div className="mb-16 text-center lg:mb-20">
        <h2 className="text-4xl font-bold tracking-tighter text-brand-textDark sm:text-5xl lg:text-6xl">
          What clients say
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-normal text-brand-textDark/70 sm:text-xl lg:text-2xl">
          {reviews.length === 0 
            ? "Sample testimonials—live reviews coming soon"
            : "Real feedback from our valued customers"
          }
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {data.map((review, index) => (
          <article 
            key={`${review.customerName}-${index}`} 
            className="rounded-2xl bg-brand-bgLight p-8 lg:p-10"
          >
            <div className="mb-5 flex items-center gap-0.5 text-lg text-brand-textDark">
              {Array.from({ length: review.rating }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <p className="text-base leading-relaxed text-brand-textDark lg:text-lg">
              &ldquo;{review.quote}&rdquo;
            </p>
            <div className="mt-6">
              <p className="font-medium text-brand-textDark">{review.customerName}</p>
              <p className="mt-1 text-[13px] text-brand-textDark/60">{review.service || publicConfig.industry}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
