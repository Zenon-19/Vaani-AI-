import React from "react";
import { CommunicationInsight } from "../../types";
import { Card } from "../ui/Card";
import {
  AlertTriangle,
  Lightbulb,
  Zap,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  Compass,
} from "lucide-react";

interface CommunicationInsightCardProps {
  insights: CommunicationInsight[];
}

export const CommunicationInsightCard: React.FC<CommunicationInsightCardProps> = ({
  insights,
}) => {
  const getTypeConfig = (type: CommunicationInsight["type"]) => {
    switch (type) {
      case "misunderstanding":
        return {
          label: "Hinglish Language Divergence",
          icon: HelpCircle,
          color: "text-[#C8A6FF]",
        };
      case "unspoken_assumption":
        return {
          label: "Unspoken Assumption",
          icon: Lightbulb,
          color: "text-amber-300",
        };
      case "contradiction":
        return {
          label: "Internal Contradiction",
          icon: RefreshCw,
          color: "text-rose-400",
        };
      case "escalation_pattern":
        return {
          label: "Escalation Dynamic",
          icon: TrendingUp,
          color: "text-[#F5AFCF]",
        };
      case "unclear_expectation":
        return {
          label: "Ambiguous Expectation",
          icon: Compass,
          color: "text-[#C9FF32]",
        };
      case "emotional_trigger":
      default:
        return {
          label: "Underlying Concern / Stake",
          icon: Zap,
          color: "text-amber-400",
        };
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-[#F1F0E9] tracking-tight">
          Communication Nuances & Friction Points
        </h3>
        <p className="text-xs text-[#A4A69F] mt-0.5">
          Underlying dynamics, terminology gaps, and conversational pivots.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight) => {
          const cfg = getTypeConfig(insight.type);
          const Icon = cfg.icon;

          return (
            <Card key={insight.id} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${cfg.color} shrink-0`} />
                  <span className={`text-xs font-semibold ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-[#F1F0E9] leading-snug">
                  {insight.title}
                </h4>

                <p className="text-xs text-[#A4A69F] leading-relaxed">
                  {insight.description}
                </p>

                {insight.excerpt && (
                  <div className="p-2.5 rounded-xl bg-[#111311] border border-[#30332E] text-xs italic text-[#F1F0E9]">
                    "{insight.excerpt}"
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#111311]/80 border border-[#30332E]/60 text-xs text-[#C9FF32] leading-snug">
                <span className="font-semibold">Coach Tip:</span> {insight.recommendation}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
