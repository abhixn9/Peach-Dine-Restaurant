import { useState, useMemo, useEffect, FormEvent } from 'react';
import { Star, MessageSquare, Plus, PenTool, Sparkle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Review } from '../types';

export default function ReviewsSection() {
  const { reviews, addReview, currentUser } = useApp();
  const [name, setName] = useState('');

  // Auto-fill reviewer name if logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    } else {
      setName('');
    }
  }, [currentUser]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?auto=format&fit=crop&q=80&w=150`
    };

    addReview(newReview);
    
    // Clear form
    setName('');
    setComment('');
    setRating(5);
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3500);
    setShowForm(false);
  };

  // Compute stats based on current reviews
  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0, dist: [0, 0, 0, 0, 0] };
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = Number((sum / reviews.length).toFixed(1));
    const dist = [0, 0, 0, 0, 0]; // Index 0 = 1 star, Index 4 = 5 star
    
    reviews.forEach((r) => {
      const idx = Math.min(Math.max(1, r.rating), 5) - 1;
      dist[idx]++;
    });

    return {
      avg,
      count: reviews.length,
      dist: dist.reverse() // Reverse so 5 star is at index 0
    };
  }, [reviews]);

  return (
    <section id="reviews" className="py-24 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500">
            GUEST STORIES
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-[#F5803B] to-[#F6A6C5] bg-clip-text text-transparent inline-block pb-1">
            Word of Mouth
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed max-w-2xl mx-auto text-pretty">
            We are incredibly grateful for the honest reviews of our regular diners and visitors. Here is what people are saying about our seasonal culinary rotations.
          </p>
        </div>

        {/* Layout Row (Stats Breakdown card + Reviews Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Stats Breakdown Card Column */}
          <div className="lg:col-span-4 bg-stone-900 rounded-2xl border border-stone-850 p-6 space-y-6">
            <h3 className="font-sans font-bold text-white text-base">Rating Distribution</h3>

            {/* Score box */}
            <div className="flex items-center space-x-4">
              <div className="text-white">
                <span className="font-sans font-black text-4xl sm:text-5xl block">{stats.avg}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mt-0.5 block">out of 5.0</span>
              </div>
              <div className="space-y-1">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(stats.avg) ? 'fill-amber-500' : 'text-stone-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-stone-400 font-sans">Based on {stats.count} verified reviews</p>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-2 border-t border-stone-850 pt-4">
              {stats.dist.map((count, index) => {
                const stars = 5 - index;
                const percentage = stats.count > 0 ? (count / stats.count) * 100 : 0;
                return (
                  <div key={index} className="flex items-center text-xs text-stone-400">
                    <span className="w-12 text-[10px] font-mono">{stars} Stars</span>
                    <div className="flex-1 mx-3 h-2 bg-stone-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-6 text-right font-mono text-[10px]">{count}</span>
                  </div>
                );
              })}
            </div>

            {formSuccess && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
                <Plus className="w-4 h-4 shrink-0 rotate-45 text-emerald-500" />
                <span>Thank you! Your review was successfully added below.</span>
              </div>
            )}

            {/* Toggle Leave Review Button */}
            {!showForm ? (
              <button
                id="toggle-review-form"
                onClick={() => setShowForm(true)}
                className="w-full py-3 bg-stone-950 hover:bg-stone-800 text-stone-200 border border-stone-800 font-sans font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Leave Your Feedback</span>
              </button>
            ) : (
              <div className="border-t border-stone-850 pt-4 space-y-4">
                <h4 className="font-sans font-bold text-white text-xs uppercase tracking-wider">Write Review</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Your Name</label>
                    <input
                      id="review-form-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-stone-500 uppercase block">Rating</label>
                    <div className="flex items-center space-x-1.5">
                      {[1, 2, 3, 4, 5].map((starValue) => (
                        <button
                          key={starValue}
                          type="button"
                          id={`star-btn-${starValue}`}
                          onClick={() => setRating(starValue)}
                          className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star className={`w-5 h-5 ${starValue <= rating ? 'fill-amber-500' : 'text-stone-700'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Comment</label>
                    <textarea
                      id="review-form-comment"
                      rows={3}
                      required
                      placeholder="Describe your dining experience, favorite dish, atmosphere..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      id="cancel-review-form"
                      onClick={() => setShowForm(false)}
                      className="py-2.5 bg-stone-850 hover:bg-stone-800 text-stone-300 text-xs font-medium rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      id="submit-review-form"
                      className="py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* List of Reviews Column */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                id={`review-card-${rev.id}`}
                className="bg-stone-900/40 rounded-2xl p-5 border border-stone-900 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'fill-amber-500' : 'text-stone-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-stone-500">{rev.date}</span>
                  </div>

                  <p className="text-stone-300 text-xs leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  {rev.photo && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-stone-850/60 max-h-44">
                      <img
                        src={rev.photo}
                        alt="Diner Moment at Peach &amp; Dine"
                        className="w-full h-40 object-cover filter contrast-[1.03] hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 pt-3 border-t border-stone-900/50">
                  <img
                    src={rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                    alt={rev.name}
                    className="w-8 h-8 rounded-full object-cover border border-amber-500/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-sans font-bold text-stone-100 text-xs">{rev.name}</h4>
                    <span className="text-[9px] font-mono text-stone-500">Verified Diner</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
