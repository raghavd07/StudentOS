import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_60%)]" />

      <div className="relative text-center">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-700 border-t-indigo-500 mx-auto"></div>
        <p className="mt-6 text-slate-400 tracking-wide">
          Loading StudentOS...
        </p>
      </div>
    </div>
  );
}


  return user ? <Dashboard /> : <Auth />;
}

export default App;
