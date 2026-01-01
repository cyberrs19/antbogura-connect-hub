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
    toast.success("Merchant number copied!");
    setTimeout(() => setCopiedMerchant(false), 2000);
  };

  const copyPersonalNumber = () => {
    navigator.clipboard.writeText(personalNumber);
    setCopiedPersonal(true);
    toast.success("Personal number copied!");
    setTimeout(() => setCopiedPersonal(false), 2000);
  };

  const faqs = [
    {
      question: "What is the merchant number for ANT Bogura?",
      answer: "The merchant number for both bKash and Nagad payments is 01332-147787."
    },
    {
      question: "What is the personal number for Send Money payments?",
      answer: "The personal number for Send Money (bKash and Nagad) is 01775647118."
    },
    {
      question: "What is the difference between Merchant Payment and Send Money?",
      answer: "Merchant Payment uses *247# (bKash) or *167# (Nagad) and selects 'Payment' option, while Send Money uses the same codes but selects the 'Send Money' option. Both methods are accepted for bill payment."
    },
    {
      question: "Which payment method should I use - Merchant or Send Money?",
      answer: "Both methods are equally valid. You can use whichever is more convenient for you. Merchant Payment goes to 01332-147787, and Send Money goes to 01775647118."
    },
    {
      question: "What should I enter as the reference?",
      answer: "Enter your Customer ID as the reference. This helps us identify your payment and update your account."
    },
    {
      question: "How long does it take for my payment to reflect?",
      answer: "Payments are usually processed within 1-2 hours. If your payment doesn't reflect within 24 hours, please contact our support team with your TrxID."
    },
    {
      question: "I made a payment but entered the wrong Customer ID. What should I do?",
      answer: "Please contact our support team immediately via WhatsApp at +880 1332-147787 with your TrxID and correct Customer ID."
    },
    {
      question: "Can I pay for multiple months at once?",
      answer: "Yes, you can pay for multiple months. Just enter the total amount for all months you want to pay."
    },
    {
      question: "What if my payment fails?",
      answer: "If your payment fails, the amount will be refunded to your bKash/Nagad account within 24-48 hours. If not, contact bKash/Nagad customer support."
    },
    {
      question: "Is there any additional charge for mobile payment?",
      answer: "No, there is no additional charge for paying via bKash or Nagad, whether you use Merchant Payment or Send Money."
    }
  ];
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-background via-cream to-mint">
        <div className="container-custom mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            Bill <span className="text-primary">Payment</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Pay your internet bill easily using bKash or Nagad. Follow the simple steps below.
          </p>
        </div>
      </section>

      {/* Payment Methods Summary */}
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
              <img 
                src={bkashLogo} 
                alt="bKash Logo" 
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-2xl text-foreground">BKash Merchant Payment</h3>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">Merchant Account: {merchantNumber}</p>
                  <button
                    onClick={copyMerchantNumber}
                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    title="Copy merchant number"
                  >
                    {copiedMerchant ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">Step 1</div>
                <div className="text-2xl font-bold text-foreground mb-2">*247#</div>
                <p className="text-sm text-muted-foreground">Dial *247# on your bKash activated mobile phone</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">Step 2</div>
                <div className="text-lg font-bold text-foreground mb-2">Select Payment</div>
                <p className="text-sm text-muted-foreground">Choose option 4. Payment from the menu</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">Step 3</div>
                <div className="text-lg font-bold text-foreground mb-2">01332-147787</div>
                <p className="text-sm text-muted-foreground">Enter ANT Bogura bKash Merchant Number</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">Step 4</div>
                <div className="text-lg font-bold text-foreground mb-2">Enter Amount</div>
                <p className="text-sm text-muted-foreground">Enter your bill amount</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">Step 5</div>
                <div className="text-lg font-bold text-foreground mb-2">Reference</div>
                <p className="text-sm text-muted-foreground">Enter your Customer ID as reference</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">Step 6</div>
                <div className="text-lg font-bold text-foreground mb-2">Enter PIN</div>
                <p className="text-sm text-muted-foreground">Enter your bKash PIN to confirm payment</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border lg:col-span-2">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">Step 7</div>
                <div className="text-lg font-bold text-foreground mb-2">Payment Successful!</div>
                <p className="text-sm text-muted-foreground">You will receive a confirmation SMS with TrxID</p>
              </div>
            </div>
          </div>
          )}

          {/* bKash Send Money (Personal) Payment Section */}
          {visibility.bkash_personal && (
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border mb-8">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={bkashLogo} 
                alt="bKash Logo" 
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-2xl text-foreground">BKash Send Money</h3>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">Personal Account: {personalNumber}</p>
                  <button
                    onClick={copyPersonalNumber}
                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    title="Copy personal number"
                  >
                    {copiedPersonal ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">Step 1</div>
                <div className="text-2xl font-bold text-foreground mb-2">*247#</div>
                <p className="text-sm text-muted-foreground">Dial *247# on your bKash activated mobile phone</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">Step 2</div>
                <div className="text-lg font-bold text-foreground mb-2">Select Send Money</div>
                <p className="text-sm text-muted-foreground">Choose option 1. Send Money from the menu</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">Step 3</div>
                <div className="text-lg font-bold text-foreground mb-2">01775647118</div>
                <p className="text-sm text-muted-foreground">Enter ANT Bogura bKash Personal Number</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">Step 4</div>
                <div className="text-lg font-bold text-foreground mb-2">Enter Amount</div>
                <p className="text-sm text-muted-foreground">Enter your bill amount</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">Step 5</div>
                <div className="text-lg font-bold text-foreground mb-2">Reference</div>
                <p className="text-sm text-muted-foreground">Enter your Customer ID as reference</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">Step 6</div>
                <div className="text-lg font-bold text-foreground mb-2">Enter PIN</div>
                <p className="text-sm text-muted-foreground">Enter your bKash PIN to confirm payment</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border lg:col-span-2">
                <div className="text-sm font-semibold text-[#E2136E] mb-2">Step 7</div>
                <div className="text-lg font-bold text-foreground mb-2">Payment Successful!</div>
                <p className="text-sm text-muted-foreground">You will receive a confirmation SMS with TrxID</p>
              </div>
            </div>
          </div>
          )}

          {/* Nagad Merchant Payment Section */}
          {visibility.nagad_merchant && (
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border mb-8">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={nagadLogo} 
                alt="Nagad Logo" 
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-2xl text-foreground">Nagad Merchant Payment</h3>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">Merchant Account: {merchantNumber}</p>
                  <button
                    onClick={copyMerchantNumber}
                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    title="Copy merchant number"
                  >
                    {copiedMerchant ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 1</div>
                <div className="text-2xl font-bold text-foreground mb-2">*167#</div>
                <p className="text-sm text-muted-foreground">Dial *167# on your Nagad activated mobile phone</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 2</div>
                <div className="text-lg font-bold text-foreground mb-2">Select Payment</div>
                <p className="text-sm text-muted-foreground">Choose option 4. Payment from the menu</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 3</div>
                <div className="text-lg font-bold text-foreground mb-2">01332-147787</div>
                <p className="text-sm text-muted-foreground">Enter ANT Bogura Nagad Merchant Number</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 4</div>
                <div className="text-lg font-bold text-foreground mb-2">Enter Amount</div>
                <p className="text-sm text-muted-foreground">Enter your bill amount</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 5</div>
                <div className="text-lg font-bold text-foreground mb-2">Counter No: 1</div>
                <p className="text-sm text-muted-foreground">Enter Counter No as 1</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 6</div>
                <div className="text-lg font-bold text-foreground mb-2">Reference</div>
                <p className="text-sm text-muted-foreground">Enter your Customer ID as reference</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 7</div>
                <div className="text-lg font-bold text-foreground mb-2">Enter PIN</div>
                <p className="text-sm text-muted-foreground">Enter your Nagad PIN to confirm payment</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 8</div>
                <div className="text-lg font-bold text-foreground mb-2">Payment Successful!</div>
                <p className="text-sm text-muted-foreground">You will receive a confirmation SMS with TrxID</p>
              </div>
            </div>
          </div>
          )}

          {/* Nagad Send Money (Personal) Payment Section */}
          {visibility.nagad_personal && (
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border mb-12">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={nagadLogo} 
                alt="Nagad Logo" 
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-2xl text-foreground">Nagad Send Money</h3>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">Personal Account: {personalNumber}</p>
                  <button
                    onClick={copyPersonalNumber}
                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    title="Copy personal number"
                  >
                    {copiedPersonal ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 1</div>
                <div className="text-2xl font-bold text-foreground mb-2">*167#</div>
                <p className="text-sm text-muted-foreground">Dial *167# on your Nagad activated mobile phone</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 2</div>
                <div className="text-lg font-bold text-foreground mb-2">Select Send Money</div>
                <p className="text-sm text-muted-foreground">Choose option 2. Send Money from the menu</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 3</div>
                <div className="text-lg font-bold text-foreground mb-2">01775647118</div>
                <p className="text-sm text-muted-foreground">Enter ANT Bogura Nagad Personal Number</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 4</div>
                <div className="text-lg font-bold text-foreground mb-2">Enter Amount</div>
                <p className="text-sm text-muted-foreground">Enter your bill amount</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 5</div>
                <div className="text-lg font-bold text-foreground mb-2">Reference</div>
                <p className="text-sm text-muted-foreground">Enter your Customer ID as reference</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 6</div>
                <div className="text-lg font-bold text-foreground mb-2">Enter PIN</div>
                <p className="text-sm text-muted-foreground">Enter your Nagad PIN to confirm payment</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border lg:col-span-2">
                <div className="text-sm font-semibold text-[#F6921E] mb-2">Step 7</div>
                <div className="text-lg font-bold text-foreground mb-2">Payment Successful!</div>
                <p className="text-sm text-muted-foreground">You will receive a confirmation SMS with TrxID</p>
              </div>
            </div>
          </div>
          )}
          </>
          )}

          {/* Payment Instructions Image */}
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
              Step-by-Step Payment Instructions
            </h2>
            <div className="flex justify-center">
              <img 
                src={paymentInfoImage} 
                alt="Payment instructions for bKash and Nagad - ANT Bogura" 
                className="max-w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-12 bg-primary/5 p-6 rounded-2xl border border-primary/20">
            <h3 className="font-bold text-lg text-foreground mb-4">Important Notes:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Use your Customer ID as Reference when making payment</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>You will receive a confirmation SMS after successful payment</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Keep your Transaction ID (TrxID) for future reference</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>For any payment issues, contact us on WhatsApp: +880 1332-147787</span>
              </li>
            </ul>
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="bg-card p-6 md:p-8 rounded-2xl border border-border">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-foreground hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BillPayment;
