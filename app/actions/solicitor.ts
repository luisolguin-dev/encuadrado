'use server'

import { db } from '../lib/db'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function getUserId() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) redirect('/')
  return userId
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('userId')
  cookieStore.delete('userRole')
  redirect('/')
}

export async function createOrder(formData: FormData) {
  const userId = await getUserId()
  const type = formData.get('type') as string
  const comment = formData.get('comment') as string
  const address = formData.get('address') as string
  const recipientName = formData.get('recipientName') as string
  const price = type === 'CAFE' ? 2500 : 2000
  const eta = Math.floor(Math.random() * (45 - 15 + 1) + 15)

await db.order.create({
    data: {
      type,
      comment,
      address,
      recipientName,
      price,
      eta,
      solicitorId: userId,
      status: 'CREATED'
    }
  })
  revalidatePath('/solicitor')
}

export async function cancelOrder(formData: FormData) {
  const userId = await getUserId()
  const orderId = formData.get('orderId') as string

  const order = await db.order.findUnique({ where: { id: orderId } })

  if (order && order.solicitorId === userId && order.status === 'CREATED') {
    await db.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    })
    revalidatePath('/solicitor')
  }
}

export async function repeatOrder(formData: FormData) {
  const userId = await getUserId()
  const orderId = formData.get('orderId') as string

  const oldOrder = await db.order.findUnique({ where: { id: orderId } })
  if (!oldOrder) return

  const newEta = Math.floor(Math.random() * (45 - 15 + 1) + 15)

  await db.order.create({
    data: {
      type: oldOrder.type,
      comment: oldOrder.comment,
      address: oldOrder.address, 
      recipientName: oldOrder.recipientName,
      price: oldOrder.price,    
      eta: newEta,               
      solicitorId: userId,
      status: 'CREATED'
    }
  })

  revalidatePath('/solicitor')
}