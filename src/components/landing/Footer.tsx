import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  "For Creators": ["Browse Campaigns", "Earnings Calculator", "Creator FAQ", "KYC Guide"],
  "For Brands": ["Create Campaign", "Pricing", "Brand FAQ", "Case Studies"],
  Company: ["About Us", "Blog", "Careers", "Contact"],
  Legal: ["Terms of Service", "Privacy Policy", "Refund Policy", "TDS Policy"],
};

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo & tagline */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Clip<span className="text-primary">Rupee</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              India's performance-based creator marketing platform.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-bold text-sm text-foreground mb-3">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 ClipRupee. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Made in India</span>
            <span>🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
