import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import SpeedTestWidget from "@/components/speedtest/SpeedTestWidget";
import { Card } from "@/components/ui/card";
import { Wifi, Monitor, Router, AlertCircle } from "lucide-react";

const SpeedTest = () => {
  const { t } = useTranslation();

  const tips = [
    {
      icon: Wifi,
      titleKey: "speedTest.tips.wifi.title",
      descKey: "speedTest.tips.wifi.desc",
    },
    {
      icon: Monitor,
      titleKey: "speedTest.tips.device.title",
      descKey: "speedTest.tips.device.desc",
    },
    {
      icon: Router,
      titleKey: "speedTest.tips.router.title",
      descKey: "speedTest.tips.router.desc",
    },
    {
      icon: AlertCircle,
      titleKey: "speedTest.tips.background.title",
      descKey: "speedTest.tips.background.desc",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="container-custom mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t("speedTest.heroTitle")}{" "}
              <span className="text-primary">{t("speedTest.heroHighlight")}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t("speedTest.heroSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Speed Test Widget */}
      <section className="py-12 md:py-16">
        <div className="container-custom mx-auto px-4">
          <SpeedTestWidget />
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container-custom mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            {t("speedTest.tipsTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm">
                <tip.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{t(tip.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(tip.descKey)}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Understanding Results */}
      <section className="py-12 md:py-16">
        <div className="container-custom mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              {t("speedTest.understandingTitle")}
            </h2>
            <div className="space-y-6">
              <Card className="p-6 bg-card/50">
                <h3 className="font-semibold text-lg mb-2">{t("speedTest.download")}</h3>
                <p className="text-muted-foreground">{t("speedTest.downloadExplain")}</p>
              </Card>
              <Card className="p-6 bg-card/50">
                <h3 className="font-semibold text-lg mb-2">{t("speedTest.upload")}</h3>
                <p className="text-muted-foreground">{t("speedTest.uploadExplain")}</p>
              </Card>
              <Card className="p-6 bg-card/50">
                <h3 className="font-semibold text-lg mb-2">{t("speedTest.ping")}</h3>
                <p className="text-muted-foreground">{t("speedTest.pingExplain")}</p>
              </Card>
              <Card className="p-6 bg-card/50">
                <h3 className="font-semibold text-lg mb-2">{t("speedTest.jitter")}</h3>
                <p className="text-muted-foreground">{t("speedTest.jitterExplain")}</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SpeedTest;
