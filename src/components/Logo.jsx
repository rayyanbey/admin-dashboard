import Image from 'next/image'

export default function Logo() {
  return (
    <div className="w-30 h-30 relative">
      <Image
        src="/logo.png"
        alt="Company Logo"
        objectFit="contain"
        width={200}
        height={200}
      />
    </div>
  )
}

