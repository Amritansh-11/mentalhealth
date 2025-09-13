import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CrisisResources() {
  const crisisContacts = [
    {
      name: "988 Suicide & Crisis Lifeline",
      description: "24/7 free and confidential support",
      action: "Call Now",
      actionType: "phone",
      contact: "988",
      icon: "fas fa-phone"
    },
    {
      name: "Crisis Text Line",
      description: "Text \"HELLO\" to 741741",
      action: "Text Now",
      actionType: "text",
      contact: "741741",
      icon: "fas fa-sms"
    },
    {
      name: "National Domestic Violence Hotline",
      description: "1-800-799-7233",
      action: "Call Now",
      actionType: "phone",
      contact: "1-800-799-7233",
      icon: "fas fa-shield-alt"
    },
    {
      name: "SAMHSA National Helpline",
      description: "Mental health and substance use",
      action: "Call Now",
      actionType: "phone",
      contact: "1-800-662-4357",
      icon: "fas fa-life-ring"
    }
  ];

  const handleContactClick = (contact: string, type: string) => {
    if (type === "phone") {
      window.open(`tel:${contact}`, '_self');
    } else if (type === "text") {
      window.open(`sms:${contact}?body=HELLO`, '_self');
    }
  };

  return (
    <section className="bg-destructive/10 border border-destructive/20 p-6 rounded-xl" data-testid="crisis-resources">
      <h3 className="text-lg font-bold text-destructive mb-4">
        <i className="fas fa-exclamation-triangle mr-2"></i>Crisis Resources
      </h3>
      <div className="space-y-4">
        {crisisContacts.slice(0, 2).map((contact, index) => (
          <div key={index} className="bg-card p-4 rounded-lg border border-destructive/20">
            <div className="flex items-start space-x-3">
              <i className={`${contact.icon} text-destructive text-lg mt-1`}></i>
              <div className="flex-1">
                <h4 className="font-semibold text-destructive mb-1" data-testid={`crisis-name-${index}`}>
                  {contact.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-3" data-testid={`crisis-description-${index}`}>
                  {contact.description}
                </p>
                <Button 
                  className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => handleContactClick(contact.contact, contact.actionType)}
                  data-testid={`button-${contact.actionType}-${index}`}
                >
                  <i className={`${contact.icon} mr-2`}></i>{contact.action}
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full text-destructive border-destructive hover:bg-destructive/10"
          data-testid="button-more-emergency-resources"
        >
          More Emergency Resources
        </Button>
      </div>

      <div className="mt-6 p-4 bg-card rounded-lg border border-destructive/20">
        <div className="flex items-start space-x-2">
          <i className="fas fa-info-circle text-destructive mt-1"></i>
          <div>
            <h5 className="font-semibold text-sm text-destructive mb-1">When to Seek Immediate Help</h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Thoughts of suicide or self-harm</li>
              <li>• Feeling completely overwhelmed</li>
              <li>• Substance abuse emergency</li>
              <li>• Experiencing abuse or violence</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
