export interface AlertProps {
  title: string
  message: string
  variant: 'success' | 'warning' | 'danger'
  handleClose?: () => void
}
