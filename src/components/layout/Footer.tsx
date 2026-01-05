import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Wifi, Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useTranslation();
  
  const quickLinks = [
    { nameKey: "nav.packages", path: "/packages" },
    { nameKey: "nav.coverage", path: "/coverage" },
    { nameKey: "nav.about", path: "/about" },
    { nameKey: "nav.support", path: "/support" },
    { nameKey: "nav.contact", path: "/contact" },
  ];

  const services = [
    "footer.servicesList.homeBroadband",
    "footer.servicesList.businessInternet",
    "footer.servicesList.gamingPackages",
    "footer.servicesList.enterpriseSolutions",
    "footer.servicesList.fiberOptic",
  ];

  return (
    <footer ref={ref} className="bg-primary text-primary-foreground">
      <div className="container-custom mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground flex items-center justify-center">
                <Wifi className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">ANT Bogura</span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {t(link.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.services')}</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              {services.map((serviceKey) => (
                <li key={serviceKey}>{t(serviceKey)}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.contactUs')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <a
                  href="https://wa.me/8801332147787"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  +880 1332-147787
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <a
                  href="tel:09647147787"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  09647147787
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <a
                  href="mailto:support@antbogura.tech"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  support@antbogura.tech
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">
                  Bogura, Bangladesh
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex justify-center items-center">
            <a
              href="https://rezuwan19.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
