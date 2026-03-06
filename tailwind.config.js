/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Jalur untuk App Router
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Tambahkan ini jika kamu pakai folder src
  ],
  theme: {
    extend: {
      colors: {
        // Kamu bisa tambah warna custom di sini jika mau
      },
    },
  },
  plugins: [],
};
