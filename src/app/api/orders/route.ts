import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { customerName, customerEmail, customerPhone, deliveryAddress, deliveryDate, notes, items, totalAmount } = await request.json()

    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        deliveryDate: new Date(deliveryDate),
        notes,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            vegetableId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            vegetable: true
          }
        }
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Erreur création commande:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
