'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'

export default function CheckoutPage() {
  const { cart, getTotalPrice } = useCart()
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Votre panier est vide!</p>
        <a href="/" className="text-green-600">← Retour aux achats</a>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finaliser ma commande</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulaire de commande */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Informations de livraison</h2>
          <form className="space-y-4">
            <input 
              type="text" 
              placeholder="Nom complet" 
              className="w-full p-3 border rounded-lg"
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full p-3 border rounded-lg"
            />
            <input 
              type="tel" 
              placeholder="Téléphone" 
              className="w-full p-3 border rounded-lg"
            />
            <textarea 
              placeholder="Adresse de livraison" 
              className="w-full p-3 border rounded-lg h-24"
            />
            <input 
              type="date" 
              className="w-full p-3 border rounded-lg"
            />
            
            <button 
              type="submit" 
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Confirmer ma commande - {getTotalPrice().toFixed(2)}€
            </button>
          </form>
        </div>

        {/* Récapitulatif */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} x{item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)}€</span>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{getTotalPrice().toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
