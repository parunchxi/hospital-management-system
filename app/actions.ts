'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const signUpAction = async (formData: FormData) => {
  const first_name = formData.get('first_name')?.toString()
  const last_name = formData.get('last_name')?.toString()
  const date_of_birth = formData.get('date_of_birth')?.toString()
  const gender = formData.get('gender')?.toString()
  const national_id = formData.get('national_id')
  const address = formData.get('address')?.toString()
  const phone_number = formData.get('phone_number')
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const confirm_password = formData.get('confirm_password')?.toString()

  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  if (
    !first_name ||
    !last_name ||
    !date_of_birth ||
    !gender ||
    !national_id ||
    !address ||
    !phone_number ||
    !email ||
    !password ||
    !confirm_password
  ) {
    return encodedRedirect('error', '/sign-up', 'All fields are required')
  }

  if (password !== confirm_password) {
    return encodedRedirect('error', '/sign-up', 'Passwords do not match')
  }

  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (signupError) {
    console.error(signupError.code + ' ' + signupError.message)
    return encodedRedirect('error', '/sign-up', signupError.message)
  }

  const User = signupData.user

  if (!User) {
    console.error('Signup succeeded but user object is null')
    return encodedRedirect('error', '/sign-up', 'Signup failed unexpectedly.')
  }

  const { error: insertError } = await supabase.from('users').insert({
    user_id: User.id,
    national_id,
    first_name,
    last_name,
    date_of_birth,
    gender,
    address,
    phone_number,
  })

  if (insertError) {
    console.error(insertError.code + ' ' + insertError.message)
    return encodedRedirect(
      'error',
      '/sign-up',
      'User signup succeeded but saving profile failed.',
    )
  }

  return encodedRedirect(
    'success',
    '/sign-up',
    'Thanks for signing up! Please check your email for a verification link.',
  )
}

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return encodedRedirect('error', '/sign-in', error.message)
  }

  return redirect('/protected')
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const supabase = await createClient()
  const origin = (await headers()).get('origin')
  const callbackUrl = formData.get('callbackUrl')?.toString()

  if (!email) {
    return encodedRedirect('error', '/forgot-password', 'Email is required')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  })

  if (error) {
    console.error(error.message)
    return encodedRedirect(
      'error',
      '/forgot-password',
      'Could not reset password',
    )
  }

  if (callbackUrl) {
    return redirect(callbackUrl)
  }

  return encodedRedirect(
    'success',
    '/forgot-password',
    'Check your email for a link to reset your password.',
  )
}

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    return encodedRedirect(
      'error',
      '/protected/reset-password',
      'Password and confirm password are required',
    )
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      'error',
      '/protected/reset-password',
      'Passwords do not match',
    )
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return encodedRedirect(
      'error',
      '/protected/reset-password',
      'Password update failed',
    )
  }

  return encodedRedirect(
    'success',
    '/protected/reset-password',
    'Password updated',
  )
}

export const signOutAction = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/sign-in')
}
