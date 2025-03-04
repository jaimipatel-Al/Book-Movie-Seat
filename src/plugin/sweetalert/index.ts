import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const swal = Swal.mixin({
  confirmButtonColor: '#001DFF',
  showCancelButton: true,
  allowOutsideClick: false,
})

export default swal
