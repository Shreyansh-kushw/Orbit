import { Navbar } from '@/components/orbit/navbar'
import { Sidebar } from '@/components/orbit/sidebar'
import { getCurrentUser } from '@/lib/auth'
import { mapUser } from '@/lib/utils'
import { HelpCircle, Shield, Zap, UserPlus, CreditCard, Globe, MessageSquare } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link'

export default async function FAQPage() {
  const rawUser = await getCurrentUser()
  const user = rawUser ? mapUser(rawUser) : null

  const faqs = [
    {
      category: "General",
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      questions: [
        {
          q: "What is ORBIT?",
          a: "ORBIT is a futuristic social platform designed for high-signal discussions. We focus on connecting people through shared interests, deep exploration, and meaningful interactions in a visually stunning, distraction-free environment."
        },
        {
          q: "Is ORBIT free to use?",
          a: "Yes! The core ORBIT experience is entirely free. We believe that access to global conversation should be available to everyone."
        },
        {
          q: "How do I invite my friends?",
          a: "You can simply share your profile URL or any post link with them. We are also working on a dedicated invitation system to reward community growth."
        }
      ]
    },
    {
      category: "Account & Security",
      icon: <Shield className="w-5 h-5 text-success" />,
      questions: [
        {
          q: "How do I protect my account?",
          a: "Beyond a strong password, we use JWT-based secure sessions. We recommend regularly reviewing your account settings and ensuring your email remains private."
        },
        {
          q: "Can I change my username?",
          a: "Currently, usernames are permanent identifiers to maintain trust within the community. However, you can change your display name at any time in your profile settings."
        },
        {
          q: "What happens when I delete my account?",
          a: "Deletion is permanent. All your posts, comments, and profile data will be purged from our active databases. Some data may persist in encrypted backups for a short period before final deletion."
        }
      ]
    },
    {
      category: "Platform Features",
      icon: <Zap className="w-5 h-5 text-accent" />,
      questions: [
        {
          q: "How does the 'Explore' algorithm work?",
          a: "ORBIT's algorithm is designed to surface 'Trending' content based on recent engagement velocity—likes, comments, and shares—rather than just sheer volume, giving new voices a chance to be heard."
        },
        {
          q: "Can I format my posts with Markdown?",
          a: "We currently support standard text with plans to roll out a rich-text editor supporting full Markdown and code snippets in the near future."
        }
      ]
    },
    {
      category: "Community & Privacy",
      icon: <Globe className="w-5 h-5 text-warning" />,
      questions: [
        {
          q: "How do I report inappropriate content?",
          a: "Every post has a report option in its context menu. Our moderation team reviews all reports against our community guidelines to ensure a safe environment."
        },
        {
          q: "Does ORBIT sell my data?",
          a: "No. Your privacy is a core pillar of our philosophy. We do not sell your personal information or browsing habits to third-party advertisers."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isAuthenticated={!!user}
        user={user || undefined}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="glass rounded-xl p-6 md:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center glow-primary">
                  <HelpCircle className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight">FAQ</h1>
              </div>
              
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Everything you need to know about navigating the ORBIT. 
                Discover how we work and how you can get the most out of your experience.
              </p>

              <div className="space-y-12">
                {faqs.map((group) => (
                  <div key={group.category} className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-border/30">
                      {group.icon}
                      <h2 className="text-2xl font-bold text-foreground">{group.category}</h2>
                    </div>
                    
                    <div className="grid gap-4">
                      <Accordion type="single" collapsible className="w-full space-y-4">
                        {group.questions.map((faq, index) => (
                          <AccordionItem 
                            key={index} 
                            value={`item-${group.category}-${index}`} 
                            className="border-none bg-secondary/10 rounded-xl overflow-hidden mb-2"
                          >
                            <AccordionTrigger className="hover:bg-secondary/20 px-6 py-5 transition-all hover:no-underline group">
                              <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors text-left">
                                {faq.q}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-5 text-lg text-muted-foreground leading-relaxed bg-background/40 border-t border-border/10">
                              {faq.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                ))}
              </div>

              {/* Still need help? */}
              <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Still have questions?</h3>
                  <p className="text-lg text-muted-foreground">Our support team is always ready to guide you through the stars.</p>
                </div>
                <Link 
                  href="/contact" 
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-base hover:bg-primary/90 transition-all glow-primary hover:scale-105 whitespace-nowrap text-center flex items-center justify-center min-w-[180px]"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <Sidebar />
        </div>
      </main>
    </div>
  )
}
