# Safe Route AI - Frontend

Safe Route AI is a modern web application designed to provide safe and efficient routing solutions. This frontend is built with React, Vite, and Tailwind CSS, leveraging powerful mapping and animation libraries to deliver an immersive user experience.

## 🚀 Key Features

- **Interactive Maps**: Integrated with Leaflet and Mapbox GL for detailed and responsive mapping.
- **Safe Routing**: Intelligent route calculation focusing on safety.
- **Modern UI/UX**: Styled with Tailwind CSS and enhanced with Framer Motion and GSAP animations.
- **Real-time Data**: Firebase integration for backend services and real-time updates.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Maps**: [Leaflet](https://leafletjs.com/), [React Leaflet](https://react-leaflet.js.org/), [Mapbox GL](https://docs.mapbox.com/mapbox-gl-js/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/)
- **Backend/Auth**: [Firebase](https://firebase.google.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/), [Heroicons](https://heroicons.com/)

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd Safe-Route-Ai/frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root of the `frontend` directory and add your necessary environment variables (e.g., Firebase config, Mapbox tokens).
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    ...
    ```

## 🏃‍♂️ Usage

### Development Server
Start the development server with hot reload:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### Build for Production
Build the application for production:
```bash
npm run build
```

### Preview Production Build
Preview the built application locally:
```bash
npm run preview
```

### Linting
Run ESLint to check for code quality issues:
```bash
npm run lint
```

## 📂 Project Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI components
│   ├── context/     # React Context definitions
│   ├── lib/         # Utility libraries and configurations
│   ├── pages/       # Application pages/routes
│   ├── services/    # API services and helpers
│   ├── App.tsx      # Main application component
│   ├── main.tsx     # Entry point
│   └── ...
├── .env             # Environment variables
├── index.html       # HTML entry point
├── package.json     # Dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.ts   # Vite configuration
```

## 🤝 Contributing

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
