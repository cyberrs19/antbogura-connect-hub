import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { CheckCircle, Copy, Check, Loader2 } from "lucide-react";
import paymentInfoImage from "@/assets/payment-info.jpg";
import bkashLogo from "@/assets/bkash-logo.svg";
import nagadLogo from "@/assets/nagad-logo.svg";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PaymentVisibility {
  bkash_merchant: boolean;
  bkash_personal: boolean;
  nagad_merchant: boolean;
  nagad_personal: boolean;
}

const BillPayment = () => {
  const { t } = useTranslation();
  const [copiedMerchant, setCopiedMerchant] = useState(false);
  const [copiedPersonal, setCopiedPersonal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibility, setVisibility] = useState<PaymentVisibility>({
    bkash_merchant: true,
    bkash_personal: true,
    nagad_merchant: true,
    nagad_personal: true,
  });
  const merchantNumber = "01332-147787";
  const personalNumber = "01775647118";

  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const { data, error } = await supabase
          .from("payment_settings")
          .select("payment_type, is_visible");

        if (error) throw error;

        if (data) {
          const newVisibility: PaymentVisibility = {
            bkash_merchant: true,
            bkash_personal: true,
            nagad_merchant: true,
            nagad_personal: true,
          };
          data.forEach((item) => {
            if (item.payment_type in newVisibility) {
              newVisibility[item.payment_type as keyof PaymentVisibility] = item.is_visible;
            }
          });
          setVisibility(newVisibility);
        }
      } catch (error) {
        console.error("Error fetching payment visibility:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisibility();
  }, []);

  const copyMerchantNumber = () => {
    navigator.clipboard.writeText(merchantNumber);
    setCopiedMerchant(true);
    toast.success(t("common.success"));
    setTimeout(() => setCopiedMerchant(false), 2000);
  };

  const copyPersonalNumber = () => {
    navigator.clipboard.writeText(personalNumber);
    setCopiedPersonal(true);
    toast.success(t("common.success"));
    setTimeout(() => setCopiedPersonal(false), 2000);
  };

  const importantNotes = t("billPayment.importantNotes.notes", { returnObjects: true }) as string[];

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-background via-cream to-mint">
        <div className="container-custom mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            {t("billPayment.hero.title")} <span className="text-primary">{t("billPayment.hero.titleHighlight")}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {t("billPayment.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
          {/* bKash Merchant Payment Section */}
          {visibility.bkash_merchant && (
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border mb-8">
            <div className="flex items-center gap-4 mb-6">
              <img src={bkashLogo} alt="bKash Logo" className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="font-bold text-2xl text-foreground">{t("billPayment.bkashMerchant.title")}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">{t("billPayment.bkashMerchant.merchantAccount")}: {merchantNumber}</p>
                  <button onClick={copyMerchantNumber} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                    {copiedMerchant ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">{t("billPayment.steps.step")} 1</div>
                <div className="text-2xl font-bold text-foreground mb-2">*247#</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.dialBkash")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">{t("billPayment.steps.step")} 2</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.selectPayment")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.choosePayment")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">{t("billPayment.steps.step")} 3</div>
                <div className="text-lg font-bold text-foreground mb-2">{merchantNumber}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterMerchant")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">{t("billPayment.steps.step")} 4</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.enterAmount")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterBillAmount")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">{t("billPayment.steps.step")} 5</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.reference")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterCustomerId")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">{t("billPayment.steps.step")} 6</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.enterPin")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterBkashPin")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border lg:col-span-2">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">{t("billPayment.steps.step")} 7</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.success")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.confirmationSms")}</p>
              </div>
            </div>
          </div>
          )}

          {/* bKash Personal */}
          {visibility.bkash_personal && (
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border mb-8">
            <div className="flex items-center gap-4 mb-6">
              <img src={bkashLogo} alt="bKash Logo" className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="font-bold text-2xl text-foreground">{t("billPayment.bkashPersonal.title")}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">{t("billPayment.bkashPersonal.personalAccount")}: {personalNumber}</p>
                  <button onClick={copyPersonalNumber} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                    {copiedPersonal ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">{t("billPayment.steps.step")} 1</div>
                <div className="text-2xl font-bold text-foreground mb-2">*247#</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.dialBkash")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">{t("billPayment.steps.step")} 2</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.selectSendMoney")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.chooseSendMoney")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">{t("billPayment.steps.step")} 3</div>
                <div className="text-lg font-bold text-foreground mb-2">{personalNumber}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterPersonal")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">{t("billPayment.steps.step")} 4</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.enterAmount")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterBillAmount")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">{t("billPayment.steps.step")} 5</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.reference")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterCustomerId")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">{t("billPayment.steps.step")} 6</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.enterPin")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterBkashPin")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border lg:col-span-2">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">{t("billPayment.steps.step")} 7</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.success")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.confirmationSms")}</p>
              </div>
            </div>
          </div>
          )}

          {/* Nagad Merchant */}
          {visibility.nagad_merchant && (
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border mb-8">
            <div className="flex items-center gap-4 mb-6">
              <img src={nagadLogo} alt="Nagad Logo" className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="font-bold text-2xl text-foreground">{t("billPayment.nagadMerchant.title")}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">{t("billPayment.nagadMerchant.merchantAccount")}: {merchantNumber}</p>
                  <button onClick={copyMerchantNumber} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                    {copiedMerchant ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 1</div>
                <div className="text-2xl font-bold text-foreground mb-2">*167#</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.dialNagad")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 2</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.selectPayment")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.choosePayment")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 3</div>
                <div className="text-lg font-bold text-foreground mb-2">{merchantNumber}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterMerchant")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 4</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.enterAmount")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterBillAmount")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 5</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.counterNo")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterCounter")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 6</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.reference")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterCustomerId")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 7</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.enterPin")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterNagadPin")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 8</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.success")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.confirmationSms")}</p>
              </div>
            </div>
          </div>
          )}

          {/* Nagad Personal */}
          {visibility.nagad_personal && (
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border mb-12">
            <div className="flex items-center gap-4 mb-6">
              <img src={nagadLogo} alt="Nagad Logo" className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="font-bold text-2xl text-foreground">{t("billPayment.nagadPersonal.title")}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">{t("billPayment.nagadPersonal.personalAccount")}: {personalNumber}</p>
                  <button onClick={copyPersonalNumber} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                    {copiedPersonal ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 1</div>
                <div className="text-2xl font-bold text-foreground mb-2">*167#</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.dialNagad")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 2</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.selectSendMoney")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.chooseSendMoney")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 3</div>
                <div className="text-lg font-bold text-foreground mb-2">{personalNumber}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterPersonal")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 4</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.enterAmount")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterBillAmount")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 5</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.reference")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterCustomerId")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 6</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.enterPin")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.enterNagadPin")}</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border lg:col-span-2">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">{t("billPayment.steps.step")} 7</div>
                <div className="text-lg font-bold text-foreground mb-2">{t("billPayment.steps.success")}</div>
                <p className="text-sm text-muted-foreground">{t("billPayment.steps.confirmationSms")}</p>
              </div>
            </div>
          </div>
          )}
          </>
          )}

          {/* Important Notes */}
          <div className="mt-12 bg-primary/5 p-6 rounded-2xl border border-primary/20">
            <h3 className="font-bold text-lg text-foreground mb-4">{t("billPayment.importantNotes.title")}:</h3>
            <ul className="space-y-2 text-muted-foreground">
              {Array.isArray(importantNotes) && importantNotes.map((note, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
              {t("billPayment.faq.title")}
            </h2>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BillPayment;
