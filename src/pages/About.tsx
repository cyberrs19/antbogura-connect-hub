import { Target, Eye, Users, Award, Wifi, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: Wifi,
      titleKey: "about.values.fastReliable.title",
      descKey: "about.values.fastReliable.description",
    },
    {
      icon: Users,
      titleKey: "about.values.customerFirst.title",
      descKey: "about.values.customerFirst.description",
    },
    {
      icon: Shield,
      titleKey: "about.values.trustedService.title",
      descKey: "about.values.trustedService.description",
    },
    {
      icon: Award,
      titleKey: "about.values.localExcellence.title",
      descKey: "about.values.localExcellence.description",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-background via-cream to-mint">
        <div className="container-custom mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              {t("about.hero.title")} <span className="text-primary">{t("about.hero.titleHighlight")}</span>
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {t("about.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {t("about.story.title")}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t("about.story.p1")}</p>
                <p>{t("about.story.p2")}</p>
                <p>{t("about.story.p3")}</p>
              </div>
            </div>

            <div className="relative animate-fade-in-right">
              <div className="aspect-square bg-gradient-to-br from-cream to-mint rounded-3xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Wifi className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{t("about.story.since")}</h3>
                  <p className="text-muted-foreground">{t("about.story.serving")}</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-mint rounded-xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-card">
        <div className="container-custom mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-background p-8 rounded-2xl border border-border animate-fade-in">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{t("about.mission.title")}</h3>
              <p className="text-muted-foreground">{t("about.mission.description")}</p>
            </div>

            <div className="bg-background p-8 rounded-2xl border border-border animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{t("about.vision.title")}</h3>
              <p className="text-muted-foreground">{t("about.vision.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            {t("about.values.title")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={value.titleKey}
                className="text-center p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {t(value.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground">{t(value.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-primary">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground">1000+</p>
              <p className="text-primary-foreground/80 mt-2">{t("about.stats.customers")}</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground">99.9%</p>
              <p className="text-primary-foreground/80 mt-2">{t("about.stats.uptime")}</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground">24/7</p>
              <p className="text-primary-foreground/80 mt-2">{t("about.stats.support")}</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground">4+</p>
              <p className="text-primary-foreground/80 mt-2">{t("about.stats.years")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t("about.cta.title")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            {t("about.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/packages">{t("about.cta.viewPackages")}</Link>
            </Button>
            <Button asChild variant="hero-outline" size="xl">
              <Link to="/contact">{t("about.cta.contactUs")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
