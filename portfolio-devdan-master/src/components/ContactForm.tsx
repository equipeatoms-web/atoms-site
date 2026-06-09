import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { fadeUp } from "@/lib/animations/variants";

export const ContactForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", whatsapp: "", businessType: "", message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert([{
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        business_type: formData.businessType,
        message: formData.message,
        source: "website",
        status: "new",
      }]);
      if (error) throw error;
      toast({ title: "Recebi sua aplicação.", description: "Te respondo em até 24h, no WhatsApp." });
      setFormData({ name: "", email: "", whatsapp: "", businessType: "", message: "" });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Tenta de novo ou me chama direto no WhatsApp.";
      toast({ title: "Algo travou no envio.", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const walkaway = [
    "Viabilidade técnica do seu caso — em texto, não em 'vamos marcar outra'.",
    "Arquitetura sugerida com diagrama — direto, em português.",
    "Faixa de prazo e investimento — sem 'depende', sem proposta aberta.",
  ];

  return (
    <section id="contato" className="py-32 hairline relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(38 33% 70% / 0.4) 20%, hsl(42 55% 60% / 0.6) 50%, hsl(38 33% 70% / 0.4) 80%, transparent)",
          mixBlendMode: "screen",
          filter: "blur(8px)",
        }}
      />
      <div className="container mx-auto px-6 relative">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-start">
          <Reveal>
            <div className="section-label mb-6">Conversa com retorno</div>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.02] mb-8">
              Me conta seu cenário.
              <br />
              Eu volto com a <em className="text-primary not-italic italic">próxima</em>
              <br />
              que eu construo.
            </h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-md">
              Se o seu caso couber, eu te mando arquitetura e faixa de preço em <span className="text-foreground/90">24h</span>. Se não couber, eu te digo direto e indico quem resolve.
            </p>
            <StaggerGroup stagger={0.1} className="space-y-2.5 max-w-md">
              <div className="section-label mb-3">O que você recebe:</div>
              {walkaway.map((w) => (
                <motion.div
                  key={w}
                  variants={fadeUp}
                  className="flex items-start gap-3 text-[15px] text-foreground/85"
                >
                  <Check className="w-4 h-4 text-primary mt-1 shrink-0" />
                  <span>{w}</span>
                </motion.div>
              ))}
            </StaggerGroup>
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="glass glass-highlight rounded-sm p-8 space-y-4"
            >
              <Input required placeholder="Como você quer ser chamado"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background/40 border-border rounded-sm h-11 focus:border-primary focus:ring-primary/30" />
              <Input required type="tel" placeholder="WhatsApp — eu respondo por aqui"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="bg-background/40 border-border rounded-sm h-11 focus:border-primary" />
              <Input type="email" placeholder="E-mail — pra eu te mandar a arquitetura"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background/40 border-border rounded-sm h-11 focus:border-primary" />
              <Input placeholder="Nome da sua empresa ou marca"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="bg-background/40 border-border rounded-sm h-11 focus:border-primary" />
              <Textarea required placeholder="Me conta em 3 linhas: o que sua empresa faz, qual o gargalo, e o que você já tentou"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-background/40 border-border rounded-sm min-h-[120px] focus:border-primary" />

              <MagneticButton
                type="submit"
                disabled={loading}
                strength={0.2}
                className="w-full bg-primary text-primary-foreground py-3.5 text-sm font-medium rounded-sm tracking-wide transition disabled:opacity-60 shadow-glow btn-glow"
              >
                {loading ? "Enviando..." : "Quero minha análise de aplicação"}
              </MagneticButton>
              <p className="text-[11px] text-muted-foreground/70 text-center pt-2">
                Seus dados ficam comigo. Sem newsletter, sem CRM compartilhado.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
