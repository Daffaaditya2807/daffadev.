import { memo } from "react";
import { FaGithub, FaLinkedinIn, FaInstagram, FaWhatsapp } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      Icon: FaGithub,
      href: "https://github.com/Daffaaditya2807",
      label: "GitHub",
    },
    {
      Icon: FaLinkedinIn,
      href: "https://www.linkedin.com/in/daffaadityarejasaruswanto/",
      label: "LinkedIn",
    },
    {
      Icon: FaInstagram,
      href: "https://www.instagram.com/daafaditya/",
      label: "Instagram",
    },
    {
      Icon: FaWhatsapp,
      href: "https://wa.me/6285851065295", // Ganti dengan nomor WhatsApp aktifmu
      label: "WhatsApp",
    },
  ];

  return (
    /* 👇 PERUBAHAN UTAMA: 
       Mengubah py-12 menjadi pt-12 pb-28 di mobile, dan pt-12 md:pb-16 di desktop.
       pb-28 (padding-bottom 112px) memastikan teks terdorong ke atas melewati batas tinggi BottomNavigation.
    */
    <footer className="relative z-20 border-t border-white/5 bg-[#070707] pt-12 pb-24 md:pb-8 px-6 text-center">
      <div className="mx-auto max-w-4xl flex flex-col items-center gap-6">
        
        {/* Nama & Status */}
        <div className="flex flex-col items-center space-y-3">
          <h3 className="text-xl font-bold tracking-tight text-white sm:text-4xl">
            Daffa Aditya Rejasa Ruswanto
          </h3>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20 select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Open to Work
          </div>
        </div>

        {/* Kata-kata Terimakasih */}
        <div className="max-w-xl">
          <p className="text-sm leading-relaxed text-gray-400 sm:text-base">
            Terima kasih telah berkunjung! Mari terhubung untuk berdiskusi, berkolaborasi, atau membangun sesuatu yang luar biasa bersama.
          </p>
        </div>

        {/* Sosial Media */}
{/* 👇 Container utama bagian bawah: flex-col memastikan deretan ikon dan copyright menumpuk vertikal ke bawah */}
<div className="flex flex-col items-center gap-4 mt-4 w-full">
  
  {/* Container khusus Ikon Sosial Media (Horizontal) */}
  <div className="flex flex-wrap justify-center items-center gap-4">
    {socialLinks.map(({ Icon, href, label }) => (
      <a
        key={label}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="group rounded-full border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-white/30 hover:bg-white/10"
      >
        <Icon className="h-5 w-5 text-gray-400 transition-colors duration-300 group-hover:text-white sm:h-6 sm:w-6" />
      </a>
    ))}
  </div>

  {/* Teks Copyright sekarang berada tepat di bawah ikon dan otomatis rata tengah */}
  <p className="text-xs text-gray-500 mt-2 select-none pb-2">
    &copy; {currentYear} Daffa. All Rights Reserved.
  </p>
</div>

      </div>

  
    </footer>
  );
}

export default memo(Footer);
