const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const solicitor = await prisma.user.upsert({
    where: { email: 'solicitor123@dummymail.com' },
    update: {},
    create: {
      email: 'solicitor123@dummymail.com',
      password: 'quierounmatchalatte',
      role: 'SOLICITOR',
      name: 'Cliente Feliz'
    },
  })

  const provider = await prisma.user.upsert({
    where: { email: 'proveedor456@dummymail.com' },
    update: {},
    create: {
      email: 'proveedor456@dummymail.com',
      password: 'rayomcqueen',
      role: 'PROVIDER',
      name: 'El Repartidor Veloz'
    },
  })

  console.log({ solicitor, provider })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })