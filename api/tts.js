// File ini berjalan di SERVER (misal: di-hosting gratis di Vercel).
// File ini TIDAK BISA dilihat oleh pengguna/pembeli aplikasi Anda.

export default async function handler(req, res) {
    // 1. Tolak permintaan jika bukan POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metode tidak diizinkan' });
    }

    try {
        const payload = req.body;
        
        // 2. Ambil API Key rahasia dari Environment Variables server Anda.
        // Di dashboard Vercel, Anda tinggal memasukkan GEMINI_API_KEY = "AIzaSy..."
        const apiKey = process.env.GEMINI_API_KEY; 

        if (!apiKey) {
            return res.status(500).json({ error: 'API Key Server belum dikonfigurasi!' });
        }

        // 3. Teruskan permintaan dari aplikasi pengguna ke Google Gemini
        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

        const response = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Gagal menghubungi Google API');
        }

        // 4. Kembalikan data suara MP3 ke aplikasi pengguna
        const data = await response.json();
        res.status(200).json(data);
        
    } catch (error) {
        console.error("Error Proxy:", error);
        res.status(500).json({ error: 'Terjadi kesalahan internal pada server' });
    }
}