import React from 'react';
import { Calendar, ArrowRight, MapPin } from 'lucide-react';

export const NewsEventsSection: React.FC = () => {
  const events = [
    {
      title: 'International Cardiology Summit & Live Angioplasty Workshop',
      category: 'Medical CME & Workshop',
      date: '28 Nov 2026',
      time: '09:00 AM - 05:00 PM',
      location: 'Grand Auditorium, Level 5',
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Annual Free Diabetes & Hypertension Screening Health Camp',
      category: 'Community Health',
      date: '05 Dec 2026',
      time: '08:00 AM - 02:00 PM',
      location: 'Outdoor Complex, Ground Floor',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Symposium on Next-Gen Robotic Spine & Joint Surgery',
      category: 'Surgical Conference',
      date: '12 Dec 2026',
      time: '10:00 AM - 04:00 PM',
      location: 'Convention Center, Building 2',
      image: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section id="news" className="bg-white border-b border-slate-200/90 overflow-hidden">
      {/* Green Ribbon Bar Header (Exact match from screenshot) */}
      <div className="bg-[#007a53] py-3 px-6 sm:px-8 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-300" />
            Hospital News, CME & Medical Events
          </h2>
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider hidden sm:inline">
            Academic & Clinical Calendar
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.title}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#006a4e] text-white px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-md">
                    {event.date}
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-extrabold text-[#007a53] uppercase tracking-wider">
                    {event.category}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-1 mb-2 line-clamp-2 leading-snug group-hover:text-[#006a4e] transition-colors">
                    {event.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#006a4e]">
                <span>Read Full Circular</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default NewsEventsSection;
