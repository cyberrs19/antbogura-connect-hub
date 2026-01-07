import { useState } from "react";
import { MapPin, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const THANAS = [
  "Adamdighi",
  "Bogra Sadar",
  "Dhunat",
  "Dhupchanchia",
  "Gabtali",
  "Kahalu",
  "Nandigram",
  "Shajahanpur",
  "Shibganj",
  "Sherpur",
  "Sariakandi",
  "Sonatala",
];

const Coverage = () => {
  const { t } = useTranslation();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Bogura");

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-background via-cream to-mint">
        <div className="container-custom mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            {t("coverage.hero.title")} <span className="text-primary">{t("coverage.hero.titleHighlight")}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {t("coverage.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* District Selector */}
      <section className="section-padding bg-background pb-0">
        <div className="container-custom mx-auto">
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("coverage.selectDistrict")}
            </label>
            <Select
              value={selectedDistrict}
              onValueChange={setSelectedDistrict}
            >
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder={t("coverage.selectDistrict")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bogura">Bogura</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Show thanas list only when district is selected */}
      {selectedDistrict && (
        <>
          {/* Coverage Section */}
          <section className="section-padding bg-background">
            <div className="container-custom mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Map */}
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-primary" />
                    {t("coverage.districtCoverage", { district: selectedDistrict })}
                  </h2>
                  <div className="aspect-video bg-card rounded-2xl overflow-hidden border border-border shadow-lg">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57841.46825879396!2d89.34376!3d24.846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fc5525a18bb8eb%3A0x2eb31f21dc54bc6f!2sBogura!5e0!3m2!1sen!2sbd!4v1640000000000!5m2!1sen!2sbd"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="ANT Bogura Coverage Map"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    {t("coverage.mapNote")}
                  </p>
                </div>

                {/* Thanas List */}
                <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                    {t("coverage.coveredThanas", { district: selectedDistrict })}
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {THANAS.map((thana, index) => (
                      <div
                        key={thana}
                        className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border hover:border-primary/30 transition-all"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">{thana}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20">
                    <h3 className="font-semibold text-foreground mb-2">
                      {t("coverage.notInArea.title")}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t("coverage.notInArea.subtitle")}
                    </p>
                    <Button asChild variant="hero">
                      <Link to="/contact">{t("coverage.notInArea.requestCoverage")}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Expansion Notice */}
          <section className="section-padding bg-card">
            <div className="container-custom mx-auto">
              <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                  {t("coverage.expandingSoon.title")}
                </h2>
                <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-6">
                  {t("coverage.expandingSoon.subtitle")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="secondary" size="lg">
                    <Link to="/contact">{t("coverage.expandingSoon.contactUs")}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    <a href="https://wa.me/8801332147787" target="_blank" rel="noopener noreferrer">
                      {t("coverage.expandingSoon.whatsappUs")}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </Layout>
  );
};

export default Coverage;
