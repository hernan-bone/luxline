import React from 'react'
import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import Image from 'next/image'

interface ProductDetail {
  name: string
  route: string
  description: string
  sku: string
  physics: Record<string, string>
  commercial: Record<string, string>
  image: string // por ejemplo “APCDR-X2-N-PC-CO.png”
}

export async function generateStaticParams() {
  // Leemos todas las combinaciones (categoria, tipo, producto) para generar estáticamente
  const productsListPath = path.join(process.cwd(), 'app', 'BBDD', 'PRODUCTS_LIST.json')
  const productsListContent = JSON.parse(fs.readFileSync(productsListPath, 'utf-8'))

  const params: { categoria: string; tipo: string; producto: string }[] = []

  for (const categoria of Object.keys(productsListContent)) {
    const tipoDir = path.join(process.cwd(), 'app', 'BBDD', categoria)
    if (!fs.existsSync(tipoDir)) continue

    const tipos = fs.readdirSync(tipoDir).filter((f) => f.endsWith('.json'))
    for (const tipoFile of tipos) {
      const tipoSlug = tipoFile.replace('.json', '')
      const tipoJsonPath = path.join(tipoDir, tipoFile)
      const tipoData = JSON.parse(fs.readFileSync(tipoJsonPath, 'utf-8')) as {
        list_of_items?: Record<string, any>
      }

      if (tipoData.list_of_items) {
        for (const productoKey of Object.keys(tipoData.list_of_items)) {
          // Aquí uso la clave del objeto como “slug”; si tu JSON tiene un campo “route” distinto, adáptalo.
          params.push({
            categoria,
            tipo: tipoSlug,
            producto: productoKey,
          })
        }
      }
    }
  }

  return params
}

export default function ProductoPage({
  params,
}: {
  params: { categoria: string; tipo: string; producto: string }
}) {
  const { categoria, tipo, producto } = params

  // 1) Validamos categoría / tipo / producto
  const productsListPath = path.join(process.cwd(), 'app', 'BBDD', 'PRODUCTS_LIST.json')
  const productsListContent = JSON.parse(fs.readFileSync(productsListPath, 'utf-8'))

  const categoryData = productsListContent[categoria]
  if (!categoryData) return notFound()

  // 2) Leer el JSON del tipo
  const tipoPath = path.join(process.cwd(), 'app', 'BBDD', categoria, `${tipo}.json`)
  if (!fs.existsSync(tipoPath)) return notFound()

  const tipoJson = JSON.parse(fs.readFileSync(tipoPath, 'utf-8')) as {
    list_of_items?: Record<string, any>
  }
  if (!tipoJson.list_of_items || !tipoJson.list_of_items[producto]) return notFound()

  // 3) Obtener detalles del producto
  const detalle: ProductDetail = tipoJson.list_of_items[producto] as ProductDetail

  return (
    <main>
      <div className="flex flex-col items-center bg-gradient-to-b from-gray-800 to-gray-400 py-16">
        {/* Imagen grande */}
        <Image
          src={`/images/${detalle.image}`} // asegúrate de que la imagen exista en public/images
          alt={detalle.name}
          width={600}
          height={600}
          className="rounded-lg"
        />
        <div className="mt-8 bg-white rounded-lg p-6 max-w-4xl w-full shadow-lg">
          <h1 className="text-2xl font-bold mb-4">{detalle.name}</h1>

          {/* Botones / Filtros (si aplica) */}
          {/* ... */}

          {/* Datos técnicos: Información Física */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Información Física</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {Object.entries(detalle.physics).map(([label, value], i) => (
                <div key={i} className="flex justify-between border-b pb-1">
                  <span className="font-medium">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Datos comerciales */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Información Comercial</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {Object.entries(detalle.commercial).map(([label, value], i) => (
                <div key={i} className="flex justify-between border-b pb-1">
                  <span className="font-medium">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Descargas (Datasheet, manuales, etc.) */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Descargas</h2>
            <a
              href={`/datasheets/${detalle.sku}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Datasheet
            </a>
          </section>
        </div>
      </div>
    </main>
  )
}
