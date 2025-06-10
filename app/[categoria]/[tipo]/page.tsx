import React from 'react'
import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface ListItem {
  name: string
  route: string
  content: Record<string, unknown> // si tiene más campos técnicos
}
interface ListOfType {
  name: string
  route: string
  content: string[]
  list_of_items?: Record<string, ListItem>
  // Podrías tener más campos específicos “tamaño”, “peso”, etc.
}

interface Category {
  name: string
  img: string
  route: string
  content: string[]
  list_of_types: Record<string, ListOfType>
}

type ProductsData = Record<string, Category>

// Para generar los parámetros estáticos de “Tipo” necesitamos:
// 1. Generar todas las parejas (categoria, tipo) disponibles
export async function generateStaticParams() {
  // a) Leemos el JSON principal para saber las categorías
  const productsListPath = path.join(process.cwd(), 'app', 'BBDD', 'PRODUCTS_LIST.json')
  const productsListContent = JSON.parse(fs.readFileSync(productsListPath, 'utf-8')) as ProductsData

  // b) Para cada categoría, listamos los archivos en app/BBDD/[categoria]
  const paramsArray: { categoria: string; tipo: string }[] = []

  for (const categoria of Object.keys(productsListContent)) {
    const categoryDir = path.join(process.cwd(), 'app', 'BBDD', categoria)
    if (fs.existsSync(categoryDir)) {
      const fileNames = fs.readdirSync(categoryDir).filter((f) => f.endsWith('.json'))
      fileNames.forEach((file) => {
        const tipo = file.replace('.json', '')
        paramsArray.push({ categoria, tipo })
      })
    }
  }

  return paramsArray
}

export default function TipoPage({ params }: { params: { categoria: string; tipo: string } }) {
  const { categoria, tipo } = params

  // 1. Verificar que la categoría exista
  const productsListPath = path.join(process.cwd(), 'app', 'BBDD', 'PRODUCTS_LIST.json')
  const productsListContent = JSON.parse(fs.readFileSync(productsListPath, 'utf-8')) as ProductsData

  const categoryData = productsListContent[categoria]
  if (!categoryData) {
    return notFound()
  }

  // 2. Verificar que el archivo JSON de “tipo” exista dentro de app/BBDD/[categoria]
  const tipoPath = path.join(process.cwd(), 'app', 'BBDD', categoria, `${tipo}.json`)
  if (!fs.existsSync(tipoPath)) {
    return notFound()
  }

  // 3. Leer el JSON de “tipo” (que contiene la info técnica de todos los productos)
  const tipoData = JSON.parse(fs.readFileSync(tipoPath, 'utf-8')) as ListOfType

  // 4. Extraer los productos que haya dentro de ese JSON
  //    - Dependiendo de tu estructura, puede estar en tipoData.list_of_items
  //    - O quizás en tipoData.content (array de strings). Ajusta según el JSON real.
  const productosArreglo: ListItem[] = []
  if (tipoData.list_of_items) {
    // Ejemplo: list_of_items es un objeto cuyas llaves son skus y valores son detalles
    for (const key of Object.keys(tipoData.list_of_items)) {
      productosArreglo.push(tipoData.list_of_items[key])
    }
  }

  return (
    <main className="py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">{tipoData.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
        {productosArreglo.map((prod, index) => {
          // Si tu ListItem tiene nombre e incluso una imagen, muéstralos. 
          // Aquí asumo que “prod.route” es un slug para cada producto
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              {/* -------------- Imaginemos que cada producto tiene una imagen en `public/images/[prod.route].png` */}
              <Image
                src={`/images/${prod.route}.png`}
                alt={prod.name}
                width={300}
                height={300}
                className="object-cover rounded"
              />
              <h2 className="text-xl font-semibold mt-4">{prod.name}</h2>
              {/* Si tienes más campos (por ej. “descr”, “precio”, etc.), muéstralos */}
              {/* <p className="mt-2 text-gray-600">{prod.description}</p> */}
              <Link href={`/${categoria}/${tipo}/${prod.route}`}>
                <a className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Ver detalles
                </a>
              </Link>
            </div>
          )
        })}
      </div>
    </main>
  )
}
