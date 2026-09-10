import { createFileRoute } from "@tanstack/react-router";
import { Camera, MessageCircle, Send, ShieldCheck, Star, Video } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { SiteLayout } from "@/components/site/SiteLayout";
import almondImg from "@/assets/almond-cookies.jpg";
import craftImg from "@/assets/craft.jpg";
import interiorImg from "@/assets/bakery-interior.jpg";
import khaariImg from "@/assets/khaari.jpg";
import { createReview, CustomerReview, fetchReviews } from "@/lib/api";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { name: "robots", content: "index, follow" },
      { title: "Customer Reviews - Zekra Sweets" },
      {
        name: "description",
        content: "Read customer reviews for Zekra Sweets and share your feedback after an order.",
      },
      { property: "og:title", content: "Customer Reviews - Zekra Sweets" },
      { property: "og:description", content: "Customer feedback and reviews for Zekra Sweets." },
      { property: "og:url", content: "https://zekrasweets.com/reviews" },
      { property: "og:image", content: "https://zekrasweets.com/favicon.png" },
    ],
    links: [{ rel: "canonical", href: "https://zekrasweets.com/reviews" }],
  }),
  component: Reviews,
});

function Reviews() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  const orderId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("order") || "";
  }, []);

  useEffect(() => {
    fetchReviews()
      .then((items) => {
        setReviews(items);
        setLoadError("");
      })
      .catch(() => {
        setReviews([]);
        setLoadError("Reviews could not be loaded right now. Please refresh in a moment.");
      })
      .finally(() => setLoading(false));
  }, []);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const review = await createReview({
        name,
        email,
        orderId,
        rating,
        message: feedback,
      });
      setReviews((current) => [review, ...current]);
      setName("");
      setEmail("");
      setRating(5);
      setFeedback("");
      setMessage("Thank you for sharing your feedback. Your review is now visible on our website.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not submit your review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass rounded-[2.5rem] p-8 text-center md:p-14" data-reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-caramel">Reviews</span>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl">
            Sweet words from <span className="text-gradient-gold">our customers.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/75">
            Your feedback helps us keep improving and helps new customers choose their favorite
            treats with confidence.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-14 grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submitReview} className="glass rounded-3xl p-6 md:p-8" data-reveal>
          <h2 className="font-display text-2xl">Share your feedback</h2>
          <div className="mt-6 grid gap-4">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="rounded-2xl border border-gold-soft/50 bg-cream/70 px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              type="email"
              className="rounded-2xl border border-gold-soft/50 bg-cream/70 px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`${value} star review`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-gold-soft/50 bg-cream/70 text-primary transition-colors hover:bg-secondary"
                >
                  <Star className={`h-5 w-5 ${value <= rating ? "fill-current" : ""}`} />
                </button>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder="Tell us what you enjoyed"
              rows={6}
              required
              minLength={10}
              className="resize-none rounded-2xl border border-gold-soft/50 bg-cream/70 px-4 py-3 text-sm outline-none focus:border-primary"
            />
            {message && <p className="text-sm font-semibold text-primary">{message}</p>}
            {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Submitting..." : "Submit review"}
            </button>
          </div>
        </form>

        <div className="grid content-start gap-4" data-reveal style={{ transitionDelay: "80ms" }}>
          {loading ? (
            <p className="rounded-3xl border border-gold-soft/45 bg-cream/60 p-6 text-sm text-foreground/70">
              Loading reviews...
            </p>
          ) : loadError ? (
            <p className="rounded-3xl border border-gold-soft/45 bg-cream/60 p-6 text-sm font-semibold text-destructive">
              {loadError}
            </p>
          ) : reviews.length === 0 ? (
            <ReviewsEmptyState />
          ) : (
            reviews.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function ReviewsEmptyState() {
  return (
    <section className="rounded-3xl border border-gold-soft/45 bg-cream/70 p-5 shadow-glass">
      <span className="text-xs uppercase tracking-[0.25em] text-caramel">Social proof</span>
      <h2 className="mt-3 font-display text-3xl">Loved by Zekra Customers</h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/70">
        Genuine customer feedback will appear here after it is submitted and verified. Until then,
        these spaces are prepared for real customer notes, order photos, creator videos, and
        WhatsApp feedback.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {reviewProofItems.map((item) => (
          <article key={item.title} className="overflow-hidden rounded-2xl border border-gold-soft/45 bg-background/70">
            <img src={item.image} alt={item.alt} className="h-28 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-caramel">
                <item.icon className="h-3.5 w-3.5 text-primary" />
                {item.label}
              </div>
              <h3 className="mt-2 font-display text-lg leading-tight">{item.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: CustomerReview }) {
  return (
    <article className="rounded-3xl border border-gold-soft/45 bg-cream/70 p-6 shadow-glass">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl">{review.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-widest text-caramel">
            {new Intl.DateTimeFormat("en-AE", { dateStyle: "medium" }).format(
              new Date(review.createdAt),
            )}
          </p>
        </div>
        <div className="flex shrink-0 gap-1 text-primary">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star key={value} className={`h-4 w-4 ${value <= review.rating ? "fill-current" : ""}`} />
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-foreground/78">{review.message}</p>
    </article>
  );
}

const reviewProofItems = [
  {
    label: "Feedback",
    title: "Verified customer notes",
    image: almondImg,
    alt: "Zekra Sweets almond cookies",
    icon: MessageCircle,
  },
  {
    label: "Order photos",
    title: "Fresh order moments",
    image: khaariImg,
    alt: "Zekra Sweets khari puff",
    icon: Camera,
  },
  {
    label: "Media",
    title: "Influencer and review videos",
    image: interiorImg,
    alt: "Zekra Sweets bakery interior",
    icon: Video,
  },
  {
    label: "WhatsApp",
    title: "Customer chat feedback",
    image: craftImg,
    alt: "Zekra Sweets preparation detail",
    icon: ShieldCheck,
  },
];
