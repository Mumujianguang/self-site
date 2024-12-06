import { api } from "@/api";

const meta = new Map()

function buildParams() {
    const params = new URLSearchParams();

    params.append('client_id', '112722049');
    params.append('display', 'page');
    params.append('response_type', 'code');
    params.append('state', Math.random().toString(36).substring(7));
    params.append('redirect_uri', window.__DEV__ ? 'http://localhost:5173/' : 'http://mmjg.site/');
    params.append(
        'scope',
        `openid ${[
            'https://www.huawei.com/healthkit/activityrecord.read',
            'https://www.huawei.com/healthkit/activity.read',
            'https://www.huawei.com/healthkit/location.read'
        ].join(' ')}     `
    );
    
    return params
}

function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('code')) {
        meta.set('code', params.get('code'))
    }
}

export default function login() {
    const params = buildParams()
    window.location.href = `https://oauth-login.cloud.huawei.com/oauth2/v3/authorize?${params}`
}

export async function authorize() {
    // if (localStorage.getItem('access_token')) {
    //     return
    // }

    parseUrlParams()
    const code = meta.get('code')
    if (!code) {
        return
    }

    const response = await api.post('/huawei/accessToken', { code })

    const { data: auth } = response.data

    meta.set('auth', auth)
    localStorage.setItem('access_token', auth.access_token)
}