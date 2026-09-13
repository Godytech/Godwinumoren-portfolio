import { ScrollTimeline, TimelineEvent } from "../lightswind/scroll-timeline";
import { Briefcase, Award, Layers, Users, Globe } from "lucide-react";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useFirestoreDoc } from "../../hooks/useFirestoreDoc";
import { initialPortfolioData } from "../../data/initialData";
import { CareerEvent, HeroContent } from "../../types";

const getCareerIcon = (iconName: string | undefined, accentColor: string) => {
  const iconStyle = { color: accentColor };
  switch (iconName?.toLowerCase()) {
    case "globe":
      return <Globe className="h-4 w-4 mr-2" style={iconStyle} />;
    case "layers":
      return <Layers className="h-4 w-4 mr-2" style={iconStyle} />;
    case "award":
      return <Award className="h-4 w-4 mr-2" style={iconStyle} />;
    case "users":
      return <Users className="h-4 w-4 mr-2" style={iconStyle} />;
    case "briefcase":
    default:
      return <Briefcase className="h-4 w-4 mr-2" style={iconStyle} />;
  }
};

export const CareerTimeline = () => {
  const { items: careerEvents } = useFirestoreCollection<CareerEvent>("career", initialPortfolioData.career);
  const { data: hero } = useFirestoreDoc<HeroContent>("content", "hero", initialPortfolioData.hero);
  const accentColor = hero.cardAccentColor || initialPortfolioData.hero.cardAccentColor || "#8b5cf6";

  const formattedEvents: TimelineEvent[] = careerEvents.map((evt) => ({
    id: evt.id,
    year: evt.year,
    title: evt.title,
    subtitle: evt.subtitle,
    description: evt.description,
    icon: getCareerIcon(evt.icon, accentColor),
  }));

  return (
    <div id="career">
      <ScrollTimeline
        events={formattedEvents}
        title="Career Journey"
        subtitle="An evolving path of leadership, innovation, and impact"
        animationOrder="staggered"
        cardAlignment="alternating"
        cardVariant="elevated"
        progressIndicator={true}
        lineColor="bg-primary/20"
        accentColor={accentColor}
        progressLineWidth={3}
      />
    </div>
  );
};

export default CareerTimeline;
