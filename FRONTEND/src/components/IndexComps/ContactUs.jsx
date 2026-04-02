import React from 'react';
import { Mail, ShieldCheck, Target } from 'lucide-react';

const ContactUs = () => {
  const team = [
    {
      initials: 'DI',
      name: 'Dikeocha Nkwachukwu Innocent',
      title: 'Founder & CEO',
      bio: 'Former teacher, Sales Associate and Warehouse Manager at Ginnons Electronics, clothing business founder, and cryptocurrency investor. Dikeocha brings operational depth and entrepreneurial instinct to CampusMart\'s vision and growth strategy.',
      imageUrl: '', // PLACEHOLDER URL FOR DIKEOCHA'S PHOTO
    },
    {
      initials: 'IE',
      name: 'Igwilo Mmaduabuchi Elvis',
      title: 'Co-founder & COO',
      bio: 'Business Administration graduate who built and ran a successful campus laundry service from scratch. Elvis brings firsthand marketing intelligence and operational execution — having lived the student-entrepreneur experience at a Nigerian university.',
      imageUrl: '', // PLACEHOLDER URL FOR ELVIS'S PHOTO
    },
  ];

  return (
    <section id="contact-us" className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Section Header --- */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold text-slate-950 tracking-tight">Contact Us</h1>
          <div className="mt-3 h-1.5 w-24 bg-green-600 mx-auto rounded-full"></div>
        </div>

        {/* --- The Team Section --- */}
        <div className="mb-24">
          <div className="max-w-3xl mb-16 border-l-4 border-green-500 pl-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">The Team</h2>
            <p className="text-xl text-green-700 font-semibold mb-3">
              Built by students who lived the problem
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              Both founders came up through Nigerian campuses, running real businesses. They know exactly what students face — because they faced it too.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {team.map((founder, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white p-8 rounded-3xl shadow-lg border border-slate-100 transition hover:shadow-xl hover:-translate-y-1">
                
                {/* Founder Image / Initials Placeholder */}
                <div className="flex-shrink-0 relative">
                  {founder.imageUrl ? (
                    <img 
                      src={founder.imageUrl} 
                      alt={founder.name} 
                      className="w-28 h-28 rounded-full object-cover border-4 border-green-100"
                    />
                  ) : (
                    // Elegant fallback if no image URL is provided
                    <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center border-4 border-green-100">
                      <span className="text-4xl font-bold text-green-300 tracking-tight">
                        {founder.initials}
                      </span>
                    </div>
                  )}
                  {/* Subtle decorative dot */}
                  <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-green-500 border-4 border-white"></div>
                </div>

                {/* Founder Info */}
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-2xl font-bold text-slate-950">{founder.name}</h3>
                  <p className="text-lg text-green-600 font-medium mb-4">{founder.title}</p>
                  <p className="text-base text-slate-700 leading-relaxed">
                    {founder.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Vision & Mission Section --- */}
        <div className="max-w-7xl mx-auto p-12 bg-indigo-950 rounded-[2rem] shadow-2xl text-white">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            
            {/* Our Vision */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 p-4 bg-indigo-900 rounded-2xl border border-indigo-800">
                <Target className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h3 className="text-3xl font-semibold mb-4 text-green-300">Our Vision</h3>
                <p className="text-xl text-indigo-100 leading-relaxed font-light">
                  To become the leading student-owned and student-operated digital marketplace in Nigeria — a platform that belongs to the students it serves.
                </p>
              </div>
            </div>

            {/* Our Mission */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 p-4 bg-indigo-900 rounded-2xl border border-indigo-800">
                <ShieldCheck className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h3 className="text-3xl font-semibold mb-4 text-green-300">Our Mission</h3>
                <p className="text-xl text-indigo-100 leading-relaxed font-light">
                  To provide Nigerian tertiary students with a safe, transparent, and affordable platform they can truly call their own — eliminating fraud, hidden fees, and inequality in student commerce.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* --- Optional: General Contact Method --- */}
        <div className="mt-20 text-center">
          <a 
            href="mailto:contact@campusmart.ng" 
            className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-md hover:bg-green-700 transition"
            >
            <Mail className="w-6 h-6" />
            Reach the Founders Directly
          </a>
        </div>

      </div>
    </section>
  );
};

export default ContactUs;