export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    if (url.pathname === '/') {
      const html = await env.ASSETS.fetch(request);
      return new Response(html.body, {
        headers: { ...Object.fromEntries(html.headers), 'Content-Type': 'text/html;charset=UTF-8' }
      });
    }

    if (url.pathname === '/api/etherscan') {
      const params = url.searchParams;
      const chainid = params.get('chainid') || '1';
      const module  = params.get('module')  || 'account';
      const action  = params.get('action')  || 'balance';

      const apiUrl = new URL('https://api.etherscan.io/v2/api');
      apiUrl.searchParams.set('chainid', chainid);
      apiUrl.searchParams.set('module',  module);
      apiUrl.searchParams.set('action',  action);
      apiUrl.searchParams.set('apikey',  env.ETHERSCAN_API_KEY || '');

      for (const [k, v] of params.entries()) {
        if (!['chainid','module','action'].includes(k)) {
          apiUrl.searchParams.set(k, v);
        }
      }

      const resp = await fetch(apiUrl.toString(), {
        headers: { 'User-Agent': 'ChainLens/1.0' }
      });
      const data = await resp.text();

      return new Response(data, {
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
};
