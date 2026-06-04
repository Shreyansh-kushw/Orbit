import { Navbar } from '@/components/orbit/navbar'
import { Sidebar } from '@/components/orbit/sidebar'
import { getCurrentUser } from '@/lib/auth'
import { mapUser } from '@/lib/utils'
import { Code2, Database, Shield, Zap, Layout, Globe } from 'lucide-react'

export default async function AboutPage() {
  const rawUser = await getCurrentUser()
  const user = rawUser ? mapUser(rawUser) : null

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isAuthenticated={!!user}
        user={user || undefined}
      />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 space-y-12">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tight text-foreground">ORBIT</h1>
              <p className="text-2xl text-muted-foreground leading-relaxed">
                A full-stack social platform built with <span className="text-primary font-semibold">Next.js</span> and <span className="text-primary font-semibold">FastAPI</span>
              </p>
            </div>

            {/* What is it */}
            <section className="glass rounded-2xl p-8 space-y-4 border border-white/5 shadow-xl">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="w-6 h-1 bg-primary rounded-full"></span>
                What is this?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                ORBIT is a social platform where you can create posts, follow users, and discover content. It's built to showcase full-stack development — a modern frontend paired with a clean, scalable backend.
              </p>
            </section>

            {/* Tech Stack */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="w-6 h-1 bg-primary rounded-full"></span>
                How it's built
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Layout className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Frontend</h3>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">Next.js 16 with Server Components, Tailwind, and modern React patterns.</p>
                </div>
                
                <div className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Database className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Backend</h3>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">FastAPI with async SQLAlchemy, JWT auth, and type safety via Pydantic.</p>
                </div>

                <div className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Key Feature</h3>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">Semantic search powered by LangChain — find posts by meaning, not just keywords.</p>
                </div>

                <div className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Security</h3>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">JWT tokens, Argon2 hashing, CORS policies, and secure session handling.</p>
                </div>
              </div>
            </section>

            {/* Why I built it */}
            <section className="glass rounded-2xl p-8 space-y-4 border-l-4 border-l-primary shadow-lg bg-primary/5">
              <h2 className="text-2xl font-bold text-foreground">Why?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To learn how to build real systems. Not just APIs that work locally, but something deployed and usable. Every decision — from database design to error handling — was intentional.
              </p>
            </section>

            {/* Footer */}
            <footer className="pt-10 border-t border-border/50">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-1">Built by</p>
                  <h3 className="text-4xl font-black text-foreground tracking-tight">Shreyansh Kushwaha</h3>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-lg text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    2nd year
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Backend engineer
                  </span>
                  <a href="https://github.com/Shreyansh-kushw" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold flex items-center gap-1">
                    GitHub
                    <Globe className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </footer>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
