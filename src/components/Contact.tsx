import { useState, useEffect, FormEvent } from 'react';
import { Send, Phone, Mail, HelpCircle, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ContactMessage } from '../types';

export default function ContactSection() {
  const { contactMessages: messages, addContactMessage, currentUser } = useApp();
  const [replies, setReplies] = useState<{ [msgId: string]: string }>({});
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Auto-fill details if logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    } else {
      setName('');
      setEmail('');
    }
  }, [currentUser]);
  const [category, setCategory] = useState<'general' | 'reservation' | 'event' | 'feedback'>('general');
  const [messageText, setMessageText] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  // Load message replies on mount
  useEffect(() => {
    const storedReplies = localStorage.getItem('nectar_thyme_replies');
    if (storedReplies) {
      try {
        setReplies(JSON.parse(storedReplies));
      } catch (e) {
        console.error("Error reading replies");
      }
    }
  }, []);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !messageText.trim()) return;

    const newInquiry: ContactMessage = {
      id: 'MSG-' + Math.floor(1000 + Math.random() * 9000),
      name: name.trim(),
      email: email.trim(),
      category,
      message: messageText.trim(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addContactMessage(newInquiry);

    // Simulate automated concierge reply after 2 seconds
    const messageId = newInquiry.id;
    const categoryLabel = {
      general: 'general inquiry',
      reservation: 'table request',
      event: 'private dining / events request',
      feedback: 'culinary feedback'
    }[category];

    const updatedReplies = {
      ...replies,
      [messageId]: `✨ Concierge Bot: Hi ${newInquiry.name}! Thank you for your ${categoryLabel}. One of our team members will review this and respond to ${newInquiry.email} within 2 hours. We look forward to hosting you soon!`
    };

    setReplies(updatedReplies);
    localStorage.setItem('nectar_thyme_replies', JSON.stringify(updatedReplies));

    // Clear fields
    setName('');
    setEmail('');
    setCategory('general');
    setMessageText('');
    
    setStatus('success');
    setTimeout(() => setStatus('idle'), 4000);
  };

  const clearInquiryHistory = () => {
    // Just clear replies local state since messages are handled globally
    setReplies({});
    localStorage.removeItem('nectar_thyme_replies');
  };

  const categoryLabels = {
    general: 'General Info',
    reservation: 'Booking Query',
    event: 'Private Event / Buyout',
    feedback: 'Diner Feedback'
  };

  return (
    <section id="contact" className="py-24 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500">
            GET IN TOUCH
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-[#F5803B] to-[#F6A6C5] bg-clip-text text-transparent inline-block pb-1">
            Connect with Our Team
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed max-w-2xl mx-auto text-pretty">
            Have questions about private buyout options, dietary configurations, or our seasonal schedules? Drop us a line and let our hosts assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact coordinates & History column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Coordinates Card */}
            <div className="bg-stone-900 rounded-2xl border border-stone-850 p-6 space-y-6">
              <h3 className="font-sans font-bold text-white text-base">Direct Channels</h3>
              
              <div className="space-y-4 text-xs">
                {/* Phone */}
                <div className="flex items-center space-x-3 text-stone-300">
                  <div className="p-2 bg-stone-950 border border-stone-800 rounded-lg text-amber-500 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-stone-500">Call Hosts</p>
                    <a href="tel:+15035550192" className="font-sans font-bold hover:text-amber-500 transition-colors">+1 (503) 555-0192</a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-3 text-stone-300">
                  <div className="p-2 bg-stone-950 border border-stone-800 rounded-lg text-amber-500 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-stone-500">Email Inquiries</p>
                    <a href="mailto:welcome@peach&amp;dine.com" className="font-sans font-bold hover:text-amber-500 transition-colors">{"welcome@peach&dine.com"}</a>
                  </div>
                </div>

                {/* Events buyouts */}
                <div className="flex items-center space-x-3 text-stone-300">
                  <div className="p-2 bg-stone-950 border border-stone-800 rounded-lg text-amber-500 shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-stone-500">Events Coordination</p>
                    <a href="mailto:events@peach&amp;dine.com" className="font-sans font-bold text-stone-200 hover:text-amber-500 transition-colors">{"events@peach&dine.com"}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Message History Portal */}
            {messages.length > 0 && (
              <div className="bg-stone-900 rounded-2xl border border-stone-850 p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-stone-850 pb-2">
                  <h4 className="font-sans font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                    <span>Your Inquiry Hub</span>
                  </h4>
                  <button
                    onClick={clearInquiryHistory}
                    className="text-[10px] font-mono text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    Clear History
                  </button>
                </div>

                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-800">
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-2 text-xs">
                      {/* Original Inquiry */}
                      <div className="p-3 bg-stone-950 rounded-xl border border-stone-850 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-stone-500">
                          <span>{categoryLabels[msg.category]}</span>
                          <span>{msg.date}</span>
                        </div>
                        <p className="text-stone-300 leading-normal font-sans">"{msg.message}"</p>
                      </div>

                      {/* Automated Concierge Reply */}
                      {replies[msg.id] && (
                        <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 text-amber-400/90 leading-relaxed font-sans text-[11px] ml-4 flex items-start space-x-2">
                          <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
                          <span>{replies[msg.id]}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-stone-900 p-6 sm:p-8 rounded-2xl border border-stone-850 shadow-2xl space-y-6">
            <h3 className="font-sans font-bold text-white text-lg border-b border-stone-850 pb-4">
              Write to Our Hosts
            </h3>

            {status === 'success' && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Your message was sent successfully. Check the Inquiry Hub on the side for details!</span>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* Inquiry Type category selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Subject / Category</label>
                <select
                  id="contact-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                >
                  <option value="general">General Inquiries</option>
                  <option value="reservation">Reservation Accommodation Query</option>
                  <option value="event">Private Event Booking / Catering</option>
                  <option value="feedback">Diner Feedback &amp; Suggestions</option>
                </select>
              </div>

              {/* Message text area */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Your Message</label>
                <textarea
                  id="contact-message-text"
                  rows={4}
                  required
                  placeholder="Tell us what you have in mind..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                id="btn-send-message"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-sans font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Dispatch Inquiry</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
