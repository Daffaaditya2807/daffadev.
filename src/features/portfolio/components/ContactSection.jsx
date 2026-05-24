import { useRef, useState } from "react";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EMAIL_SERVICE_ID = import.meta.env.VITE_EMAIL_SERVICE_ID;
const EMAIL_TEMPLATE_ID = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
const EMAIL_PUBLIC_KEY = import.meta.env.VITE_EMAIL_PUBLIC_KEY;

function ContactSection() {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formRef.current) return;

    setIsSubmitting(true);

    try {
      console.log("Public Key saya:", EMAIL_PUBLIC_KEY);
      await emailjs.sendForm(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        formRef.current,
        EMAIL_PUBLIC_KEY
      );

      toast.success("✅ Pesan berhasil dikirim!", {
        position: "bottom-right",
      });

      formRef.current.reset();
    } catch (error) {
      toast.error("❌ Gagal mengirim pesan. Silakan coba lagi.", {
        position: "bottom-right",
      });

      console.error("EmailJS Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl animate-fade-in text-center">
      <h2 className="mb-8 text-4xl font-bold text-white md:text-5xl">
        Let&apos;s Connect
      </h2>

      <p className="mb-4 text-lg text-gray-300">
        Saya selalu terbuka untuk berdiskusi tentang peluang baru dan
        proyek-proyek menarik. Mari ciptakan sesuatu yang luar biasa bersama!
      </p>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mb-4 rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm"
      >
        <div className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Nama Kamu"
            required
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Kamu"
            required
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          <textarea
            name="message"
            placeholder="Pesan Kamu"
            rows={5}
            required
            className="w-full resize-none rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-white py-3 font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-gray-200 disabled:scale-100 disabled:bg-gray-400 disabled:text-gray-700"
          >
            {isSubmitting ? "Mengirim..." : "Mengirim Pesan"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </section>
  );
}

export default ContactSection;
