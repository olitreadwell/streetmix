/**
 * Dialog
 *
 * These things are actually modals, since they block the main window.
 * They're positioned over everything else in the app and will prevent
 * interaction with the rest of the app until it's closed.
 *
 * Clicking on the modal's backdrop will automatically close the modal.
 * We used to have dialogs that prevented this form of closing, but
 * they're not used anymore, so this functionality has been removed.
 * Modals that behave differently from each other is probably not a
 * great idea.
 *
 * Only one modal window is shown at a time. Nested modals aren't supported.
 */
import { useState, useEffect, useRef, useId } from 'react'
import { useDispatch } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

import { CloseButton } from '../ui/CloseButton.js'
import { useOnClickOutside } from '../ui/useOnClickOutside.js'
import { clearDialogs } from '../store/slices/dialogs.js'
import { registerKeypress, deregisterKeypress } from '../app/keypress.js'
import './Dialog.css'

type CloseFunction = () => void
interface DialogProps {
  children: (arg: CloseFunction) => React.ReactElement
}

export function Dialog({ children }: DialogProps) {
  // Appear state controls transition in/out
  const dialogEl = useRef<HTMLDivElement>(null)
  const nodeRef = useRef(null)
  const [appear, setAppear] = useState(true)
  const dispatch = useDispatch()
  const titleId = useId()
  const [dialogNamed, setDialogNamed] = useState(false)

  // Give the dialog an accessible name so assistive technology announces
  // which dialog is open. It links aria-labelledby to the first heading
  // found inside the dialog box, so individual dialogs don't each need to
  // supply their own id. Dialogs without a heading keep their previous,
  // unnamed behaviour.
  useEffect(() => {
    const heading = dialogEl.current?.querySelector<HTMLElement>(
      'h1, h2, h3, h4, h5, h6'
    )
    if (!heading) return

    if (!heading.id) {
      heading.id = titleId
    }
    setDialogNamed(true)
  }, [titleId])

  // Set up handler to close dialogs when clicking outside of it
  useOnClickOutside(dialogEl, handleClose)

  // Set up keypress listener to close dialogs if open
  useEffect(() => {
    registerKeypress('esc', handleClose)

    return () => {
      deregisterKeypress('esc', handleClose)
    }
  }, [])

  // On "close", we animate the dialog out
  function handleClose(): void {
    setAppear(false)
  }

  // When the animation is complete, then we clear dialog state
  function handleExit(): void {
    dispatch(clearDialogs())
  }

  return (
    <CSSTransition
      appear
      in={appear}
      timeout={80}
      classNames="dialog-transition"
      onExited={handleExit}
      nodeRef={nodeRef}
    >
      <div className="dialog-box-container" ref={nodeRef}>
        <div className="dialog-box-backdrop" />
        <div className="dialog-box-display-area">
          <div
            className="dialog-box"
            role="dialog"
            aria-modal={true}
            aria-labelledby={dialogNamed ? titleId : undefined}
            ref={dialogEl}
          >
            <CloseButton onClick={handleClose} />
            {children(handleClose)}
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}
