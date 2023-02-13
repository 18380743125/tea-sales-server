// 数字字符串转 number
export function toNumber(str: number | string) {
  if(typeof str === 'string') return Number(str)
  else return str
}