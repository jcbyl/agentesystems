import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/medical')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/medical"!</div>
}
