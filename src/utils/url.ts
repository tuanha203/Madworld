export const serialize = function (obj: any) {
    const str = []
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
        }
    return str.join('&')
}
