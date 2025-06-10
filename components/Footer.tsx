import Link from 'next/link'
import { FC } from 'react'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTwitter,
} from 'react-icons/fa'

const Footer: FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      {/* ─────────── Contenedor principal (responsive) ─────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* ─────────── Columna 1: Branding y descripción ─────────── */}
          <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
            {/* Logo “LUXLINE” */}
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-extrabold text-white uppercase">
                LUXLINE
              </h2>
            </Link>
            <p className="text-sm">
              LUXLINE es una marca líder en soluciones de iluminación que fusiona
              estilo y tecnología. Inspirados en brindar ambientes únicos y
              confortables, ofrecemos productos de alta calidad para hogares,
              oficinas e industrias.
            </p>
          </div>

          {/* ─────────── Columna 2: Enlaces de navegación ─────────── */}
          <div className="flex flex-col items-center sm:items-start space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold text-white">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/productos" className="hover:text-white transition">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/lineas" className="hover:text-white transition">
                  Líneas
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-white transition">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-white transition">
                  Catálogo
                </Link>
              </li>
            </ul>
          </div>

          {/* ─────────── Columna 3: Contacto y redes sociales ─────────── */}
          <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
            <h3 className="text-lg font-semibold text-white">Contacto</h3>
            <p className="text-sm">
              Av. Iluminación 1234<br />
              Ciudad de la Luz, CP 5678<br />
              Argentina
            </p>
            <p className="text-sm">Tel: +54 11 1234-5678</p>
            <p className="text-sm">Email: contacto@luxline.com.ar</p>

            <div className="flex space-x-3 mt-4">
              <Link
                href="https://facebook.com/luxline"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                <FaFacebookF className="text-gray-300 hover:text-white" />
              </Link>
              <Link
                href="https://instagram.com/luxline"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                <FaInstagram className="text-gray-300 hover:text-white" />
              </Link>
              <Link
                href="https://linkedin.com/company/luxline"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                <FaLinkedinIn className="text-gray-300 hover:text-white" />
              </Link>
              <Link
                href="https://youtube.com/luxline"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                <FaYoutube className="text-gray-300 hover:text-white" />
              </Link>
              <Link
                href="https://twitter.com/luxline"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                <FaTwitter className="text-gray-300 hover:text-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────── Línea separadora ─────────── */}
      <div className="border-t border-gray-700" />

      {/* ─────────── Pie copyright ─────────── */}
      <div className="mt-6 text-center text-xs text-gray-500 pb-6">
        LUXLINE® es una marca registrada de Coresa Group SRL, Todos los derechos
        reservados 2025.
      </div>
    </footer>
  )
}

export default Footer
