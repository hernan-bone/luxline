import Link from 'next/link'
import { FC } from 'react'

type ImageCardProps = {
  imageSrc: string
  acceptLink: string
  cancelLink: string
  alt?: string
  name: string
  counts: any
}

const ImageCard: FC<ImageCardProps> = ({
  imageSrc,
  acceptLink,
  cancelLink,
  alt = 'Imagen',
  name,
  counts
}) => {
  return (
    <div className="relative flex justify-center group shadow-lg hover:shadow-xl/30 w-72 h-72 overflow-hidden rounded-lg ">
      {/* Overlay de fondo */}
      <div className={`
        absolute inset-0
        group-hover:bg-gradient-to-br from-yellow-300/40 from-10% via-black via-14% to-black/90 to-100%
        transition-opacity duration-300
        group-hover:opacity-95
      `} />

      {/* Imagen con link */}
      <div className="flex flex-col items-center justify w-4/5 h-4/5 absolute">
        <div className='w-full flex items-center justify-center'>
          <img
            src={imageSrc}
            alt={alt}
            className={`
              w-10/12 h-10/12 object-cover
              rounded-lg
              opacity-90
              transition-transform duration-300
              group-hover:scale-95
            `}
          />
        </div>
        <p><span className='text-black font-normal group-hover:text-white duration-300 group-hover:font-bold'>{name}</span></p>
        {/* Contador de productos debajo del nombre */}
        <p className="text-xs font-light text-gray-600 group-hover:text-white duration-300">
          {counts} {counts === 1 ? 'Producto' : 'Productos'}
        </p>
      </div>

      {/* Botones */}
      <div className={`
        absolute inset-2
        flex items-end justify-center space-x-4
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
      `}>
        <Link href={acceptLink.toLowerCase()} className='px-4 py-2 text-xs text-white bg-transparent
            border-2 border-white rounded-md
            transition-colors duration-300
            hover:bg-white hover:text-black'>
          Ficha técnica
        </Link>
        <Link href={cancelLink.toLowerCase()}  className='px-4 py-2 text-xs text-white bg-transparent
            border-2 border-white rounded-md
            transition-colors duration-300
            hover:bg-white hover:text-black'>
          Ver producto
        </Link>
      </div>
    </div>
  )
}

export default ImageCard
