PRD: DevRoast \& Wrapped

Overview \& Goal

Web aplikasi yang menganalisis profil GitHub pengguna (commit history, jam kerja, bahasa pemrograman) untuk menghasilkan statistik ala Spotify Wrapped disertai kalimat sindiran (roast) yang lucu dan siap dibagikan ke media sosial.



Tipe Sistem: Fullstack (All-in-one Framework)



Tech Stack:



Framework: Next.js (App Router, Server Actions, Edge Runtime)



Styling: Tailwind CSS + Shadcn UI + HTML2Canvas/Satori (untuk kalkulasi export image)



AI/LLM: google ai studio



External API: GitHub REST/GraphQL API



Key Features (MVP)

GitHub Auth \& Profile Fetcher: Pengguna memasukkan username GitHub tanpa perantara otentikasi rumit.



Commit \& Activity Analyzer: Mengambil data 100 commit terakhir, jam push, repositori favorit, dan pull request yang terbengkalai.



AI Roast \& Highlight Generator: LLM memproses data statistik kasar menjadi narasi roast tajam dan humoris.



Interactive Card \& Shareable Image: Tampilan slide ala Instastory yang bisa di-download sebagai gambar PNG / SVG.

Architecture Data Flow

User (Input Username) ➔ Next.js Server Action ➔ GitHub API (Fetch Data)

&#x20;                                  ↓

&#x20;                      Google AI Studio API (Generate Roast Text)

&#x20;                                  ↓

&#x20;                      Render Card (Satori / HTML2Canvas) ➔ Export PNG

