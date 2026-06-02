import { Navbar } from '@/components/orbit/navbar'
import { Sidebar } from '@/components/orbit/sidebar'
import { getCurrentUser } from '@/lib/auth'
import { mapUser } from '@/lib/utils'
import { Info, Users, Shield, Zap } from 'lucide-react'

export default async function AboutPage() {
  const rawUser = await getCurrentUser()
  const user = rawUser ? mapUser(rawUser) : null

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isAuthenticated={!!user}
        user={user || undefined}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="glass rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Info className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">About ORBIT</h1>
              </div>
              
              <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  ORBIT is a next-generation social platform designed for thinkers, creators, and innovators. 
                  In a world of fragmented conversations, we provide a unified space for deep exploration 
                  and meaningful connection.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-12">
                  <div className="glass p-6 rounded-xl border-primary/20">
                    <Users className="w-6 h-6 text-accent mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Community First</h3>
                    <p className="text-sm">
                      Built around the principle of human-centric design, ORBIT prioritizes 
                      community health and constructive dialogue.
                    </p>
                  </div>
                  <div className="glass p-6 rounded-xl border-primary/20">
                    <Zap className="w-6 h-6 text-success mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Fast & Fluid</h3>
                    <p className="text-sm">
                      Experience a seamless interface optimized for speed, allowing you to 
                      navigate the universe of ideas without friction.
                    </p>
                  </div>
                  <div className="glass p-6 rounded-xl border-primary/20">
                    <Shield className="w-6 h-6 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Privacy Centric</h3>
                    <p className="text-sm">
                      Your data belongs to you. We employ industry-leading security practices 
                      to ensure your digital footprint remains protected.
                    </p>
                  </div>
                  <div className="glass p-6 rounded-xl border-primary/20">
                    <Info className="w-6 h-6 text-warning mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Open Standards</h3>
                    <p className="text-sm">
                      ORBIT is built on open technologies, fostering an ecosystem where 
                      innovation is shared and encouraged.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-foreground mt-8">Our Vision</h2>
                <p>
                  To create a digital habitat that enhances human intelligence and fosters 
                  global cooperation through transparent communication and shared knowledge.
                </p>
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
