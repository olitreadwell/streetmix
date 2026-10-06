import { vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { render } from '~/test/helpers/render.js'
import { StreetName } from './StreetName.js'

describe('StreetName', () => {
  it('renders a name', () => {
    const { asFragment } = render(<StreetName name="foo" />)
    expect(asFragment()).toMatchSnapshot()
    expect(screen.getByText('foo')).toBeInTheDocument()
  })

  it('truncates very long names', () => {
    render(
      <StreetName name="foobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobar" />
    )
    // We don't care what the actual length of string is, just that
    // it's been truncated and ends with ellipses

    expect(screen.getByText(/…$/)).toBeInTheDocument()
  })

  it('renders a placeholder if there is no name', () => {
    render(<StreetName name={null} />)
    expect(screen.getByText('Unnamed St')).toBeInTheDocument()
  })

  it('uses span elements when as="span" (valid inside phrasing content)', () => {
    const { container } = render(<StreetName as="span" name="foo" />)
    expect(container.querySelector('.street-name')?.tagName).toBe('SPAN')
    expect(container.querySelector('.street-name-text')?.tagName).toBe('SPAN')
  })

  it('responds to an onClick handler', async () => {
    const handleClick = vi.fn()
    render(<StreetName name="foo" onClick={handleClick} />)

    await userEvent.click(screen.getByText('foo'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // Editable state is tested at the StreetNameplateContainer component level.
  // However, we do include a test here to ensure that StreetName is never
  // editable by default.
  it('is not editable by default', async () => {
    render(<StreetName name="foo" editable={false} />)

    await userEvent.hover(screen.getByText('foo'))
    expect(screen.queryByText('Click to rename')).not.toBeInTheDocument()
  })
})

describe('StreetName keyboard accessibility', () => {
  it('is presented as a focusable button when it can be edited', () => {
    render(<StreetName name="Test St" editable onClick={() => {}} />)

    const name = screen.getByRole('button', { name: 'Test St' })
    expect(name).toHaveAttribute('tabindex', '0')
  })

  it('is not a button when it cannot be edited', () => {
    const { container } = render(<StreetName name="Test St" />)

    expect(container.querySelector('.street-name')).not.toHaveAttribute(
      'role',
      'button'
    )
    expect(container.querySelector('.street-name')).not.toHaveAttribute(
      'tabindex'
    )
  })

  it('activates rename when the focused name is activated with Enter', () => {
    const onClick = vi.fn()
    render(<StreetName name="Test St" editable onClick={onClick} />)

    fireEvent.keyDown(screen.getByRole('button', { name: 'Test St' }), {
      key: 'Enter',
    })

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('activates rename when the focused name is activated with Space', () => {
    const onClick = vi.fn()
    render(<StreetName name="Test St" editable onClick={onClick} />)

    fireEvent.keyDown(screen.getByRole('button', { name: 'Test St' }), {
      key: ' ',
    })

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not activate rename for other keys', () => {
    const onClick = vi.fn()
    render(<StreetName name="Test St" editable onClick={onClick} />)

    fireEvent.keyDown(screen.getByRole('button', { name: 'Test St' }), {
      key: 'a',
    })

    expect(onClick).not.toHaveBeenCalled()
  })
})
