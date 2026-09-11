import { Outlet, NavLink } from 'react-router-dom';
import { Home, Radio, Trophy, Shield, Heart, Search, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/live', label: 'Live', icon: Radio },
    { to: '/leagues', label: 'Leagues', icon: Trophy },
    { to: '/teams', label: 'Teams', icon: Shield },
    { to: '/favorites', label: 'Favorites', icon: Heart },
    { to: '/search', label: 'Search', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans flex flex-col pb-16 md:pb-0">
      {/* Desktop Header */}
      <header className="hidden md:flex sticky top-0 z-50 h-16 items-center px-8 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="flex items-center gap-2 mr-8">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <Radio className="w-4 h-4 text-zinc-950" />
          </div>
          <span className="font-bold text-xl tracking-tight">PitchLive</span>
        </div>
        
        <nav className="flex items-center gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                isActive 
                  ? "bg-zinc-800 text-zinc-50" 
                  : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex sticky top-0 z-50 h-14 items-center justify-between px-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <Radio className="w-3 h-3 text-zinc-950" />
          </div>
          <span className="font-bold text-lg tracking-tight">PitchLive</span>
        </div>
        <NavLink to="/search" className="p-2 text-zinc-400 hover:text-zinc-50">
          <Search className="w-5 h-5" />
        </NavLink>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-[env(safe-area-inset-bottom,16px)+64px] bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-800/50 pb-[env(safe-area-inset-bottom)] px-2">
        <div className="flex items-center justify-around h-16">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                isActive ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
