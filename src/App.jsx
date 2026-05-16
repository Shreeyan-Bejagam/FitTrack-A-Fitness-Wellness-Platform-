import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RouteProgress } from '@/components/RouteProgress'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ToastProvider } from '@/components/ToastProvider'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { AuthPage } from '@/features/auth/AuthPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { CommunityPage } from '@/features/dashboard/CommunityPage'
import { DashboardLayout } from '@/features/dashboard/DashboardLayout'
import { DashboardOverview } from '@/features/dashboard/DashboardOverview'
import { NutritionPage } from '@/features/dashboard/NutritionPage'
import { ProgressPage } from '@/features/dashboard/ProgressPage'
import { SettingsPage } from '@/features/dashboard/SettingsPage'
import { WorkoutsPage } from '@/features/dashboard/WorkoutsPage'
import { LandingPage } from '@/features/landing/LandingPage'
import { NotFound } from '@/pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <div className="app-mesh">
          <RouteProgress />
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary>
                  <LandingPage />
                </ErrorBoundary>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={
                  <ErrorBoundary>
                    <DashboardLayout />
                  </ErrorBoundary>
                }
              >
                <Route index element={<DashboardOverview />} />
                <Route path="workouts" element={<WorkoutsPage />} />
                <Route path="nutrition" element={<NutritionPage />} />
                <Route path="progress" element={<ProgressPage />} />
                <Route path="community" element={<CommunityPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
