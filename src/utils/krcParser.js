//解析KRC时间标签
export function parseKrc(krcText) {
  // console.log(krcText)
  const lines = krcText.split('\n')
  // console.log(lines)
  const result = []
  lines.forEach((line) => {
    // 匹配行级时间 [86,1401]
    const lineMatch = line.match(/^\[(\d+),(\d+)\]/)

    if (!lineMatch) return
    const start = parseInt(lineMatch[1]) // 行开始时间(ms)
    const duration = parseInt(lineMatch[2]) // 行持续时间
    const end = start + duration

    // // 匹配逐字标签 <0,81,0>坠
    const wordTags = Array.from(line.matchAll(/<(\d+),(\d+),(\d+)>([^<]+)/g))

    if (!wordTags.length) return
    const words = wordTags.map((tag) => ({
      start: start + parseInt(tag[1]), // 字开始时间(ms)
      duration: parseInt(tag[2]), // 字持续时间
      end: start + parseInt(tag[1]) + parseInt(tag[2]),
      word: tag[4], // 歌词字
    }))
    result.push({
      start,
      end,
      duration,
      words,
    })
  })

  return result
}
