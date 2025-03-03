import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const toast = useToast({
  position: 'top-right',
  duration: 5000,
  dismissible: true,
  pauseOnHover: true,
})

export default toast
