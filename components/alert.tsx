import { Button } from '@/components/ui/button'
import CloseIcon from '@/assets/svg/close-icon'
import CircleAlertIcon from '@/assets/svg/circle-alert-icon'
import CircleCheckIcon from '@/assets/svg/circle-check-icon'
import TriangleAlertIcon from '@/assets/svg/triangle-alert-icon'
import { AlertProps } from '@/interfaces/alert'

const variantClassMapper = {
  success: {
    container:
      'border-green-200 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/20',
    iconClasses:
      'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300',
    button:
      'text-green-900 hover:bg-green-200 dark:text-green-100 dark:hover:bg-green-800',
    title: 'text-green-900 dark:text-green-100',
    message: 'text-green-700 dark:text-green-300'
  },
  danger: {
    container:
      'border-red-200 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/20',
    iconClasses: 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300',
    title: 'text-red-900 dark:text-red-100',
    button:
      'text-red-900 hover:bg-red-200 dark:text-red-100 dark:hover:bg-red-800',
    message: 'text-red-700 dark:text-red-300'
  },
  warning: {
    container:
      'border-orange-200 bg-orange-50 p-4 dark:border-orange-700 dark:bg-orange-900/20',
    iconClasses:
      'bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-300',
    title: 'text-orange-900 dark:text-orange-100',
    button:
      'text-orange-900 hover:bg-orange-200 dark:text-orange-100 dark:hover:bg-orange-800',
    message: 'text-orange-700 dark:text-orange-300'
  }
}

const iconsMapper = {
  success: () => <CircleCheckIcon className="h-6 w-6" />,
  danger: () => <TriangleAlertIcon className="h-6 w-6" />,
  warning: () => <CircleAlertIcon className="h-6 w-6" />
}

const Alert = ({
  title,
  message,
  variant = 'success',
  handleClose
}: AlertProps) => {
  return (
    <div
      className={`rounded-lg border ${variantClassMapper[variant].container}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${variantClassMapper[variant].iconClasses}`}
        >
          {iconsMapper[variant]()}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4
              className={`"text-sm font-semibold ${variantClassMapper[variant].title}`}
            >
              {title}
            </h4>
            {handleClose && (
              <Button
                onClick={handleClose}
                variant="ghost"
                size="sm"
                className={`${variantClassMapper[variant].button}`}
              >
                <CloseIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className={`text-sm ${variantClassMapper[variant].message}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Alert
