export const config = {
  // Tentukan rute mana saja yang ingin dicegat oleh middleware ini
  matcher: ['/blog/:path*', '/quiz'],
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Deteksi bot media sosial yang mengambil link preview
  const isBot = /bot|whatsapp|facebook|twitter|linkedin|discord|telegram|skype|slack/i.test(userAgent);

  // Jika yang datang adalah manusia/browser biasa, biarkan Vercel melayani aplikasi Vite Anda (index.html)
  if (!isBot) {
    return; 
  }

  // ==========================================
  // JIKA YANG DATANG ADALAH BOT MEDIA SOSIAL
  // ==========================================
  
  // Data default sesuai dengan profil dan gambar terbaru
  let title = 'Daffa Aditya R. R. | Mobile & Website Developer';
  let description = 'Portfolio Daffa Aditya R. R., seorang Mobile dan Website Developer yang antusias mempelajari hal baru, membangun aplikasi modern, serta mengembangkan solusi digital yang kreatif dan bermanfaat.';
  let image = 'https://daffadev.vercel.app/port-lanscape.png';

  // Logika dinamis berdasarkan URL yang sedang dibagikan
  if (url.pathname.startsWith('/blog/')) {
    // Ambil slug, contoh: dari "/blog/tembakau" menjadi "tembakau"
    const slug = url.pathname.replace('/blog/', '');
    
    // Format sederhana: mengubah "gweh-daffa" menjadi "Gweh Daffa"
    const formattedTitle = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    title = `${formattedTitle} | Blog Daffa Aditya R. R.`;
    description = `Baca artikel tentang ${formattedTitle} di blog Daffa Aditya R. R.`;
  } 
  else if (url.pathname.startsWith('/quiz')) {
    title = 'Quiz Tech & Code | Daffa Aditya R. R.';
    description = 'Uji pengetahuanmu seputar teknologi dan pemrograman!';
  }

  // Buat HTML statis super ringan khusus untuk dibaca Bot
  const html = `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/port-square.png" />
        
        <title>${title}</title>
        <meta name="title" content="${title}" />
        <meta name="description" content="${description}" />
        
        <meta property="og:type" content="article" />
        <meta property="og:url" content="${url.href}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${image}" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="${url.href}" />
        <meta property="twitter:title" content="${title}" />
        <meta property="twitter:description" content="${description}" />
        <meta property="twitter:image" content="${image}" />
      </head>
      <body>
        <h1>${title}</h1>
        <p>${description}</p>
      </body>
    </html>
  `;

  // Kembalikan Response HTML langsung dari server Edge Vercel
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}