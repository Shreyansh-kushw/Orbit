import { Navbar } from '@/components/orbit/navbar'
import { Sidebar } from '@/components/orbit/sidebar'
import { getCurrentUser } from '@/lib/auth'
import { mapUser } from '@/lib/utils'
import { Shield, Eye, Lock, FileText } from 'lucide-react'

export default async function PrivacyPage() {
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
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
              </div>

              <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
                <section>
                  <p className="text-xl">
                    Last updated: June 2, 2026. At ORBIT, we take your privacy seriously. 
                    This policy describes how we collect, use, and protect your personal information.
                  </p>
                </section>

                <div className="grid gap-6">
                  <div className="glass p-6 rounded-xl border-border/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Eye className="w-5 h-5 text-accent" />
                      <h2 className="text-2xl font-semibold text-foreground m-0">Information We Collect</h2>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-base">
                      <li>Account Information: Username, email, and profile details.</li>
                      <li>Content: Posts and media you upload to the platform.</li>
                      <li>Usage Data: How you interact with the platform to improve our services.</li>
                      <li>Device Information: IP address, browser type, and operating system.</li>
                    </ul>
                  </div>

                  <div className="glass p-6 rounded-xl border-border/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="w-5 h-5 text-success" />
                      <h2 className="text-2xl font-semibold text-foreground m-0">How We Use Your Data</h2>
                    </div>
                    <p className="text-base">
                      We use your information to provide, maintain, and improve ORBIT&apos;s features. 
                      Specifically, we use it to personalize your experience, facilitate communication 
                      between users, and ensure the security of our platform.
                    </p>
                  </div>

                  <div className="glass p-6 rounded-xl border-border/50">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-5 h-5 text-warning" />
                      <h2 className="text-2xl font-semibold text-foreground m-0">Data Sharing</h2>
                    </div>
                    <p className="text-base">
                      We do not sell your personal data. We only share information with third-party 
                      service providers who assist us in operating ORBIT, or when required by law.
                    </p>
                  </div>
                </div>

                <section>
                  <h2 className="text-2xl font-bold text-foreground">Your Rights</h2>
                  <p className="text-base">
                    You have the right to access, correct, or delete your personal information 
                    at any time. You can manage most of these settings directly through your 
                    account settings.
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
