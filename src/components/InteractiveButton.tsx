import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Sparkles, Zap, Loader2 } from 'lucide-react';

interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: LucideIcon;
  className?: string;
  glow?: boolean;
  ripple?: boolean;
  magnetic?: boolean;
  particles?: boolean;
  soundEffect?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

interface RippleEffect {
  x: number;
  y: number;
  id: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  loadingText,
  icon: Icon,
  className = '',
  glow = false,
  ripple = true,
  magnetic = false,
  particles = false,
  soundEffect = false,
  type = 'button',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [rippleEffects, setRippleEffects] = useState<RippleEffect[]>([]);
  const [particleEffects, setParticleEffects] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);
  const particleId = useRef(0);

  // Variantes de estilo baseadas no variant
  const variants = {
    primary: {
      base: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600',
      hover: 'from-blue-700 to-blue-800 border-blue-700 shadow-lg shadow-blue-500/25',
      active: 'from-blue-800 to-blue-900 scale-95',
      disabled: 'from-gray-400 to-gray-500 cursor-not-allowed'
    },
    secondary: {
      base: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white border-gray-600',
      hover: 'from-gray-700 to-gray-800 border-gray-700 shadow-lg shadow-gray-500/25',
      active: 'from-gray-800 to-gray-900 scale-95',
      disabled: 'from-gray-400 to-gray-500 cursor-not-allowed'
    },
    success: {
      base: 'bg-gradient-to-r from-green-600 to-green-700 text-white border-green-600',
      hover: 'from-green-700 to-green-800 border-green-700 shadow-lg shadow-green-500/25',
      active: 'from-green-800 to-green-900 scale-95',
      disabled: 'from-gray-400 to-gray-500 cursor-not-allowed'
    },
    danger: {
      base: 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-600',
      hover: 'from-red-700 to-red-800 border-red-700 shadow-lg shadow-red-500/25',
      active: 'from-red-800 to-red-900 scale-95',
      disabled: 'from-gray-400 to-gray-500 cursor-not-allowed'
    },
    outline: {
      base: 'bg-transparent text-gray-700 border-2 border-gray-300',
      hover: 'bg-gray-50 border-gray-400 shadow-md',
      active: 'bg-gray-100 scale-95',
      disabled: 'text-gray-400 border-gray-200 cursor-not-allowed'
    },
    gradient: {
      base: 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white border-transparent',
      hover: 'from-purple-700 via-pink-700 to-blue-700 shadow-lg shadow-purple-500/25',
      active: 'from-purple-800 via-pink-800 to-blue-800 scale-95',
      disabled: 'from-gray-400 to-gray-500 cursor-not-allowed'
    },
    glass: {
      base: 'bg-white/10 backdrop-blur-md text-white border border-white/20',
      hover: 'bg-white/20 border-white/30 shadow-lg',
      active: 'bg-white/30 scale-95',
      disabled: 'bg-gray-400/10 text-gray-400 cursor-not-allowed'
    }
  };

  // Tamanhos
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const createRipple = useCallback((e: React.MouseEvent) => {
    if (!ripple || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: RippleEffect = {
      x,
      y,
      id: rippleId.current++
    };

    setRippleEffects(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRippleEffects(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  }, [ripple]);

  const createParticles = useCallback(() => {
    if (!particles || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const velocity = 2 + Math.random() * 2;
      
      newParticles.push({
        id: particleId.current++,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1
      });
    }

    setParticleEffects(prev => [...prev, ...newParticles]);

    // Animate particles
    const animateParticles = () => {
      setParticleEffects(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 0.02
        })).filter(particle => particle.life > 0)
      );
    };

    const interval = setInterval(animateParticles, 16);
    setTimeout(() => clearInterval(interval), 1000);
  }, [particles]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!magnetic || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setMousePosition({ x: x * 0.1, y: y * 0.1 });
  }, [magnetic]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled || loading) return;

    setIsPressed(true);
    createRipple(e);
    
    if (particles) {
      createParticles();
    }

    if (soundEffect) {
      // Simular efeito sonoro com vibração (se disponível)
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }

    setTimeout(() => setIsPressed(false), 150);

    if (onClick) {
      onClick(e);
    }
  }, [disabled, loading, onClick, createRipple, createParticles, soundEffect, particles]);

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  const buttonClasses = `
    relative overflow-hidden rounded-lg font-medium transition-all duration-200 
    border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    ${currentSize}
    ${disabled || loading ? currentVariant.disabled : currentVariant.base}
    ${glow && !disabled && !loading ? 'shadow-lg' : ''}
    ${className}
  `;

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isPressed ? 0.95 : 1
      }}
      whileHover={!disabled && !loading ? {
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={!disabled && !loading ? {
        scale: 0.98
      } : {}}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      {...props}
    >
      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered && !disabled && !loading ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Glow effect */}
      {glow && isHovered && !disabled && !loading && (
        <motion.div
          className={`absolute inset-0 rounded-lg blur-md -z-10 ${
            variant === 'primary' ? 'bg-blue-500/50' :
            variant === 'success' ? 'bg-green-500/50' :
            variant === 'danger' ? 'bg-red-500/50' :
            variant === 'gradient' ? 'bg-purple-500/50' :
            'bg-gray-500/50'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Ripple effects */}
      <AnimatePresence>
        {rippleEffects.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Particle effects */}
      <AnimatePresence>
        {particleEffects.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.life
            }}
          />
        ))}
      </AnimatePresence>

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {loadingText && <span>{loadingText}</span>}
          </>
        ) : (
          <>
            {Icon && <Icon className="w-4 h-4" />}
            {children}
            {particles && isHovered && (
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-4 h-4 ml-1" />
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Shine effect */}
      {isHovered && !disabled && !loading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}
    </motion.button>
  );
};