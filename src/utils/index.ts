
type nftDto = {
  collectionAddress: string,
  tokenId: any,
  id: any
}

export const getCompileNftUrl = (id: any, address: string, tokenId: string) => (address && tokenId ? `${address}:${tokenId}` : id)
export const getDecodeNftUrl = (path: string) => {
  const result = {} as nftDto
  if (`${path}`.includes(':')) {
    result.collectionAddress = `${path}`.split(':')[0]
    result.tokenId = `${path}`.split(':')[1]
  }
  if (Number(path)) {
    result.id = path
  }
  return result
}
