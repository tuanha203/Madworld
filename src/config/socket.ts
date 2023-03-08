import io from 'socket.io-client'
import { SERVER_DOMAIN } from 'constants/envs'

const socket = io(SERVER_DOMAIN!, {
  transports: ['websocket', 'polling']
})
export default socket
