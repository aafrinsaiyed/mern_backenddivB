import crypto from 'crypto'
const secretkey = crypto.randomBytes(32).toString('hex')
export default secretkey
