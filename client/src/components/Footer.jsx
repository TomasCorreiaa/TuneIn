import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer({ className = '', compact = false }) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      data-testid="footer"
      className={`w-full ${compact ? 'py-1.5 text-[11px] sm:text-xs' : 'py-3 sm:py-4 text-xs sm:text-sm'} text-theme-muted select-none ${className}`}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-center">
        <span data-testid="footer-copyright" className="flex items-center gap-1">
          <span>&copy; {currentYear}</span>
          <Link 
            to="/" 
            className="font-semibold text-theme-text hover:text-accent-orange underline underline-offset-4 decoration-theme-border hover:decoration-accent-orange transition-colors"
          >
            TuneIn
          </Link>
        </span>

        <Link
          to="/privacy"
          data-testid="footer-privacy"
          className="hover:text-theme-text underline underline-offset-4 decoration-theme-border/60 hover:decoration-accent-pink transition-colors"
        >
          {t('footer_privacy')}
        </Link>

        <Link
          to="/terms"
          data-testid="footer-terms"
          className="hover:text-theme-text underline underline-offset-4 decoration-theme-border/60 hover:decoration-accent-purple transition-colors"
        >
          {t('footer_terms')}
        </Link>

        <a
          href="mailto:curredev@gmail.com?subject=TuneIn%20-%20Contact%20%2F%20Feedback"
          data-testid="footer-email"
          className="hover:text-theme-text underline underline-offset-4 decoration-theme-border/60 hover:decoration-accent-orange transition-colors"
        >
          {t('footer_email')}
        </a>
      </div>
    </footer>
  );
}
