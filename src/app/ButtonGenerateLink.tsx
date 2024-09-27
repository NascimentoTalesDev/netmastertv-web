"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import vai from './actions'

const ButtonGenerateLink = () => {
  const chama = async() => {
    await vai()
  }
  return (
    <Button onClick={chama}> Gerar Lista</Button>

  )
}

export default ButtonGenerateLink