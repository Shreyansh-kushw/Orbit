import { Navbar } from '@/components/orbit/navbar'
import { Sidebar } from '@/components/orbit/sidebar'
import { getCurrentUser } from '@/lib/auth'
import { mapUser } from '@/lib/utils'
import { Scale, AlertCircle, CheckCircle2, Gavel } from 'lucide-react'

export default async function TermsPage() {
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
          <div className="flex-1 space-y-6">
            <div className="glass rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
              </div>

              <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
                <section>
                  <p className="text-xl">
                    By accessing or using ORBIT, you agree to be bound by these Terms of Service. 
                    Please read them carefully before using our platform.
                  </p>
                </section>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground m-0 mb-2">User Responsibilities</h2>
                      <p className="text-base">
                        You are responsible for your use of ORBIT and for any content you provide. 
                        You must comply with all applicable laws and regulations. You may not use 
                        ORBIT for any illegal or unauthorized purpose.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1">
                      <AlertCircle className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground m-0 mb-2">Content Restrictions</h2>
                      <p className="text-base">
                        We reserve the right to remove content that violates our community guidelines, 
                        including but not limited to: harassment, hate speech, and intellectual 
                        property infringement.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1">
                      <Gavel className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground m-0 mb-2">Disclaimers</h2>
                      <p className="text-base">
                        ORBIT is provided &quot;as is&quot; without any warranties. We do not guarantee 
                        that the platform will always be safe, secure, or error-free.
                      </p>
                    </div>
                  </div>
                </div>

                <section>
                  <h2 className="text-2xl font-bold text-foreground">Termination</h2>
                  <p className="text-base">
                    We may suspend or terminate your access to ORBIT at any time, with or without 
                    cause, if we believe you have violated these terms.
                  </p>
                </section>
              </div>
            </div>
          </div>
          <Sidebar />
        </div>
      </main>
    </div>
  )
}
