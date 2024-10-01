"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import vai from './actions'
import { Loader } from 'lucide-react'

const ButtonGenerateLink = () => {
  const [data, setData] = useState<(string | null)[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const chama = async () => {
    setData([])
    setIsSearching(true)
    const res = await vai()
    if (res) {
      setData(res)
    }
    setIsSearching(false)
  }

  const copyContent = () => {
    const content = document.querySelector('.conteudo-total')?.textContent;
    if (content) {
      navigator.clipboard.writeText(content).then(() => {
        alert('Conteúdo copiado!');
      }).catch(err => {
        console.error('Erro ao copiar: ', err);
      });
    }
  }

  return (
    <div className='flex flex-col gap-5'>
      {data.length > 0 && (
        <div className="copiar opacity-50 hover:opacity-100" onClick={copyContent}>
          <div className='flex flex-col conteudo-total'>
            {data.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
            <span>Click aqui para copiar</span>
          </div>
        </div>
      )}

      <Button onClick={chama}>
        {data.length > 0 ?
          <span className='flex gap-2'>
            Gerar Outra Lista
            {isSearching &&
              <Loader className='animate-spin' />
            }
          </span>
          :
          <span className='flex gap-2'>
            Gerar lista
            {isSearching &&
              <Loader className='animate-spin' />
            }
          </span>
        }
      </Button>
    </div>
  )
}

export default ButtonGenerateLink