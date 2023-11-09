'use client'

import Button from '@/app/components/Button'
import Input from '@/app/components/inputs/Input'
import { useState, useCallback } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import AuthSocialButton from './AuthSocialButton'
import { BsGithub, BsGoogle } from 'react-icons/bs'
type Variant = 'LOGIN' | 'REGISTER'

const AuthForm = () => {
  const [variant, setVariant] = useState('REGISTER')
  const [isLoading, setIsLoading] = useState(false)

  // function：切换登录状态
  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER')
    } else {
      setVariant('LOGIN')
    }
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    if (variant === 'REGISTER') {
      // Axios Register
    }
    if (variant === 'LOGIN') {
      // NextAuth SignIn
    }
  }

  const socialAction = (actions: string) => {
    setIsLoading(true)
    // NextAuth Social Sign In
  }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        {/* 登录表单 */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              label="Name"
              register={register}
              id="name"
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            label="Email address"
            register={register}
            id="email"
            type="email"
            errors={errors}
          />
          <Input
            label="Password"
            register={register}
            id="password"
            type="password"
            errors={errors}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>
        {/* 表单下面 */}
        <div className="mt-6">
          <div className="relative">
            {/* 分割线 */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            {/*  */}
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 ">or continue with</span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>
        <div
          className="
            flex
            gap-2
            justify-center
            text-sm
            mt-6
            px-2
            text-gray-500
        ">
          <div>
            {variant === 'LOGIN'
              ? 'New to Messenger?'
              : 'Already have an account?'}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AuthForm
