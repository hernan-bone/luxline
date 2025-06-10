import { Nav as Navbar} from '../components'
import { Footer as Footer} from '../components'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-419">
      <head>
        {/*
          Aquí van tus <meta>, <title> u otros tags globales. 
          No pongas <body> ni <div> fuera de `<html>`.
        */}
      </head>
      <body className="flex flex-col min-h-screen font-sans bg-gray-100">
        {/* 1. Navbar fijo arriba */}
        <Navbar />

        {/*
          2. Main: TODO el resto de vistas va dentro de este <main>. 
             Colocamos pt-16 para dejar espacio al Navbar (h-16).
        */}
        <main className="flex-grow pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* 3. Footer al final */}
        <Footer />
      </body>
    </html>
  )
}