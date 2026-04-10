/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan all project source files for used classes
  content: ['./projects/*/src/**/*.{ts,html}', './libs/**/*.ts'],
  theme: {
    extend: {
      // Design tokens del sistema QuizArena
      // Usamos oklch: colores perceptualmente uniformes y más vibrantes que hex
      colors: {
        'qa-bg':      'oklch(8%  0.020 285)',   // #09090f — casi negro frío
        'qa-surface': 'oklch(12% 0.020 285)',   // superficie elevada
        'qa-violet':  'oklch(45% 0.280 295)',   // #7c3aed — primario
        'qa-cyan':    'oklch(70% 0.180 200)',   // #06b6d4 — secundario
        'qa-amber':   'oklch(78% 0.180  75)',   // #f59e0b — acento/gold
        'qa-green':   'oklch(72% 0.190 160)',   // #10b981 — éxito
        'qa-rose':    'oklch(63% 0.240  15)',   // #f43f5e — error
        // Colores de las opciones de respuesta (A=azul, B=amber, C=verde, D=rosa)
        'opt-a': 'oklch(60% 0.200 245)',
        'opt-b': 'oklch(78% 0.180  75)',
        'opt-c': 'oklch(72% 0.190 160)',
        'opt-d': 'oklch(63% 0.240  15)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],  // títulos geométricos
        body:    ['"Inter"',         'sans-serif'],  // cuerpo legible
        mono:    ['"JetBrains Mono"','monospace'],   // códigos de sala
      },
      backdropBlur: {
        glass: '20px',
      },
      animation: {
        'pulse-slow':    'pulse 3s ease-in-out infinite',
        'slide-up':      'slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards',
        'fade-in':       'fadeIn 0.2s ease-out forwards',
        'scale-in':      'scaleIn 0.3s cubic-bezier(0.34,1.3,0.64,1) forwards',
        'rotate-border': 'rotateBorder 4s linear infinite',
        'float':         'float 6s ease-in-out infinite',
      },
      keyframes: {
        slideUp:  { from: { transform: 'translateY(100%)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        fadeIn:   { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn:  { from: { opacity: 0, transform: 'scale(0.9)' }, to: { opacity: 1, transform: 'scale(1)' } },
        rotateBorder: { to: { '--angle': '360deg' } },
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
      },
      boxShadow: {
        'glow-violet': '0 0 40px rgba(124,58,237,0.35)',
        'glow-cyan':   '0 0 40px rgba(6,182,212,0.35)',
        'glow-amber':  '0 0 40px rgba(245,158,11,0.35)',
        'glow-sm-violet': '0 0 16px rgba(124,58,237,0.4)',
      },
      backgroundImage: {
        'hero-gradient':  'radial-gradient(ellipse at 50% -10%, oklch(15% 0.06 295) 0%, oklch(8% 0.02 285) 65%)',
        'game-gradient':  'radial-gradient(ellipse at 50% 30%, oklch(11% 0.04 285) 0%, oklch(8% 0.02 285) 70%)',
        'podium-gradient':'radial-gradient(ellipse at 50% 0%, oklch(12% 0.08 295) 0%, oklch(8% 0.02 285) 70%)',
        'grad-primary':   'linear-gradient(135deg, oklch(45% 0.28 295), oklch(70% 0.18 200))',
        'grad-amber':     'linear-gradient(135deg, oklch(78% 0.18 75), oklch(60% 0.18 55))',
      },
    },
  },
  plugins: [],
};
