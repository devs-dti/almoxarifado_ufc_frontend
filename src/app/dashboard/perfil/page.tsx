import React from 'react'
import { User } from 'lucide-react'

export default function PerfilPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Meu Perfil</h2>
      </div>

      <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-100 rounded-xl shadow-sm text-center">
        <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center mb-6">
          <User className="text-brand" size={40} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Em desenvolvimento</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          A página de perfil do usuário está sendo construída. Em breve você poderá editar seus dados pessoais, senha e preferências de sistema aqui.
        </p>
      </div>
    </div>
  )
}
