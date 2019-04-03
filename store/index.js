export const strict = false
export const state = () => ({})
export const mutations = {}
export const getters = {}

export const actions = {
  nuxtServerInit({ commit }, { req, res }) {
    if (req.headers.cookie) {
      var cookieparser = require('cookieparser');
      var parsed = cookieparser.parse(req.headers.cookie);
      var details = {
        access_token: parsed.mg_t,
        user_id: parsed.mg_u,
        name: parsed.mg_f,
        email: parsed.mg_e,
        role: parsed.mg_rl,
        type: parsed.mg_tp
      }
      commit('login/SET_AUTH_COOKIE_SSR', { details, res });

    }
  },
}
