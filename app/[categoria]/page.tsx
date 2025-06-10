import React from 'react'
import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { ImageCard } from '../../components'
interface ListOfType {
  name: string
  route: string
  content: string[]
  list_of_items?: Record<string, unknown>
}
interface Category {
  name: string
  route: string
  img: string
  content: string[]                   // este array con cadenas de texto
  list_of_types: Record<string, ListOfType>
}

// El JSON está envuelto en un arreglo con un solo objeto
type ProductsRaw = Record<string, Category>[]

export async function generateStaticParams() {
  const jsonPath = path.join(process.cwd(), 'app', 'BBDD', 'PRODUCTS_LIST.json')
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as ProductsRaw
  const productsData = raw[0]

  return Object.values(productsData).map((catObj) => {
    // Extraer slug de catObj.route ("/led" → "led")
    const slug = catObj.route.replace(/^\//, '').toLowerCase()
    return { categoria: slug }
  })
}

export default async function CategoriaPage({
  params,
}: {
  params: { categoria: string }
}) {
  const { categoria: categoriaParam } = await params  // p.ej. "led"

  // 1) Leer PRODUCTS_LIST.json y desempacar el objeto real
  const jsonPath = path.join(process.cwd(), 'app', 'BBDD', 'PRODUCTS_LIST.json')
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as ProductsRaw
  const productsData = raw[0]

  // 2) Encontrar la categoría cuya route sin "/" sea igual a categoriaParam
  const entry = Object.entries(productsData).find(([key, catObj]) => {
    const slug = catObj.route.replace(/^\//, '').toLowerCase()
    return slug === categoriaParam
  })
  if (!entry) {
    return notFound()
  }

  const [catKey, categoryData] = entry
  // catKey = "LED"; categoryData contiene { name:"Led", route:"/led", img:"bulbos.png", content:[...], list_of_types:{...} }

  // 3) Ahora, en lugar de leer archivos de la carpeta, usamos categoryData.content
  //    `categoryData.content` es un array de strings, p.ej. ["Rollos leds", "Kits RGB Y lámparas", …]
  //    Para cada string, necesitamos la clave en list_of_types: 
  //    Por ejemplo "Rollos leds" corresponde a `categoryData.list_of_types["Rollos"]`, 
  //    porque la clave ("Rollos") es la primera palabra en la que se basó el JSON.

  //    Asumimos que en todos los casos, `typeName.split(" ")[0]` coincide con la clave de list_of_types.
  const tipos = categoryData.content.map((displayName) => {
    // Ejemplo: displayName = "Rollos leds"
    // La clave en list_of_types es la primera palabra antes del espacio: "Rollos"
    const key = displayName.split(' ')[0]
    return {
      slug: key.toLowerCase(),      // p.ej. "rollos"
      displayName,                  // p.ej. "Rollos leds"
      img: categoryData.img,        // la misma imagen de la categoría (opcional)
      // La ruta para ese tipo irá a "/led/rollos", etc.
    }
  })

  return (
    <main className="py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">{categoryData.name}</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
        {tipos.map((tipo, i) => (
          <div key={`${tipo.slug}${i}`} className="flex justify-center">
              <ImageCard
                name={tipo.displayName}             // "Rollos leds"
                imageSrc={`/${tipo.img}`}            // "/bulbos.png"
                acceptLink={`/${categoriaParam}/${tipo.slug}`}
                cancelLink={`/${categoriaParam}/${tipo.slug}`}
                counts={0}
              />
          </div>
        ))}
      </section>
    </main>
  )
}

