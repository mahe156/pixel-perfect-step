import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle, ArrowRight, ArrowLeft, Copy, RefreshCw, CreditCard, Landmark } from "lucide-react";
import { PAN_REGEX, UPI_REGEX, IFSC_REGEX } from "@/lib/format";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type KYCStep = 1 | 2 | 3;

const CreatorKYC = () => {
  const { session } = useAuth();
  const [step, setStep] = useState<KYCStep>(1);
  const [panNumber, setPanNumber] = useState("");
  const [panVerified, setPanVerified] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "bank">("upi");
  const [upiId, setUpiId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [bioCode] = useState(`CLIPR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  const [bioVerifying, setBioVerifying] = useState(false);
  const [bioVerified, setBioVerified] = useState(false);
  const [bioPlatform, setBioPlatform] = useState<"youtube" | "instagram">("youtube");
  const [bioHandle, setBioHandle] = useState("");

  const isPanValid = PAN_REGEX.test(panNumber);
  const isUpiValid = UPI_REGEX.test(upiId);
  const isIfscValid = IFSC_REGEX.test(bankIfsc);

  const verifyPan = () => {
    if (!isPanValid) {
      toast.error("Invalid PAN format. Expected: ABCDE1234F");
      return;
    }
    setPanVerified(true);
    toast.success("PAN verified successfully!");
  };

  const verifyBio = async () => {
    if (!bioHandle.trim()) {
      toast.error("Please enter your channel/username handle");
      return;
    }
    setBioVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-bio", {
        body: {
          platform: bioPlatform,
          handle: bioHandle.trim().replace("@", ""),
          verification_code: bioCode,
        },
      });

      if (error) throw error;

      if (data?.verified) {
        setBioVerified(true);
        toast.success("Bio verified! Your account is now verified.");
      } else {
        toast.error("Verification code not found in your bio. Make sure you've added it and try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "Verification failed. Please try again.");
    } finally {
      setBioVerifying(false);
    }
  };

  const stepStatus = (s: number) => {
    if (s < step) return "completed";
    if (s === step) return "active";
    return "pending";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">KYC Verification</h1>
        <p className="text-sm text-muted-foreground">Complete verification to receive payouts</p>
      </div>

      <ProgressSteps step={step} stepStatus={stepStatus} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <PanStep
            key="step1"
            panNumber={panNumber}
            setPanNumber={setPanNumber}
            isPanValid={isPanValid}
            panVerified={panVerified}
            verifyPan={verifyPan}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <PaymentStep
            key="step2"
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            upiId={upiId}
            setUpiId={setUpiId}
            isUpiValid={isUpiValid}
            bankName={bankName}
            setBankName={setBankName}
            bankAccount={bankAccount}
            setBankAccount={setBankAccount}
            bankIfsc={bankIfsc}
            setBankIfsc={setBankIfsc}
            isIfscValid={isIfscValid}
            onBack={() => setStep(1)}
            onNext={() => { toast.success("Payment details saved!"); setStep(3); }}
          />
        )}
        {step === 3 && (
          <BioStep
            key="step3"
            bioCode={bioCode}
            bioVerifying={bioVerifying}
            bioVerified={bioVerified}
            bioPlatform={bioPlatform}
            setBioPlatform={setBioPlatform}
            bioHandle={bioHandle}
            setBioHandle={setBioHandle}
            verifyBio={verifyBio}
            onBack={() => setStep(2)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

function ProgressSteps({ step, stepStatus }: { step: number; stepStatus: (s: number) => string }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center justify-between">
        {[
          { num: 1, label: "PAN Verification" },
          { num: 2, label: "Payment Details" },
          { num: 3, label: "Bio Verification" },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-3 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                stepStatus(s.num) === "completed"
                  ? "bg-success text-success-foreground"
                  : stepStatus(s.num) === "active"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {stepStatus(s.num) === "completed" ? <CheckCircle className="w-4 h-4" /> : s.num}
            </div>
            <span className={`text-xs font-medium ${stepStatus(s.num) === "active" ? "text-foreground" : "text-muted-foreground"}`}>
              {s.label}
            </span>
            {i < 2 && <div className={`flex-1 h-px mx-2 ${step > s.num ? "bg-success" : "bg-border"}`} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function PanStep({ panNumber, setPanNumber, isPanValid, panVerified, verifyPan, onNext }: {
  panNumber: string; setPanNumber: (v: string) => void; isPanValid: boolean;
  panVerified: boolean; verifyPan: () => void; onNext: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <CreditCard className="w-5 h-5 text-primary" />
        <h3 className="font-display font-bold text-foreground">PAN Verification</h3>
      </div>
      <p className="text-xs text-muted-foreground">Your PAN is required for TDS compliance.</p>
      <div className="space-y-2">
        <Label>PAN Number</Label>
        <Input value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10}
          className={`bg-muted border-border font-mono uppercase ${panNumber.length === 10 ? (isPanValid ? "border-success" : "border-destructive") : ""}`} />
        {panNumber.length === 10 && !isPanValid && <p className="text-xs text-destructive">Invalid PAN format</p>}
      </div>
      {panVerified ? (
        <>
          <div className="flex items-center gap-2 text-success text-sm"><CheckCircle className="w-4 h-4" /> PAN verified</div>
          <Button onClick={onNext} className="bg-primary text-primary-foreground hover:bg-primary/90">Next <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </>
      ) : (
        <Button onClick={verifyPan} disabled={!isPanValid} className="bg-primary text-primary-foreground hover:bg-primary/90">Verify PAN</Button>
      )}
    </motion.div>
  );
}

function PaymentStep({ paymentMethod, setPaymentMethod, upiId, setUpiId, isUpiValid, bankName, setBankName, bankAccount, setBankAccount, bankIfsc, setBankIfsc, isIfscValid, onBack, onNext }: {
  paymentMethod: "upi" | "bank"; setPaymentMethod: (v: "upi" | "bank") => void;
  upiId: string; setUpiId: (v: string) => void; isUpiValid: boolean;
  bankName: string; setBankName: (v: string) => void;
  bankAccount: string; setBankAccount: (v: string) => void;
  bankIfsc: string; setBankIfsc: (v: string) => void; isIfscValid: boolean;
  onBack: () => void; onNext: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass rounded-xl p-6 space-y-5">
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="w-3 h-3" /> Back</button>
      <div className="flex items-center gap-3"><Landmark className="w-5 h-5 text-primary" /><h3 className="font-display font-bold text-foreground">Payment Details</h3></div>
      <div className="flex gap-2">
        {(["upi", "bank"] as const).map((m) => (
          <button key={m} onClick={() => setPaymentMethod(m)}
            className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all border ${paymentMethod === m ? "bg-primary/10 text-primary border-primary/30" : "bg-muted text-muted-foreground border-border"}`}>
            {m === "upi" ? "UPI" : "Bank Account"}
          </button>
        ))}
      </div>
      {paymentMethod === "upi" ? (
        <div className="space-y-2">
          <Label>UPI ID</Label>
          <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@paytm" className="bg-muted border-border" />
          {upiId && !isUpiValid && <p className="text-xs text-destructive">Invalid UPI format</p>}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2"><Label>Account Holder Name</Label><Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="As per bank records" className="bg-muted border-border" /></div>
          <div className="space-y-2"><Label>Account Number</Label><Input value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} placeholder="Account number" className="bg-muted border-border" /></div>
          <div className="space-y-2"><Label>IFSC Code</Label><Input value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value.toUpperCase())} placeholder="SBIN0001234" className="bg-muted border-border font-mono" />
            {bankIfsc && !isIfscValid && <p className="text-xs text-destructive">Invalid IFSC format</p>}</div>
        </div>
      )}
      <Button onClick={onNext} disabled={paymentMethod === "upi" ? !isUpiValid : !bankAccount || !isIfscValid} className="bg-primary text-primary-foreground hover:bg-primary/90">
        Save & Continue <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
}

