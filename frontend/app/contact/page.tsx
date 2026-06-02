import { Navbar } from '@/components/orbit/navbar'
import { Sidebar } from '@/components/orbit/sidebar'
import { getCurrentUser } from '@/lib/auth'
import { mapUser } from '@/lib/utils'
import { MessageSquare, Mail, MapPin, Phone, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default async function ContactPage() {
  const rawUser = await getCurrentUser()
  const user = rawUser ? mapUser(rawUser) : null

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
            <div className="glass rounded-2xl overflow-hidden">
              <div className="grid md:grid-cols-5 h-full">
                {/* Contact Info Sidebar */}
                <div className="md:col-span-2 bg-primary/10 p-8 md:p-10 flex flex-col justify-between border-r border-border/20">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-6">Contact Us</h1>
                    <p className="text-muted-foreground mb-10 leading-relaxed">
                      Have questions about ORBIT? Reach out and we&apos;ll get back to you as soon as possible.
                    </p>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:glow-primary transition-all">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="text-foreground font-medium">support@orbit.app</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center group-hover:glow-accent transition-all">
                          <MapPin className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="text-foreground font-medium">San Francisco, CA</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center group-hover:glow-success transition-all">
                          <Phone className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="text-foreground font-medium">+1 (555) 000-0000</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 md:mt-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-4">Follow Us</p>
                    <div className="flex gap-4">
                      {['X', 'GitHub', 'Discord'].map((platform) => (
                        <div key={platform} className="text-sm font-medium text-primary hover:underline cursor-pointer">
                          {platform}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-3 p-8 md:p-10">
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">First Name</label>
                        <Input 
                          placeholder="John" 
                          className="bg-secondary/30 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">Last Name</label>
                        <Input 
                          placeholder="Doe" 
                          className="bg-secondary/30 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
                      <Input 
                        type="email"
                        placeholder="john@example.com" 
                        className="bg-secondary/30 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground ml-1">Subject</label>
                      <Input 
                        placeholder="How can we help?" 
                        className="bg-secondary/30 border-border/50 h-12 rounded-xl focus:border-primary/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground ml-1">Message</label>
                      <Textarea 
                        placeholder="Tell us more about your inquiry..." 
                        className="bg-secondary/30 border-border/50 min-h-[150px] rounded-xl focus:border-primary/50 transition-all resize-none"
                      />
                    </div>

                    <Button 
                      className="w-full h-14 bg-primary text-primary-foreground text-lg font-bold rounded-xl glow-primary hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </Button>
                  </form>
                </div>
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
