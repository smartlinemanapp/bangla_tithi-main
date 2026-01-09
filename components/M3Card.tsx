
import React from 'react';

interface M3CardProps {
    children: React.ReactNode;
    variant?: 'elevated' | 'outlined';
    className?: string;
    onClick?: () => void;
}

export const M3Card: React.FC<M3CardProps> = ({
    children,
    variant = 'elevated',
    className = '',
    onClick
}) => {
    const baseClass = variant === 'elevated' ? 'm3-card-elevated' : 'm3-card-outlined';

    return (
        <div
            onClick={onClick}
            className={`${baseClass} ${className} ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} transition-all duration-300`}
        >
            {children}
        </div>
    );
};
