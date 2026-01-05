import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wifi } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
  { nameKey: "nav.home", path: "/" },
  { nameKey: "nav.packages", path: "/packages" },
  { nameKey: "nav.coverage", path: "/coverage" },
  { nameKey: "nav.ftpLiveTv", path: "/ftp-live-tv" },
  { nameKey: "nav.billPayment", path: "/bill-payment" },
  { nameKey: "nav.about", path: "/about" },
  { nameKey: "nav.support", path: "/support" },
  { nameKey: "nav.contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border">
      <nav className="container-custom mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wifi className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">ANT Bogura</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out hover:scale-105 ${
                  location.pathname === link.path
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-accent hover:shadow-sm"
                }`}
              >
                {t(link.nameKey)}
              </Link>
            ))}
          </div>

          {/* CTA Button & Language Switcher */}
          <div className="hidden lg:flex items-center gap-2">
            <LanguageSwitcher />
            <Button asChild variant="hero" size="lg">
              <Link to="/packages">{t('nav.getConnected')}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  {t(link.nameKey)}
                </Link>
              ))}
              <div className="flex items-center justify-between mt-2 gap-2">
                <LanguageSwitcher />
                <Button asChild variant="hero" size="lg" className="flex-1">
                  <Link to="/packages" onClick={() => setIsOpen(false)}>
                    {t('nav.getConnected')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
