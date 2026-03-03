import { createFileRoute } from '@tanstack/react-router'
import { ZakatCalculator } from '@/components/zakat/zakat-calculator'

export const Route = createFileRoute('/')({
  component: ZakatCalculator,
})