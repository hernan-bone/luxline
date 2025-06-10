// import React from 'react'
// import productsData from '../app/BBDD/PRODUCTS_LIST.json'
// import { ImageCard as Card } from '../components'
// import Link from 'next/link'

// // Revalidate cada 24 horas (ISR)
// export const revalidate = 86400

// // Tipos según PRODUCTS_LIST.json
// interface ListItem {
//   name: string
//   route: string
// }
// interface ListOfType {
//   name: string
//   route: string
//   content: string[]
//   list_of_items?: Record<string, ListItem>
// }
// interface Category {
//   name: string
//   route: string
//   content: string[]
//   list_of_types: Record<string, ListOfType>
//   img: string
// }

// type ProductsData = Record<string, Category>[]

// export default function Page() {
//   // productsData es importado desde el JSON local en build time
//   const dataArray = (productsData as unknown) as ProductsData
//   const categoriesMap = dataArray[0]
//   const categories = Object.values(categoriesMap)

//   return (
//     <>
//       <main className="flex flex-col items-center justify-center pb-20 pt-[7.4rem] min-h-screen">
//         <h1 className="text-3xl font-bold text-center mb-10">Nuestras Categorías</h1>
//         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
//           {categories.map((cat, i) => {
//             const count = Array.isArray(cat.content) ? cat.content.length : 0
//             // Extraer slug de cat.route:
//             const slug = cat.route.replace(/^\//, '').toLowerCase() // "/led" → "led"

//             return (
//               <div key={i} className="flex justify-center mt-56">
//                 <Card
//                   name={cat.name}
//                   imageSrc={`/${cat.img}`}    // p.ej. "/bulbos.png"
//                   acceptLink={`/${slug}`}
//                   cancelLink={`/${slug}`}
//                   counts={count}
//                 />
//               </div>
//             )
//           })}
//         </section>
//       </main>
//     </>
//   )
// }

import React from 'react';

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Página en construcción</h1>
        <p className="text-xl text-gray-600">Estamos trabajando en esto. ¡Vuelve pronto!</p>
      </div>
    </div>
  );
}