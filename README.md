# Rouni Gorgees - Portfolio

A modern, responsive portfolio website built with React, showcasing my skills, projects, and professional experience.

## 🚀 Features

- **Modern Design**: Clean and professional UI with smooth animations
- **Responsive Layout**: Fully responsive design that works on all devices
- **Accessible**: Keyboard navigation, skip link, and good color contrast
- **Interactive Elements**: Engaging animations and hover effects
- **Project Showcase**: Detailed project cards with GitHub links
- **Skills Visualization**: Interactive skills section with proficiency levels
- **Experience Timeline**: Professional experience with company details
- **Education Section**: Academic background and certifications
- **Contact Form**: Easy way to get in touch (with EmailJS integration)
- **Dark/Light Mode**: Theme switching functionality
- **PWA Ready**: Favicon, manifest, and installable on mobile

## 🛠️ Tech Stack

- **Frontend**: React, Vite
- **Styling**: CSS Modules, Custom Properties
- **Icons**: React Icons
- **Animations**: CSS Animations
- **Routing**: React Router
- **Deployment**: Vercel/Netlify

## 🆕 Recent Improvements

- Added a "Skip to content" link for accessibility
- Moved EmailJS public key to environment variable (`.env`)
- Added favicon (SVG & PNG) and web app manifest for PWA support
- Apple touch icon for iOS
- Ready for privacy-friendly analytics (Plausible/Fathom)

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Ronniegrg/portfolio.git
   ```

2. Install dependencies:

   ```bash
   cd portfolio
   npm install
   ```

3. Set up EmailJS for the contact form:

   - Create an account at [EmailJS](https://www.emailjs.com/)
   - Create a new email service
   - Create an email template with the following variables: `{{name}}`, `{{email}}`, `{{subject}}`, `{{message}}`
   - Get your public key from the dashboard

4. Create a `.env` file in the project root (copy from `.env.example`):

   ```env
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Build for production:
   ```bash
   npm run build
   ```

## 🎨 Project Structure

```
portfolio/
├── public/              # Static assets (favicon, manifest, PDFs, etc.)
│   ├── rg-logo.svg      # Main logo (SVG)
│   ├── rg-logo-192.png  # Favicon/manifest icon (192x192)
│   ├── rg-logo-512.png  # Manifest icon (512x512)
│   ├── manifest.webmanifest # Web app manifest
│   └── ...
├── src/
│   ├── assets/         # Images and other media
│   ├── components/     # Reusable components
│   ├── context/        # React context providers
│   ├── data/           # Data files
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Page components
│   ├── styles/         # Global styles
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
├── .env                # Environment variables (not committed)
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## 🎯 Key Components

- **Home**: Hero section with introduction
- **About**: Professional background and skills
- **Projects**: Portfolio of work
- **Contact**: Get in touch form (uses EmailJS, see .env)
- **Footer**: Social links and copyright

## 🎨 Styling Features

- CSS Modules for scoped styling
- Custom properties for theming
- Responsive design patterns
- Modern animations and transitions
- Interactive hover effects
- Gradient text and backgrounds

## 🔧 Customization

1. Update personal information in the respective components
2. Modify colors in the CSS variables
3. Add/remove projects in the Projects component
4. Update skills and experience in the About component
5. Customize animations in the CSS modules
6. Update favicon/logo in `public/`
7. Update manifest in `public/manifest.webmanifest`

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints for different screen sizes
- Flexible grid layouts
- Adaptive typography
- Touch-friendly interactions

## 🌐 PWA & Favicon

- Favicon and manifest icons are in `public/` (SVG and PNG)
- `manifest.webmanifest` enables installability and PWA features
- Apple touch icon for iOS support

## 🔒 Environment Variables

- **EmailJS**: Store your public key in `.env` as `VITE_EMAILJS_PUBLIC_KEY`
- **Never commit your `.env` file** (it's in `.gitignore`)

## 📊 Analytics (Optional)

To add privacy-friendly analytics (like Plausible or Fathom):

1. Sign up at [plausible.io](https://plausible.io/) or [usefathom.com](https://usefathom.com/)
2. Add their script to `index.html` with your domain when ready

## 🚀 Deployment

The portfolio can be deployed to any static hosting service:

1. Vercel:

   ```bash
   npm install -g vercel
   vercel
   ```

2. Netlify:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

- **Rouni Gorgees**
- GitHub: [@Ronniegrg](https://github.com/Ronniegrg)
- LinkedIn: [Rouni Gorgees](https://www.linkedin.com/in/rouni-gorgees-207b56167/)

## 🙏 Acknowledgments

- React Icons for the icon library
- Vite for the build tool
- All contributors and supporters

---

Made with ❤️ by Rouni Gorgees
