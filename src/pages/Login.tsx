import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, Mail, Loader2 } from 'lucide-react';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Registration successful! Please check your email for verification.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative z-20 p-4">
      <div className="border border-neon p-8 bg-slate-900/90 max-w-md w-full backdrop-blur-md shadow-[0_0_50px_rgba(34,211,238,0.1)] relative overflow-hidden">
        {/* Decorative corner markers */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

        <h1 className="text-2xl font-bold text-neon mb-6 text-center border-b border-cyan-400/30 pb-4">
          {isSignUp ? 'NEW OPERATOR REGISTRATION' : 'SECURE ACCESS'}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1 text-cyan-400/70 uppercase tracking-wider">
              Identity // Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400/50" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-cyan-400/30 p-2 pl-10 text-cyan-400 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all placeholder-cyan-900"
                placeholder="operator@void.console"
              />
            </div>
          </div>
          <div>
             <label className="block text-xs font-bold mb-1 text-cyan-400/70 uppercase tracking-wider">
               Access Key // Password
             </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400/50" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-slate-950 border border-cyan-400/30 p-2 pl-10 text-cyan-400 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all placeholder-cyan-900"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-cyan-400/10 border border-cyan-400 text-cyan-400 font-bold hover:bg-cyan-400 hover:text-slate-950 transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isSignUp ? 'INITIALIZE REGISTRATION' : 'AUTHENTICATE'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-cyan-400/60 hover:text-cyan-400 hover:underline transition-colors uppercase tracking-wider"
          >
            {isSignUp ? 'Already have an ID? Login' : 'Request new credentials'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
