import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, Clock, Wifi, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { t } = useTranslation();
  const [simpleFormData, setSimpleFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmittingSimple, setIsSubmittingSimple] = useState(false);

  const [problemFormData, setProblemFormData] = useState({
    name: "",
    phone: "",
    customerId: "",
    problemType: "",
    description: "",
  });
  const [isSubmittingProblem, setIsSubmittingProblem] = useState(false);

  const sendSms = async (phone: string, message: string, recordId: string, tableName: string) => {
    try {
      await supabase.functions.invoke("send-sms", {
        body: { phone, message, type: "form_submission", recordId, tableName },
      });
    } catch (error) {
      console.error("SMS sending failed:", error);
    }
  };

  const handleSimpleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSimple(true);

    try {
      const recordId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : ([1e7] as any +-1e3 +-4e3 +-8e3 +-1e11).replace(/[018]/g, (c: any) =>
              (
                c ^
                ((typeof crypto !== "undefined" && crypto.getRandomValues
                  ? crypto.getRandomValues(new Uint8Array(1))[0]
                  : Math.random() * 256) &
                  (15 >> (c / 4)))
              ).toString(16)
            );

      const { error } = await supabase.from("contact_messages").insert({
        id: recordId,
        name: simpleFormData.name,
        phone: simpleFormData.phone,
        email: simpleFormData.email || null,
        message: simpleFormData.message,
      });

      if (error) throw error;

      // Send SMS to customer (fire-and-forget so the form stays fast)
      void sendSms(
        simpleFormData.phone,
        `ধন্যবাদ ${simpleFormData.name}! আপনার মেসেজ পেয়েছি। শীঘ্রই যোগাযোগ করব। - ANT Bogura`,
        recordId,
        "contact_messages"
      );

      toast.success("Message sent successfully! We'll get back to you soon.");
      setSimpleFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error: any) {
      console.error("Contact form submit error:", error);
      const message =
        typeof error?.message === "string" ? error.message : "Failed to send message. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmittingSimple(false);
    }
  };

  const handleProblemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProblem(true);

    try {
      const recordId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : ([1e7] as any +-1e3 +-4e3 +-8e3 +-1e11).replace(/[018]/g, (c: any) =>
              (
                c ^
                ((typeof crypto !== "undefined" && crypto.getRandomValues
                  ? crypto.getRandomValues(new Uint8Array(1))[0]
                  : Math.random() * 256) &
                  (15 >> (c / 4)))
              ).toString(16)
            );

      const { error } = await supabase.from("problem_reports").insert({
        id: recordId,
        name: problemFormData.name,
        phone: problemFormData.phone,
        customer_id: problemFormData.customerId || null,
        problem_type: problemFormData.problemType,
        description: problemFormData.description,
      });

      if (error) throw error;

      // Send SMS to customer (fire-and-forget so the form stays fast)
      void sendSms(
        problemFormData.phone,
        `${problemFormData.name}, আপনার সমস্যা রিপোর্ট পেয়েছি। আমাদের টিম শীঘ্রই সমাধান করবে। - ANT Bogura`,
        recordId,
        "problem_reports"
      );

      toast.success("Problem reported successfully! Our team will contact you shortly.");
      setProblemFormData({ name: "", phone: "", customerId: "", problemType: "", description: "" });
    } catch (error: any) {
      console.error("Problem report submit error:", error);
      const message =
        typeof error?.message === "string" ? error.message : "Failed to report problem. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmittingProblem(false);
    }
  };

  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSimpleFormData({ ...simpleFormData, [e.target.name]: e.target.value });
  };

  const handleProblemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProblemFormData({ ...problemFormData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-background via-cream to-mint">
        <div className="container-custom mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            {t("contact.hero.title")} <span className="text-primary">{t("contact.hero.titleHighlight")}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {t("contact.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8 animate-fade-in-left">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t("contact.info.title")}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {t("contact.info.subtitle")}
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <a
                  href="https://wa.me/8801332147787"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-[#25D366] hover:shadow-lg transition-all group"
                >
                  <div className="w-14 h-14 bg-[#25D366]/10 rounded-xl flex items-center justify-center group-hover:bg-[#25D366] transition-colors">
                    <MessageCircle className="w-7 h-7 text-[#25D366] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t("contact.info.whatsapp")}</p>
                    <p className="text-muted-foreground">+880 1332-147787</p>
                  </div>
                </a>

                <a
                  href="tel:09647147787"
                  className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all group"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Phone className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t("contact.info.phone")}</p>
                    <p className="text-muted-foreground">09647147787</p>
                  </div>
                </a>

                <a
                  href="mailto:support@antbogura.tech"
                  className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all group"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Mail className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t("contact.info.email")}</p>
                    <p className="text-muted-foreground">support@antbogura.tech</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t("contact.info.location")}</p>
                    <p className="text-muted-foreground">Bogura, Bangladesh</p>
                  </div>
                </div>


                <div className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t("contact.info.supportHours")}</p>
                    <p className="text-muted-foreground">{t("contact.info.available247")}</p>
                  </div>
                </div>
              </div>

              {/* Quick Action */}
              <Button asChild variant="whatsapp" size="xl" className="w-full">
                <a href="https://wa.me/8801332147787" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  {t("contact.info.quickChat")}
                </a>
              </Button>
            </div>

            {/* Contact Forms with Tabs */}
            <div className="animate-fade-in-right">
              <div className="bg-card p-8 rounded-2xl border border-border">
                <Tabs defaultValue="simple" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="simple" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {t("contact.tabs.contactUs")}
                    </TabsTrigger>
                    <TabsTrigger value="problem" className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {t("contact.tabs.reportProblem")}
                    </TabsTrigger>
                  </TabsList>

                  {/* Simple Contact Form */}
                  <TabsContent value="simple">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {t("contact.form.sendMessage.title")}
                      </h2>
                      <p className="text-muted-foreground">
                        {t("contact.form.sendMessage.subtitle")}
                      </p>
                    </div>

                    <form onSubmit={handleSimpleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("contact.form.fullName")} *
                          </label>
                          <Input
                            name="name"
                            value={simpleFormData.name}
                            onChange={handleSimpleChange}
                            placeholder={t("contact.form.fullName")}
                            required
                            className="bg-background"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("contact.form.phone")} *
                          </label>
                          <Input
                            name="phone"
                            value={simpleFormData.phone}
                            onChange={handleSimpleChange}
                            placeholder="01xxxxxxxxx"
                            required
                            className="bg-background"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("contact.form.email")}
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={simpleFormData.email}
                          onChange={handleSimpleChange}
                          placeholder="your@email.com"
                          className="bg-background"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("contact.form.message")} *
                        </label>
                        <Textarea
                          name="message"
                          value={simpleFormData.message}
                          onChange={handleSimpleChange}
                          placeholder={t("contact.form.message")}
                          rows={4}
                          required
                          className="bg-background resize-none"
                        />
                      </div>

                      <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmittingSimple}>
                        {isSubmittingSimple ? t("contact.form.sending") : (
                          <>
                            <Send className="w-5 h-5" />
                            {t("contact.form.sendMessage")}
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Internet Problem Form */}
                  <TabsContent value="problem">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {t("contact.form.reportProblem.title")}
                      </h2>
                      <p className="text-muted-foreground">
                        {t("contact.form.reportProblem.subtitle")}
                      </p>
                    </div>

                    <form onSubmit={handleProblemSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("contact.form.fullName")} *
                          </label>
                          <Input
                            name="name"
                            value={problemFormData.name}
                            onChange={handleProblemChange}
                            placeholder={t("contact.form.fullName")}
                            required
                            className="bg-background"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("contact.form.phone")} *
                          </label>
                          <Input
                            name="phone"
                            value={problemFormData.phone}
                            onChange={handleProblemChange}
                            placeholder="01xxxxxxxxx"
                            required
                            className="bg-background"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("contact.form.customerId")}
                        </label>
                        <Input
                          name="customerId"
                          value={problemFormData.customerId}
                          onChange={handleProblemChange}
                          placeholder={t("contact.form.customerIdPlaceholder")}
                          className="bg-background"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("contact.form.problemType")} *
                        </label>
                        <select
                          name="problemType"
                          value={problemFormData.problemType}
                          onChange={handleProblemChange}
                          required
                          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="">{t("contact.form.selectProblemType")}</option>
                          <option value="no-connection">{t("contact.form.problemTypes.noConnection")}</option>
                          <option value="slow-speed">{t("contact.form.problemTypes.slowSpeed")}</option>
                          <option value="frequent-disconnection">{t("contact.form.problemTypes.frequentDisconnection")}</option>
                          <option value="wifi-issue">{t("contact.form.problemTypes.wifiIssue")}</option>
                          <option value="billing">{t("contact.form.problemTypes.billing")}</option>
                          <option value="other">{t("contact.form.problemTypes.other")}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("contact.form.description")} *
                        </label>
                        <Textarea
                          name="description"
                          value={problemFormData.description}
                          onChange={handleProblemChange}
                          placeholder={t("contact.form.describeProblem")}
                          rows={4}
                          required
                          className="bg-background resize-none"
                        />
                      </div>

                      <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmittingProblem}>
                        {isSubmittingProblem ? t("contact.form.reporting") : (
                          <>
                            <Wifi className="w-5 h-5" />
                            {t("contact.form.submitReport")}
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
