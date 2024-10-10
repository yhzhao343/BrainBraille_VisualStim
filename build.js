import * as esbuild from 'esbuild'
import http from 'node:http'
import { parseArgs } from 'node:util'

const entry = process.argv[2]
const args = process.argv.splice(3)
const options = {
  'servedir': {
    type: 'string',
    default: ''
  },
  'watch': {
    type: 'boolean',
    default: false
  },
  'define': {
    type: 'string'
  },
  'tree-shaking': {
    type: 'boolean',
    default: false
  },
  'bundle': {
    type: 'boolean',
    default: false
  },
  'minify': {
    type: 'boolean',
    default: false
  },
  'outfile': {
    type: 'string',
    default: ''
  },
  'sourcemap': {
    type: 'boolean',
    default: false
  },
  'log-level': {
    type: 'string',
    default: 'info'
  }
}

const { values, positionals } = parseArgs({ args, options });

if ('' == values.outfile) {
  values.outfile = `${entry.substr(0, entry.length - 2)}js`
}

let esbuild_context_config = {
  'entryPoints': [entry],
  'treeShaking': values['tree-shaking'],
  'logLevel': values['log-level'],
  'bundle': values['bundle'],
  'minify': values['minify'],
  'outfile': values['outfile'],
  'sourcemap': values['sourcemap']
}

if ('define' in values) {
  if (values['define']) {
    const define_string = values['define']
    const splited_string = define_string.split('=')
    if (splited_string[0] === 'window.IS_PRODUCTION') {
      esbuild_context_config['define'] = {
        'window.IS_PRODUCTION': splited_string[1]
      }
    }
  }
}
console.log(esbuild_context_config)
let ctx = await esbuild.context(esbuild_context_config)
// console.log(ctx)

if (values['watch']) {
  await ctx.watch()
}

if (values['servedir']) {
  let { host, port } = await ctx.serve({
    'servedir': values['servedir']
  })
  const PROXY_PORT = 3000;
  const server = http.createServer((req, res) => {
    const options = {
      hostname: host,
      port: port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    }
    const proxyReq = http.request(options, proxyRes => {
      proxyRes.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
      proxyRes.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
      res.writeHead(proxyRes.statusCode, proxyRes.headers)
      proxyRes.pipe(res, { end: true })
    })
    req.pipe(proxyReq, { end: true })
  })

  server.listen(PROXY_PORT);
  console.log(` > cross-origin isolated serving at http://127.0.0.1:${PROXY_PORT}/\n=== Use port ${PROXY_PORT} for higher performance.now() time accuracy ===`);
} else {
  ctx.rebuild();
  process.exit();
}