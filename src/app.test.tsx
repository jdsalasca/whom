import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Home } from './pages/Home'
import { EntityPage } from './pages/EntityPage'
import { SearchPage } from './pages/SearchPage'
import { Registry } from './pages/Registry'
import { SearchBox } from './components/SearchBox'
import { OwnershipTree } from './components/OwnershipTree'
import { getTree } from './data/queries'

function Location() {
  const location = useLocation()
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>
}

function renderHome() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('pantallas', () => {
  it('la portada muestra la pregunta y el buscador', () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/de quién/i)
    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getByText('Los dueños, en una pared')).toBeInTheDocument()
  })

  it('el buscador navega a la consulta', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <SearchBox />
        <Routes>
          <Route path="/buscar" element={<Location />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByRole('searchbox'), 'El Corral')
    await user.click(screen.getByRole('button', { name: /consultar/i }))
    expect(screen.getByTestId('location')).toHaveTextContent('/buscar?q=El%20Corral')
  })

  it('la ficha de El Corral muestra la cadena hasta Gilinski', () => {
    render(
      <MemoryRouter initialEntries={['/expediente/el-corral']}>
        <Routes>
          <Route path="/expediente/:id" element={<EntityPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'El Corral' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: /cadena de propiedad/i })).toBeInTheDocument()
    expect(screen.getAllByText('Grupo Nutresa').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Familia Gilinski').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /descargar pdf/i })).toBeInTheDocument()
  })

  it('el árbol permite contraer y expandir ramas', async () => {
    const user = userEvent.setup()
    const tree = getTree('el-corral')
    render(
      <MemoryRouter>
        <OwnershipTree tree={tree!} focusId="el-corral" />
      </MemoryRouter>,
    )

    expect(screen.getByText('Familia Gilinski')).toBeInTheDocument()
    expect(screen.getByText('El Corral')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^contraer$/i }))
    expect(screen.queryByText('El Corral')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /expandir todo/i }))
    expect(screen.getByText('El Corral')).toBeInTheDocument()
  })

  it('la búsqueda de caracol separa los dos dueños', () => {
    render(
      <MemoryRouter initialEntries={['/buscar?q=caracol']}>
        <Routes>
          <Route path="/buscar" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Caracol Televisión')).toBeInTheDocument()
    expect(screen.getByText('Caracol Radio')).toBeInTheDocument()
    expect(screen.getByText(/expedientes para/i)).toHaveTextContent(/caracol/i)
  })

  it('el registro lista relaciones y permite filtrar', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Registry />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1, name: /libro de propiedad/i })).toBeInTheDocument()
    expect(screen.getAllByText('El Corral').length).toBeGreaterThan(0)

    await user.type(screen.getByPlaceholderText(/propietario o propiedad/i), 'semana')
    expect(screen.getByText('Semana')).toBeInTheDocument()
    expect(screen.queryByText('Postobón')).not.toBeInTheDocument()
  })
})
