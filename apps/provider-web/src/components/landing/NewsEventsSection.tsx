import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export const NewsEventsSection: React.FC = () => {
  const events = [
    {
      title: 'International Cardiology Summit & Live Angioplasty Workshop',
      category: 'Medical CME & Workshop',
      date: '28 Nov 2026',
      time: '09:00 AM - 05:00 PM',
      location: 'Grand Auditorium, Level 5',
      accent: 'green' as const,
      image:
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Annual Free Diabetes & Hypertension Screening Health Camp',
      category: 'Community Health',
      date: '05 Dec 2026',
      time: '08:00 AM - 02:00 PM',
      location: 'Outdoor Complex, Ground Floor',
      accent: 'teal' as const,
      image:
        'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Symposium on Next-Gen Robotic Spine & Joint Surgery',
      category: 'Surgical Conference',
      date: '12 Dec 2026',
      time: '10:00 AM - 04:00 PM',
      location: 'Convention Center, Building 2',
      accent: 'green' as const,
      image:
        'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section id="news" className="py-14 bg-[#f2f8f5] border-b border-emerald-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="text-xs font-bold text-[#006a4e] mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0094b6]" />
              <span>Academic & Clinical Calendar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hospital News, CME & Medical Events
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Upcoming medical symposiums, free screening camps, and clinical announcements.
            </p>
          </div>

          <a
            href="#news"
            className="text-xs font-bold text-[#006a4e] hover:text-[#0094b6] transition-colors"
          >
            <span>All News & Circulars</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((event) => {
            const isGreen = event.accent === 'green';
            return (
              <div
                key={event.title}
                className="bg-white rounded-md p-5 border border-emerald-200/70 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative rounded-md overflow-hidden aspect-16/10 mb-4 border border-slate-100 bg-slate-100">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#006a4e] text-white px-2.5 py-1 rounded-md text-[10px] font-bold shadow-xs">
                      {event.date}
                    </div>
                  </div>

                  <span
                    className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-md ${
                      isGreen
                        ? 'text-[#006a4e] bg-[#006a4e]/10'
                        : 'text-[#0094b6] bg-[#0094b6]/10'
                    }`}
                  >
                    {event.category}
                  </span>

                  <h3 className="font-extrabold text-slate-900 text-sm mt-2.5 mb-2 line-clamp-2 leading-snug">
                    {event.title}
                  </h3>

                  <div className="space-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0094b6] shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 text-xs font-bold text-[#006a4e]">
                  <span>Read Full Circular</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewsEventsSection;
