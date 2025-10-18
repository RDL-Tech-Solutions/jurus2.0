import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import {
  fadeInVariants,
  slideUpVariants,
  slideInLeftVariants,
  slideInRightVariants,
  scaleInVariants,
  staggerContainerVariants,
  staggerItemVariants,
  getReducedMotionVariants,
} from '../utils/animations';

type AnimationType = 
  | 'fadeIn'
  | 'slideUp'
  | 'slideInLeft'
  | 'slideInRight'
  | 'scaleIn'
  | 'staggerContainer'
  | 'staggerItem';

interface AnimatedWrapperProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  variants?: Variants;
  respectReducedMotion?: boolean;
}

const animationVariants: Record<AnimationType, Variants> = {
  fadeIn: fadeInVariants,
  slideUp: slideUpVariants,
  slideInLeft: slideInLeftVariants,
  slideInRight: slideInRightVariants,
  scaleIn: scaleInVariants,
  staggerContainer: staggerContainerVariants,
  staggerItem: staggerItemVariants,
};

export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration,
  className,
  as = 'div',
  variants: customVariants,
  respectReducedMotion = true,
  ...motionProps
}) => {
  // Seleciona as variantes baseadas na animação escolhida ou customizada
  let selectedVariants = customVariants || animationVariants[animation];
  
  // Aplica preferência de movimento reduzido se habilitada
  if (respectReducedMotion) {
    selectedVariants = getReducedMotionVariants(selectedVariants);
  }
  
  // Aplica delay e duration customizados se fornecidos
  if (delay || duration) {
    const visibleVariant = selectedVariants.visible;
    const existingTransition = typeof visibleVariant === 'object' && visibleVariant !== null && 'transition' in visibleVariant 
      ? visibleVariant.transition 
      : {};
    
    selectedVariants = {
      ...selectedVariants,
      visible: {
        ...selectedVariants.visible,
        transition: {
          ...existingTransition,
          delay,
          duration,
        },
      },
    };
  }

  const MotionComponent = motion[as as keyof typeof motion] as any;

  return (
    <MotionComponent
      variants={selectedVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      {...motionProps}
    >
      {children}
    </MotionComponent>
  );
};

// Componente específico para containers com stagger
export const StaggerContainer: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper {...props} animation="staggerContainer" />
);

// Componente específico para itens em stagger
export const StaggerItem: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper {...props} animation="staggerItem" />
);

// Componente para fade in simples
export const FadeIn: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper {...props} animation="fadeIn" />
);

// Componente para slide up
export const SlideUp: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper {...props} animation="slideUp" />
);

// Componente para scale in
export const ScaleIn: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper {...props} animation="scaleIn" />
);

export default AnimatedWrapper;