'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { censorText } from '@/lib/filter'

export async function createPost(formData: FormData) {
  const headline = (formData.get('headline') as string)?.trim()
  const body = (formData.get('body') as string)?.trim()
  const category = formData.get('category') as string
  const location = (formData.get('location') as string) || null
  const media_url = (formData.get('media_url') as string) || null
  const media_type = (formData.get('media_type') as string) || null

  if (!headline || !body || !category) return { error: 'Missing fields' }

  // Censor profanity in editor posts too
  const cleanHeadline = censorText(headline)
  const cleanBody = censorText(body)

  const { error } = await supabaseAdmin.from('tips').insert({
    headline: cleanHeadline,
    body: cleanBody,
    category,
    location,
    media_url,
    media_type,
    status: 'approved',
    posted_by: 'NAFIZIC',
  } as any)

  if (error) return { error: error.message }

  revalidatePath('/editor/dashboard')
  revalidatePath('/')
  return { success: true }
}

export async function approveTip(formData: FormData) {
  const id = formData.get('id') as string
  await supabaseAdmin.from('tips').update({ status: 'approved' }).eq('id', id)
  revalidatePath('/editor/dashboard')
  revalidatePath('/')
}

export async function rejectTip(formData: FormData) {
  const id = formData.get('id') as string
  await supabaseAdmin.from('tips').update({ status: 'rejected' }).eq('id', id)
  revalidatePath('/editor/dashboard')
}

export async function deleteTip(formData: FormData) {
  const id = formData.get('id') as string
  await supabaseAdmin.from('tips').delete().eq('id', id)
  revalidatePath('/editor/dashboard')
  revalidatePath('/')
}
