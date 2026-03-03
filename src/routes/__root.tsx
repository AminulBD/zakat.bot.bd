import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@/lib/theme'
import { I18nProvider } from '@/lib/i18n'

const RootLayout = () => (
  <ThemeProvider>
    <I18nProvider>
      <Outlet />
    </I18nProvider>
  </ThemeProvider>
)

export const Route = createRootRoute({ component: RootLayout })