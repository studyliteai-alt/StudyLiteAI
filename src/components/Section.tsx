import { useEffect, useRef, ReactNode } from 'react';

interface SectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    id?: string;
}

export const Section = ({ children, className = "", delay = 0, id }: SectionProps) => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, delay);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [delay]);

    return (
        <section ref={sectionRef} id={id} className={`scroll-reveal ${className}`}>
            {children}
        </section>
    );
};