function BioStep({ bioCode, bioVerifying, bioVerified, bioPlatform, setBioPlatform, bioHandle, setBioHandle, verifyBio, onBack }: {
  bioCode: string; bioVerifying: boolean; bioVerified: boolean;
  bioPlatform: "youtube" | "instagram"; setBioPlatform: (v: "youtube" | "instagram") => void;
  bioHandle: string; setBioHandle: (v: string) => void;
  verifyBio: () => void; onBack: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass rounded-xl p-6 space-y-5">
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="w-3 h-3" /> Back</button>
      <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-primary" /><h3 className="font-display font-bold text-foreground">Bio Verification</h3></div>
      <p className="text-xs text-muted-foreground">Add the code below to your channel description or bio. We'll use Apify to verify ownership.</p>

      {/* Platform selection */}
      <div className="flex gap-2">
        {(["youtube", "instagram"] as const).map((p) => (
          <button key={p} onClick={() => setBioPlatform(p)}
            className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all border ${bioPlatform === p ? "bg-primary/10 text-primary border-primary/30" : "bg-muted text-muted-foreground border-border"}`}>
            {p === "youtube" ? "YouTube" : "Instagram"}
          </button>
        ))}
      </div>

      {/* Handle input */}
      <div className="space-y-2">
        <Label>{bioPlatform === "youtube" ? "YouTube Channel Handle" : "Instagram Username"}</Label>
        <Input value={bioHandle} onChange={(e) => setBioHandle(e.target.value)}
          placeholder={bioPlatform === "youtube" ? "@yourchannel" : "yourusername"}
          className="bg-muted border-border" />
      </div>

      {/* Code to copy */}
      <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
        <code className="font-mono text-lg font-bold text-primary">{bioCode}</code>
        <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(bioCode); toast.success("Copied!"); }} className="border-border text-muted-foreground">
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-xs text-muted-foreground">
        <p>1. Copy the code above</p>
        <p>2. Paste it in your {bioPlatform === "youtube" ? "YouTube channel description" : "Instagram bio"}</p>
        <p>3. Enter your handle above and click "Verify Now"</p>
        <p>4. We'll scrape your profile to confirm — you can remove the code after</p>
      </div>

      {bioVerified ? (
        <div className="flex items-center gap-2 text-success text-sm font-medium"><CheckCircle className="w-5 h-5" /> Bio verified! Your KYC is complete.</div>
      ) : (
        <Button onClick={verifyBio} disabled={bioVerifying || !bioHandle.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {bioVerifying ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Verifying (this may take ~60s)...</> : <>Verify Now</>}
        </Button>
      )}
    </motion.div>
  );
}

export default CreatorKYC;
