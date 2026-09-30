import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { render } from '~/test/helpers/render.js'
import { GeoSearch } from './GeoSearch.js'

const baseProps = {
  handleSearchResults: () => {},
  focus: { lat: 0, lng: 0 },
}

describe('GeoSearch', () => {
  it('focuses the input after mounting', () => {
    render(<GeoSearch {...baseProps} />)
    const input = screen.getByPlaceholderText('Search for a location')
    expect(document.activeElement).toEqual(input)
  })

  it('displays a "clear search" button when there is input', async () => {
    const user = userEvent.setup()

    render(<GeoSearch {...baseProps} />)
    const input = screen.getByPlaceholderText('Search for a location')

    // The clear button should not render when the input is empty
    expect(
      screen.queryByRole('button', { name: 'Clear search' })
    ).not.toBeInTheDocument()

    // Simulates input, which should also trigger events
    await user.type(input, 'f')

    // The clear button should appear after one keystroke
    expect(
      screen.getByRole('button', { name: 'Clear search' })
    ).toBeInTheDocument()

    // Deletes input
    await user.clear(input)

    // The clear button should now disappear
    expect(
      screen.queryByRole('button', { name: 'Clear search' })
    ).not.toBeInTheDocument()
  })

  it('clears and focuses input when "clear search" button is clicked', async () => {
    const user = userEvent.setup()

    render(<GeoSearch {...baseProps} />)

    // Simulates input
    const input = screen.getByPlaceholderText(
      'Search for a location'
    ) as HTMLInputElement
    await user.type(input, 'foo')

    // Simulates click on "clear search"
    await user.click(screen.getByRole('button', { name: 'Clear search' }))

    // The clear button should be undefined now
    expect(
      screen.queryByRole('button', { name: 'Clear search' })
    ).not.toBeInTheDocument()

    // The input should be empty and it should be focused
    expect(input.value).toEqual('')
    expect(input).toEqual(document.activeElement)
  })

  it('clears the search when the "clear search" button is activated with the keyboard', async () => {
    const user = userEvent.setup()

    render(<GeoSearch {...baseProps} />)

    const input = screen.getByPlaceholderText(
      'Search for a location'
    ) as HTMLInputElement
    await user.type(input, 'foo')

    // The clear search control must be a real, focusable button so that it
    // can be reached and activated without a pointer.
    const clearButton = screen.getByRole('button', { name: 'Clear search' })
    clearButton.focus()
    expect(document.activeElement).toEqual(clearButton)

    await user.keyboard('{Enter}')

    expect(input.value).toEqual('')
    expect(
      screen.queryByRole('button', { name: 'Clear search' })
    ).not.toBeInTheDocument()
  })
})
