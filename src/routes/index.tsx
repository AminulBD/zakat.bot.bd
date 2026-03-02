import { createFileRoute } from '@tanstack/react-router'
import { ComponentExample } from "@/components/component-example";

export const Route = createFileRoute('/')({
  component: ComponentExample,
})
