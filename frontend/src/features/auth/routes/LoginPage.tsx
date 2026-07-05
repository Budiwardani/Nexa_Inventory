import { motion } from 'framer-motion';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.24),_transparent_26%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.16),_transparent_26%)]" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/90 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="mb-6 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-4 text-center shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300 opacity-80">Nexa Manufacturing Portal</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">Login with your company credentials to access inventory, users, roles and manufacturing workflow controls.</p>
          </div>
          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
};
