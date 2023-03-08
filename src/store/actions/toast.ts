import { toastMsgActons } from 'store/constants/toastMsg'

export const toastSuccess = (msg: string, txHash: string = '') => {
    return {
        type: toastMsgActons.OPEN,
        payload: {
            type: 'success',
            message: msg,
            txHash: txHash
        }
    }
}

export const toastWarning = (msg: string, txHash: string = '') => {
    return {
        type: toastMsgActons.OPEN,
        payload: {
            type: 'warning',
            message: msg,
            txHash: txHash
        }
    }
}

export const toastError = (msg: string, txHash: string = '') => {
    return {
        type: toastMsgActons.OPEN,
        payload: {
            type: 'error',
            message: msg,
            txHash: txHash
        }
    }
}

export const toastInfo = (msg: string, txHash: string = '') => {
    return {
        type: toastMsgActons.OPEN,
        payload: {
            type: 'info',
            message: msg,
            txHash: txHash
        }
    }
}
