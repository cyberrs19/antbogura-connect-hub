import { Phone, MessageCircle, Mail, Wifi, Router, AlertTriangle, RefreshCw, Shield, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Support = () => {
  const { t } = useTranslation();

  const commonIssues = [
    {
      icon: Wifi,
      titleKey: "support.commonProblems.noInternet.title",
      solutionsKey: "support.commonProblems.noInternet.solutions",
    },
    {
      icon: Zap,
      titleKey: "support.commonProblems.slowSpeed.title",
      solutionsKey: "support.commonProblems.slowSpeed.solutions",
    },
    {
      icon: Router,
      titleKey: "support.commonProblems.wifiNotWorking.title",
      solutionsKey: "support.commonProblems.wifiNotWorking.solutions",
    },
    {
      icon: RefreshCw,
      titleKey: "support.commonProblems.frequentDisconnections.title",
      solutionsKey: "support.commonProblems.frequentDisconnections.solutions",
    },
  ];

  const faqKeys = [
    "billPayment",
    "installation",
    "packageChange",
    "bdix",
    "router",
    "technicalIssues",
    "contract",
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-background via-cream to-mint">
        <div className="container-custom mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            {t("support.hero.title")} <span className="text-primary">{t("support.hero.titleHighlight")}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {t("support.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Quick Support */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            {t("support.immediate.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a
              href="https://wa.me/8801332147787"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border hover:border-[#25D366] hover:shadow-xl transition-all group animate-fade-in"
            >
              <div className="w-16 h-16 bg-[#25D366]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#25D366] transition-colors">
                <MessageCircle className="w-8 h-8 text-[#25D366] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{t("support.immediate.whatsapp")}</h3>
              <p className="text-sm text-muted-foreground text-center">{t("support.immediate.whatsappDesc")}</p>
              <p className="text-primary font-medium mt-2">+880 1332-147787</p>
            </a>

            <a
              href="tel:09647147787"
              className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border hover:border-primary hover:shadow-xl transition-all group animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <Phone className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{t("support.immediate.phone")}</h3>
              <p className="text-sm text-muted-foreground text-center">{t("support.immediate.phoneDesc")}</p>
              <p className="text-primary font-medium mt-2">09647147787</p>
            </a>

            <a
              href="mailto:support@antbogura.tech"
              className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border hover:border-primary hover:shadow-xl transition-all group animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <Mail className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{t("support.immediate.email")}</h3>
              <p className="text-sm text-muted-foreground text-center">{t("support.immediate.emailDesc")}</p>
              <p className="text-primary font-medium mt-2 break-all">support@antbogura.tech</p>
            </a>
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="section-padding bg-card">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("support.commonProblems.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("support.commonProblems.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonIssues.map((issue, index) => {
              const solutions = t(issue.solutionsKey, { returnObjects: true }) as string[];
              return (
                <div
                  key={issue.titleKey}
                  className="bg-background p-6 rounded-2xl border border-border hover:shadow-lg transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <issue.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {t(issue.titleKey)}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {Array.isArray(solutions) && solutions.map((solution, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-10 h-10 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">{t("support.commonProblems.stillHavingIssues.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("support.commonProblems.stillHavingIssues.subtitle")}
                </p>
              </div>
            </div>
            <Button asChild variant="hero">
              <a href="https://wa.me/8801332147787" target="_blank" rel="noopener noreferrer">
                {t("support.commonProblems.stillHavingIssues.requestVisit")}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("support.faq.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("support.faq.subtitle")}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqKeys.map((key, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                    {t(`support.faq.questions.${key}.q`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {t(`support.faq.questions.${key}.a`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container-custom mx-auto text-center">
          <Shield className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            {t("support.cta.title")}
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            {t("support.cta.subtitle")}
          </p>
          <Button asChild variant="secondary" size="xl">
            <a href="https://wa.me/8801332147787" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5" />
              {t("support.cta.chatNow")}
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Support;
