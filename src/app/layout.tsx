import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { AdminProvider } from '@/contexts/AdminContext'
import CartIndicator from '@/components/CartIndicator'
import FloatingCartButton from '@/components/FloatingCartButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HurluBio - Légumes Bio Locaux',
  description: 'Commandez vos légumes bio directement chez nos producteurs locaux',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AdminProvider>
          <CartProvider>
            <header className="bg-green-600 text-white">
              <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                  <a href="/" className="text-2xl font-bold">
                    🌱 HurluBio
                  </a>
                  <nav className="flex items-center space-x-6">
                    <a href="/" className="hover:text-green-200">
                      Accueil
                    </a>
                    <a href="/cart" className="hover:text-green-200">
                      <CartIndicator />
                    </a>
                  </nav>
                </div>
              </div>
            </header>
            
            <main>
              {children}
            </main>
            
            <FloatingCartButton />
            
            <footer className="bg-gray-800 text-white py-8 mt-12">
              <div className="container mx-auto px-4 text-center">
                <p>&copy; 2024 HurluBio - Légumes bio locaux</p>
              </div>
            </footer>
          </CartProvider>
        </AdminProvider>
      </body>
    </html>
  )
}

