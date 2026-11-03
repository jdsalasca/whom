import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export function SearchBox({
  initial = '',
  size = 'compact',
  onSearch,
}: {
  initial?: string
  size?: 'hero' | 'compact'
  onSearch?: () => void
}) {
  const [value, setValue] = useState(initial)
  const navigate = useNavigate()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = value.trim()
    if (!query) return
    navigate(`/buscar?q=${encodeURIComponent(query)}`)
    onSearch?.()
  }

  return (
    <form className={`search search--${size}`} onSubmit={submit} role="search">
      <label className="search__label" htmlFor={`search-${size}`}>
        Consulta de propiedad
      </label>
      <div className="search__row">
        <input
          id={`search-${size}`}
          className="search__input"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Medio, marca o apellido…"
          autoComplete="off"
        />
        <button className="btn btn--red search__button" type="submit">
          Consultar
        </button>
      </div>
    </form>
  )
}
