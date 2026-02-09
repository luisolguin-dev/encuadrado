'use server'

import { db } from '../lib/db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string


  const user = await db.user.findUnique({
    where: { email }
  })


  if (!user || user.password !== password) {
    console.error("Login fallido")
    redirect('/') 
  }

  const cookieStore = await cookies()
  
  cookieStore.set('userId', user.id, { httpOnly: true, path: '/' })
  cookieStore.set('userRole', user.role, { httpOnly: true, path: '/' })
  
  if (user.role === 'SOLICITOR') {
    redirect('/solicitor')
  } else {
    redirect('/provider')
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('userId')
  cookieStore.delete('userRole')
  redirect('/')
}