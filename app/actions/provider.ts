'use server'

import { db } from '../lib/db' 
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


async function getProviderId() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  const role = cookieStore.get('userRole')?.value

  if (!userId || role !== 'PROVIDER') {
    redirect('/')
  }
  return userId
}


export async function claimOrder(formData: FormData) {
  const providerId = await getProviderId()
  const orderId = formData.get('orderId') as string

  await db.order.update({
    where: { id: orderId },
    data: {
      providerId: providerId,
      status: 'ASSIGNED'
    }
  })

  revalidatePath('/provider')
}


export async function updateStatus(formData: FormData) {
  await getProviderId() 
  const orderId = formData.get('orderId') as string
  const newStatus = formData.get('status') as string

  await db.order.update({
    where: { id: orderId },
    data: { status: newStatus }
  })

  revalidatePath('/provider')
}