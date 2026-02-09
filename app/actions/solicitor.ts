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

  await db.order.create({
    data: {
      type,
      comment,
      solicitorId: userId,
      status: 'CREATED'
    }
  })

  revalidatePath('/solicitor')
}

export async function repeatOrder(formData: FormData) {
  const userId = await getUserId()
  const orderId = formData.get('orderId') as string


  const oldOrder = await db.order.findUnique({
    where: { id: orderId }
  })

  if (!oldOrder) return 

  await db.order.create({
    data: {
      type: oldOrder.type,
      comment: oldOrder.comment,
      solicitorId: userId,
      status: 'CREATED'
    }
  })

  revalidatePath('/solicitor')
}