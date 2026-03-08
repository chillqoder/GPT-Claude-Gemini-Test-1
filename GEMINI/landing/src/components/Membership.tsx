
import { Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const Membership = () => {
  const tiers = [
    {
      name: "Baseline",
      price: "$250",
      period: "/month",
      description: "Foundational telemetry and biological monitoring.",
      features: ["Quarterly blood panels", "Basic algorithmic insights", "Monthly consultation"],
      isPopular: false
    },
    {
      name: "Performance",
      price: "$850",
      period: "/month",
      description: "Comprehensive molecular extraction and protocol synthesis.",
      features: ["Multi-omic sequencing", "Real-time protocol adaptation", "Direct clinical access", "Advanced biomarker tracking"],
      isPopular: true
    },
    {
      name: "Elite",
      price: "$2,000",
      period: "/month",
      description: "The absolute pinnacle of biological optimization.",
      features: ["Daily kinetic adjustments", "Full neural baseline syncing", "Concierge biological team", "Bespoke longevity interventions"],
      isPopular: false
    }
  ];

  return (
    <section className="py-32 px-8 md:px-16 lg:px-24 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-sans font-bold text-4xl md:text-6xl text-charcoal mb-4">Membership</h2>
          <p className="font-outfit text-xl text-charcoal/60">Select your level of biological optimization.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={cn(
                "rounded-[3rem] p-10 flex flex-col transition-transform duration-500 hover:-translate-y-2 border",
                tier.isPopular ? "bg-moss text-white border-moss shadow-2xl md:scale-105" : "bg-white text-charcoal border-moss/10 shadow-lg"
              )}
            >
              {tier.isPopular && <div className="text-clay font-mono text-xs uppercase tracking-widest mb-4">Optimal Choice</div>}
              <h3 className="font-serif italic text-3xl mb-2">{tier.name}</h3>
              <p className={cn("text-sm mb-8 h-10", tier.isPopular ? "text-white/70" : "text-charcoal/60")}>{tier.description}</p>
              <div className="mb-8">
                <span className="font-sans font-bold text-5xl">{tier.price}</span>
                <span className={cn("text-lg", tier.isPopular ? "text-white/50" : "text-charcoal/40")}>{tier.period}</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {tier.features.map(feature => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={cn("w-5 h-5 mt-0.5", tier.isPopular ? "text-clay" : "text-moss")} />
                    <span className={cn("text-sm", tier.isPopular ? "text-white/90" : "text-charcoal/80")}>{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                className={cn(
                  "w-full py-4 rounded-full font-medium transition-all duration-300",
                  tier.isPopular ? "bg-clay text-white hover:bg-clay/90" : "bg-cream text-charcoal hover:bg-charcoal hover:text-white"
                )}
              >
                Initialize Protocol
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Membership;