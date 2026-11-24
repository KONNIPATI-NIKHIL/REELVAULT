import { motion, AnimatePresence } from 'framer-motion';
import { Film, LayoutDashboard, Library, Plus, X, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'collection', label: 'Collection', icon: Library },
];

export default function Sidebar({ activePage, setActivePage, onAddMovie, movieCount, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          flex flex-col
          border-r border-border-subtle
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          background: 'linear-gradient(180deg, #0D0F15 0%, #0B0C10 100%)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-gold to-accent-gold-light flex items-center justify-center shadow-gold">
              <Film size={18} className="text-bg-primary" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-heading font-bold text-base text-text-primary tracking-tight">
                REEL<span className="gradient-text-gold">VAULT</span>
              </h1>
              <p className="text-[10px] text-text-muted tracking-widest uppercase">Cinema Universe</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-bg-secondary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Collection indicator */}
        <div className="mx-5 mb-6 px-4 py-3 rounded-xl bg-bg-secondary border border-border-subtle">
          <p className="text-[10px] font-heading tracking-widest uppercase text-text-muted mb-1">Your Collection</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-heading font-bold gradient-text-gold">{movieCount}</span>
            <span className="text-text-secondary text-sm">{movieCount === 1 ? 'film' : 'films'}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-heading font-medium
                  transition-all duration-200 group relative
                  ${isActive
                    ? 'text-text-primary bg-bg-elevated border border-border-moderate'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                  }
                `}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-gold/10 to-transparent border border-accent-gold/20"
                  />
                )}
                <Icon
                  size={18}
                  className={`relative z-10 ${isActive ? 'text-accent-gold' : 'text-text-muted group-hover:text-text-secondary'}`}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <ChevronRight size={14} className="relative z-10 ml-auto text-accent-gold opacity-60" />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Add Movie button */}
        <div className="p-4">
          <motion.button
            onClick={onAddMovie}
            className="btn-primary w-full flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Movie
          </motion.button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="border-t border-border-subtle pt-4">
            <p className="text-xs text-text-muted text-center">
              REELVAULT v1.0 &middot; Academic Project
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
