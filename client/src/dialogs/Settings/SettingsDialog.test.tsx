import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { render } from '~/test/helpers/render.js'
import { SettingsDialog } from './SettingsDialog.js'

describe('SettingsDialog', () => {
  it('renders each settings category as a button', () => {
    render(<SettingsDialog category="profile" />)
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'General' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Language' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Feature flags' })
    ).toBeInTheDocument()
  })

  it('marks the active category and switches panels when clicked', async () => {
    const user = userEvent.setup()
    render(<SettingsDialog category="profile" />)

    expect(screen.getByRole('button', { name: 'Profile' })).toHaveAttribute(
      'aria-current',
      'true'
    )

    await user.click(screen.getByRole('button', { name: 'Language' }))

    expect(screen.getByRole('button', { name: 'Language' })).toHaveAttribute(
      'aria-current',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Profile' })).not.toHaveAttribute(
      'aria-current'
    )
    expect(
      screen.getByRole('heading', { name: 'Language' })
    ).toBeInTheDocument()
  })

  it('switches the visible panel when a category is activated by keyboard', async () => {
    const user = userEvent.setup()
    render(<SettingsDialog category="profile" />)

    const general = screen.getByRole('button', { name: 'General' })
    general.focus()
    expect(general).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('button', { name: 'General' })).toHaveAttribute(
      'aria-current',
      'true'
    )
    expect(screen.getByRole('heading', { name: 'General' })).toBeInTheDocument()
  })
})
