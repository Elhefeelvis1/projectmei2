import React, { useState } from 'react';
import { Mail, Target, ShieldCheck } from 'lucide-react';
import Telegram from "../../assets/telegram.svg?react";
import Whatsapp from "../../assets/whatsapp.svg?react";

const ContactUs = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formState;
    const subject = encodeURIComponent("Customer Service Request");
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:campusmartnigeria@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

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
      bio: 'Electronic and Computer Engineering graduate who built and ran a successful phone repair and accessories sales business while a student. Elvis brings firsthand marketing intelligence, hands-on technical kills and operational execution — having lived the student-entrepreneur experience at a Nigerian university.',
      imageUrl: '', // PLACEHOLDER URL FOR ELVIS'S PHOTO
    },
  ];

  return (
    <section id="contact-us" className="bg-slate-50 pb-10 px-4 sm:px-6 lg:px-8">
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

        {/* --- Contact Form & Support Channels --- */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 text-left">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Send us a message</h3>
            <p className="text-slate-500 mb-8">Have a question or feedback? Fill out the form below and we'll get right back to you.</p>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label htmlFor="user-name" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  id="user-name"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <div>
                <label htmlFor="user-email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  id="user-email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <div>
                <label htmlFor="user-message" className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea
                  id="user-message"
                  required
                  rows="5"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all placeholder:text-slate-400 resize-none text-slate-900"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              >
                <Mail className="w-5 h-5" />
                Send Message via Email
              </button>
            </form>
          </div>

          {/* Social Support Channels Card */}
          <div className="flex flex-col justify-between bg-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden text-left">
            {/* Decorative bg glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Connect Directly</h3>
              <p className="text-indigo-200 mb-8">Need instant help? Connect with our support team directly on Telegram or WhatsApp for live assistance.</p>

              <div className="space-y-4">
                {/* Telegram Button */}
                <a
                  href="https://t.me/campusmart_nigeria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-sky-500 hover:bg-sky-600 text-white p-5 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
                >
                  <Telegram fill="currentColor" className="size-6" />
                  <span>Chat on Telegram</span>
                </a>

                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/message/P7QLK5SJWDUQB1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
                >
                  <Whatsapp fill="currentColor" className="size-6" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Support hours info */}
            <div className="relative z-10 mt-12 pt-6 border-t border-indigo-900/60 text-sm text-indigo-300">
              <p>🕒 Support Hours: Monday to Sunday, 9 AM - 6 PM</p>
              <p className="mt-1">📧 Email response time: Usually within a few hours</p>
            </div>
          </div>

        </div>

        {/* --- Optional: General Contact Method --- */}
        <div className="mt-20 text-center">
          <a
            href="mailto:campusmartsuggestions@gmail.com"
            className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-md hover:bg-green-700 transition"
          >
            <Mail className="w-6 h-6" />
            Give us a suggestion.
          </a>
        </div>

      </div>
    </section>
  );
};

export default ContactUs;