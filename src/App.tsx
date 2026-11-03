import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { EntityPage } from './pages/EntityPage'
import { Home } from './pages/Home'
import { MapPage } from './pages/MapPage'
import { Method } from './pages/Method'
import { NotFound } from './pages/NotFound'
import { Registry } from './pages/Registry'
import { SearchPage } from './pages/SearchPage'
import { TreePage } from './pages/TreePage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="buscar" element={<SearchPage />} />
          <Route path="expediente/:id" element={<EntityPage />} />
          <Route path="registro" element={<Registry />} />
          <Route path="arbol" element={<TreePage />} />
          <Route path="mapa" element={<MapPage />} />
          <Route path="metodo" element={<Method />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
