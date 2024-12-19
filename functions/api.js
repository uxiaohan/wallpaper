
export async function onRequest({ request, env }) {
  return handleRequest(request);
}

async function handleRequest(request) {
  const url = new URL(request.url)
  const cid = getParam(url, 'cid', '360new')

  let start = parseInt(getParam(url, 'start', '0'))
  let count = parseInt(getParam(url, 'count', '10'))

  let apiUrl

  if (cid === '360new') {
    apiUrl = `http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByOrder&order=create_time&start=${start}&count=${count}&from=360chrome`
  } else {
    apiUrl = `http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=${cid}&start=${start}&count=${count}&from=360chrome`
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Referer': 'https://wallpaper.apc.360.cn',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36',
        'Accept-Encoding': 'gzip, deflate'
      }
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

// 获取请求参数
function getParam(url, key, defaultValue = '') {
  return url.searchParams.has(key) ? url.searchParams.get(key) : defaultValue
}
