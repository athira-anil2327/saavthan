# Saavthan (Vault)

> **Zero-trace workspace for secure document access on shared computers.**

[![SvelteKit](https://img.shields.io/badge/SvelteKit-3.0-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn-svelte](https://img.shields.io/badge/shadcn--svelte-Nova-black)](https://shadcn-svelte.com/)

**Vault** is designed specifically for cyber cafés, Common Service Centres (CSCs), and public kiosks where citizens access sensitive documents (such as e-Aadhaar, PAN cards, banking statements, and government records). 

Vault provides an isolated, ephemeral workspace during the customer's session. When closed, all downloaded files, cached credentials, and browsing traces are wiped, ensuring no customer data remains on the shared host machine.

---

## 🚀 Key Features

- 🔒 **Zero Trace Guarantee**: Automatically wipes session artifacts, credentials, and temporary downloads upon exit.
- 🏢 **Operator Focused**: Built for easy deployment and management by cyber-café and CSC operators.
- 📦 **Self-Hostable**: Containerized deployment with Docker Compose on any standard infrastructure.
- ⚡ **Modern Stack**: Built with SvelteKit 2, Svelte 5 Runes, TypeScript, and shadcn-svelte with the Nova theme.
- 📱 **Responsive & Clean**: Enterprise-grade UI inspired by modern developer platforms.

---

## 🛠️ Project Structure

```
.
├── src/
│   ├── lib/
│   │   ├── assets/              # Static media & icons
│   │   ├── components/
│   │   │   ├── ui/              # shadcn-svelte UI components
│   │   │   └── Navbar.svelte    # Global public navigation
│   │   ├── hooks/               # Reactive Svelte hooks
│   │   └── utils.ts             # Class merging & utility helpers
│   └── routes/
│       ├── +layout.svelte       # Root layout & theme styles
│       ├── +page.svelte         # Vault Public Home Page
│       ├── login/               # Sign In / Authentication page
│       ├── selfhost/            # Interactive Self-Host Documentation
│       ├── download/            # Multi-platform installer downloads
│       └── dashboard-01/        # Operator Dashboard & management views
├── static/                      # Static public assets
├── components.json              # shadcn-svelte configuration
└── package.json
```

---

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+ or v22+
- `npm` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/athira-anil2327/saavthan.git
   cd saavthan
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:5173](http://localhost:5173).

---

## 🐳 Self-Hosting with Docker

You can run Vault containerized using Docker Compose:

1. **Copy the environment configuration:**
   ```bash
   cp .env.example .env
   ```

2. **Start Vault in background mode:**
   ```bash
   docker compose up -d
   ```

3. **View logs:**
   ```bash
   docker compose logs -f
   ```

---

## 📋 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite dev server with hot reload |
| `npm run build` | Builds the project for production |
| `npm run preview` | Previews the production build locally |
| `npm run check` | Runs SvelteKit type checks & diagnostics |
| `npm run lint` | Runs Prettier & ESLint checks |
| `npm run format` | Auto-formats code with Prettier |

---

## 🛡️ License

This project is licensed under the MIT License.
