import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Wifi, Zap, Tv, Gamepad2, Shield, Clock, Package, MapPin, Users, Headphones, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const { t } = useTranslation();

  const pages = [
    { nameKey: "explore.pages.packages.name", path: "/packages", icon: Package, descKey: "explore.pages.packages.description" },
    { nameKey: "explore.pages.coverage.name", path: "/coverage", icon: MapPin, descKey: "explore.pages.coverage.description" },
    { nameKey: "explore.pages.about.name", path: "/about", icon: Users, descKey: "explore.pages.about.description" },
    { nameKey: "explore.pages.support.name", path: "/support", icon: Headphones, descKey: "explore.pages.support.description" },
    { nameKey: "explore.pages.contact.name", path: "/contact", icon: Mail, descKey: "explore.pages.contact.description" },
  ];

  const features = [
    { icon: Wifi, titleKey: "features.unlimitedData.title", descKey: "features.unlimitedData.description" },
    { icon: Zap, titleKey: "features.bdixSpeed.title", descKey: "features.bdixSpeed.description" },
    { icon: Tv, titleKey: "features.streaming.title", descKey: "features.streaming.description" },
    { icon: Gamepad2, titleKey: "features.gaming.title", descKey: "features.gaming.description" },
  ];

  const whyChooseUs = [
    { icon: Shield, titleKey: "whyChooseUs.reliable.title", descKey: "whyChooseUs.reliable.description" },
    { icon: Clock, titleKey: "whyChooseUs.support.title", descKey: "whyChooseUs.support.description" },
    { icon: Zap, titleKey: "whyChooseUs.installation.title", descKey: "whyChooseUs.installation.description" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-background via-cream to-mint overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-mint rounded-full blur-3xl" />
        </div>

        <div className="container-custom mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Wifi className="w-4 h-4" />
              <span className="text-sm font-medium">{t('hero.badge')}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {t('hero.title')}{" "}
              <span className="text-primary">{t('hero.titleHighlight')}</span> {t('hero.titleSuffix')}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button asChild variant="hero" size="xl">
                <Link to="/packages">
                  {t('hero.viewPackages')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">1000+</p>
                <p className="text-sm text-muted-foreground mt-1">{t('hero.stats.customers')}</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">99.9%</p>
                <p className="text-sm text-muted-foreground mt-1">{t('hero.stats.uptime')}</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">200+</p>
                <p className="text-sm text-muted-foreground mt-1">{t('hero.stats.speed')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-card">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('features.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.titleKey}
                className="bg-background p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out">
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t('whyChooseUs.title')} <span className="text-primary">{t('whyChooseUs.titleHighlight')}</span>?
              </h2>
              <p className="text-muted-foreground mb-8">
                {t('whyChooseUs.subtitle')}
              </p>

              <div className="space-y-6">
                {whyChooseUs.map((item, index) => (
                  <div
                    key={item.titleKey}
                    className="flex gap-4 animate-fade-in-left"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {t(item.titleKey)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t(item.descKey)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild variant="hero" size="lg" className="mt-8">
                <Link to="/about">
                  {t('whyChooseUs.learnMore')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-mint rounded-3xl flex items-center justify-center">
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center animate-float">
                  <Wifi className="w-16 h-16 text-primary-foreground" />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-mint rounded-2xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cream rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Explore Pages Section */}
      <section className="section-padding bg-card">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('explore.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('explore.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pages.map((page, index) => (
              <Link
                key={page.path}
                to={page.path}
                className="group p-6 bg-background rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <page.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {t(page.nameKey)}
                </h3>
                <p className="text-xs text-muted-foreground">{t(page.descKey)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="xl">
              <Link to="/packages">
                {t('cta.viewPackages')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <a href="https://wa.me/8801332147787" target="_blank" rel="noopener noreferrer">
                {t('cta.chatWhatsApp')}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
