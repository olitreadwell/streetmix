import { render } from '~/test/helpers/render.js'
import { Dialog } from './Dialog.js'

const Contents = () => <>foo</>

const HeadingContents = () => (
  <div>
    <h1>My dialog title</h1>
  </div>
)

describe('Dialog', () => {
  it('renders', () => {
    const { getByRole } = render(<Dialog>{() => <Contents />}</Dialog>)

    expect(getByRole('dialog')).toBeInTheDocument()
  })

  it('renders as a modal dialog', () => {
    const { getByRole } = render(<Dialog>{() => <Contents />}</Dialog>)

    expect(getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('uses the first heading in the dialog as its accessible name', () => {
    const { getByRole } = render(<Dialog>{() => <HeadingContents />}</Dialog>)

    expect(getByRole('dialog')).toHaveAccessibleName('My dialog title')
  })

  // These can't be tested right now because it CSSTransition is mocked
  // and does not actually call onExited when animating out. We might
  // not be able to test this until clearDialogs() is not tied to dialog
  // animation
  it.todo('closes the dialog when the backdrop is clicked')
  it.todo('closes the dialog box when "escape" is pressed')
  it.todo('closes the dialog box when the "x" button is pressed')
})
