"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
};

export default function HomePage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  // State for mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${apiUrl}/doctors`)
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#093461] scroll-smooth">
      {/* --- NAVBAR --- */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* LOGO SECTION */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="/logo.png"
                  alt="Docora Clinic Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl md:text-2xl font-bold tracking-tight flex items-center">
                <span className="text-[#093461]">Doco</span>
                <span className="text-[#289276]">ra</span>
                <span className="ml-2 text-[#093461] font-light hidden sm:inline">
                  Clinic
                </span>
              </span>
            </div>

            {/* DESKTOP NAV LINKS (Hidden on Mobile) */}
            <div className="hidden md:flex space-x-8 text-sm font-semibold items-center">
              <a
                href="#"
                className="text-[#093461] hover:text-[#289276] transition-colors"
              >
                Home
              </a>
              <a
                href="#doctors"
                className="text-[#093461] hover:text-[#289276] transition-colors"
              >
                Our Doctors
              </a>
              <a
                href="#about"
                className="text-[#093461] hover:text-[#289276] transition-colors"
              >
                About Us
              </a>
              <a
                href="#contact"
                className="text-[#093461] hover:text-[#289276] transition-colors"
              >
                Contact
              </a>
              <button className="bg-[#093461] text-white px-6 py-2.5 rounded-full hover:bg-[#072a4e] transition-all shadow-md active:scale-95">
                My Appointments
              </button>
            </div>

            {/* MOBILE HAMBURGER BUTTON (Visible only on Mobile) */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-[#093461] p-2 focus:outline-none"
              >
                {/* Dynamic Icon: Changes between Hamburger and X */}
                {isMenuOpen ? (
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 absolute w-full left-0 shadow-lg animate-in slide-in-from-top duration-300">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a
                href="#"
                onClick={closeMenu}
                className="block px-3 py-4 text-base font-bold text-[#093461] border-b border-slate-50"
              >
                Home
              </a>
              <a
                href="#doctors"
                onClick={closeMenu}
                className="block px-3 py-4 text-base font-bold text-[#093461] border-b border-slate-50"
              >
                Our Doctors
              </a>
              <a
                href="#about"
                onClick={closeMenu}
                className="block px-3 py-4 text-base font-bold text-[#093461] border-b border-slate-50"
              >
                About Us
              </a>
              <a
                href="#contact"
                onClick={closeMenu}
                className="block px-3 py-4 text-base font-bold text-[#093461] border-b border-slate-50"
              >
                Contact
              </a>
              <div className="pt-4">
                <button className="w-full bg-[#093461] text-white px-6 py-4 rounded-xl font-bold">
                  My Appointments
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="bg-white py-16 md:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-[#093461] mb-6 leading-tight">
            Professional Care, <br />
            <span className="text-[#289276]">Closer to You.</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Experience world-class healthcare at{" "}
            <span className="font-bold text-[#093461]">Docora Clinic</span>. Our
            specialists are dedicated to providing personalized treatment for
            you and your family.
          </p>
          <div className="mt-10">
            <a
              href="#doctors"
              className="bg-[#289276] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#217a63] transition-all shadow-lg shadow-teal-100 inline-block"
            >
              Find a Specialist
            </a>
          </div>
        </div>
      </header>

      {/* --- DOCTORS GRID --- */}
      <main id="doctors" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#093461]">
              Available Specialists
            </h2>
            <p className="text-[#289276] font-medium mt-1">
              Book your session in seconds
            </p>
          </div>
          <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-sm font-bold border border-slate-200 self-start">
            {doctors.length} Doctors Found
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#289276]"></div>
            <p className="mt-4 text-slate-400 font-medium">
              Loading Specialists...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="group bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 hover:shadow-2xl hover:border-[#289276]/20 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#289276]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#289276] transition-colors duration-300">
                  <svg
                    className="w-8 h-8 text-[#093461] group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#093461] mb-2">
                  {doctor.name}
                </h3>
                <p className="text-[#289276] font-bold text-sm mb-6 uppercase tracking-widest">
                  {doctor.specialty}
                </p>
                <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-tighter">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Available Today
                  </div>
                  <button className="bg-[#093461] text-white text-sm px-6 py-3 rounded-xl font-bold hover:bg-[#289276] transition-all shadow-md active:scale-95">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- ABOUT SECTION --- */}
      <section
        id="about"
        className="bg-white py-16 md:py-24 border-y border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* IMAGE CONTAINER */}
          <div className="relative h-[350px] md:h-[500px] group order-2 md:order-1">
            {/* Decorative Background Element (Teal Glow) */}
            <div className="absolute -inset-4 bg-[#289276]/5 rounded-[3rem] blur-2xl group-hover:bg-[#289276]/10 transition-all duration-500"></div>

            <div className="relative h-full w-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl shadow-slate-200">
              <Image
                src="/about.png"
                alt="Docora Clinic Facility"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              {/* Overlay for a more professional look */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#093461]/20 to-transparent"></div>
            </div>

            {/* Experience Badge */}
            <div className="absolute -bottom-2 -right-2 md:right-2 bg-[#093461] text-white p-6 rounded-4xl shadow-xl hidden sm:block">
              <p className="text-xl font-bold">15+</p>
              <p className="text-xs uppercase tracking-widest font-medium text-teal-400">
                Years Experience
              </p>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-black text-[#093461] mb-6">
              Why Choose Docora?
            </h2>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-6">
              At <span className="text-[#093461] font-bold">Docora Clinic</span>
              , we combine medical excellence with advanced technology to ensure
              the best care for our patients.
            </p>
            <ul className="space-y-4">
              {[
                {
                  title: "Expert Doctors",
                  desc: "Top-rated specialists in every field.",
                },
                {
                  title: "Modern Technology",
                  desc: "Latest medical equipment and digital records.",
                },
                {
                  title: "Patient First",
                  desc: "Personalized care plans tailored to you.",
                },
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="w-6 h-6 bg-[#289276]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-[#289276] rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#093461]">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#093461] mb-4">
              Get In Touch
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
              Our dedicated support team is available around the clock to assist
              you with any inquiries or special requests.
              <br className="hidden md:block" />
              Reach out today and experience the personalized, expert care that
              defines the Docora Clinic journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1: Location */}
            <div className="bg-white p-8 rounded-[2rem] text-center border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-[#093461]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#093461]">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-[#093461] mb-2">Our Location</h4>
              <p className="text-slate-500 text-sm">
                123 Medical Plaza, Health City
              </p>
            </div>

            {/* Card 2: WhatsApp */}
            <div className="bg-white p-8 rounded-[2rem] text-center border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-[#289276]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#289276]">
                {/* WhatsApp SVG Icon */}
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.895-5.335 11.898-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <h4 className="font-bold text-[#093461] mb-2">WhatsApp Us</h4>
              <p className="text-slate-500 text-sm font-medium">
                +1 (234) 567-890
              </p>
            </div>

            {/* Card 3: Email */}
            <div className="bg-white p-8 rounded-[2rem] text-center border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-[#093461]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#093461]">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-[#093461] mb-2">Email Address</h4>
              <p className="text-slate-500 text-sm">contact@docora.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#093461] py-2 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <span className="text-xl font-bold text-white">Doco</span>
            <span className="text-xl font-bold text-[#289276]">ra</span>
            <span className="text-xl text-white">&nbsp; Clinic</span>
          </div>
          <p className="text-white/40 text-xs font-medium">
            © {new Date().getFullYear()} Docora Clinic. Designed for Excellence.
          </p>
        </div>
      </footer>
    </div>
  );
}
