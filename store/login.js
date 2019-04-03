import Cookies from 'js-cookie';

export const strict = false;

export const state = () => ({
  user: {
    email: '',
    password: '',
  },
  errors: {},

  authenticated: {
    access_token: '',
    user_id: '',
    name: '',
    email: '',
    role: '',
    type: '',
  },
})

export const actions = {
  loginUser({ commit, dispatch }, payload) {
    const auth = this.getters['login/getAuthenticated'];
    post({
      url: '/api/v1/user-login',
      token: auth.access_token,
      type: auth.type,
      params: payload.user,
      commit,
      self: this
    }).then((response) => {
      commit('CLEAR_ERRORS');
      const authenticated = response.data;
      if (authenticated.access_token === '' || authenticated.access_token === undefined) {
        this.$toast.error('Something went wrong. Please try again.');
      } else {
        commit('SET_AUTH_COOKIE', authenticated);
        this.$router.push('/login-success');
      }
    }).catch((error) => {
      if (error.response.status === 422) {
        commit('SHOW_ERRORS', { response: error.response });
      }
    })
  },
  loginSupplier({ commit, dispatch }, payload) {
    const auth = this.getters['login/getAuthenticated'];
    post({
      url: '/api/v1/supplier-login',
      token: auth.access_token,
      type: auth.type,
      params: payload.user,
      commit,
      self: this
    }).then((response) => {
      commit('CLEAR_ERRORS');
      const authenticated = response.data;
      if (authenticated.access_token === '' || authenticated.access_token === undefined) {
        this.$toast.error('Something went wrong. Please try again.');
      } else {
        commit('SET_AUTH_COOKIE', authenticated);
        this.$router.push('/login-success');
      }
    }).catch((error) => {
      console.log(error)
      if (error.response.status === 422) {
        commit('SHOW_ERRORS', { response: error.response });
      }
    })
  },
}

export function post(payload) {
  return new Promise((resolve, reject) => {
    payload.self.$axios
      .post(payload.url, payload.params, {
        headers: {
          Authorization: "Bearer " + payload.token,
          "Mg-Type": payload.type
        }
      })
      .then(response => {
        if (response.headers.authorization) {
          const token = response.headers.authorization.split(
            "Bearer "
          );
          payload.self.commit("login/UPDATE_AUTH_COOKIE", token[1]);
        }
        return resolve(response);
      })
      .catch(error => {
        return reject(error);
      });
  });
}

export const getters = {
  getUser: state => state.user,
  getAuthenticated: state => state.authenticated,
  getErrors: state => state.errors,
}

export const mutations = {
  UPDATE_USER_INPUT(state, user) {
    Object.assign(state.user, user);
  },
  SHOW_ERRORS(state, { response }) {
    state.errors = response.data.errors;
  },
  CLEAR_ERRORS(state) {
    state.errors = {};
  },
  EMPTY_FIELDS(state) {
    state.user = {
      email: '',
      password: '',
    }
  },
  UPDATE_AUTH_COOKIE(state, token) {
    state.authenticated.access_token = token;
  },
  SET_AUTH_COOKIE(state, payload) {
    if (payload) {
      state.authenticated.access_token = payload.access_token;
      state.authenticated.user_id = payload.user_id;
      state.authenticated.name = payload.name;
      state.authenticated.email = payload.email;
      state.authenticated.role = payload.role;
      state.authenticated.type = payload.type;
      Cookies.set('mg_t', payload.access_token)
      Cookies.set('mg_u', payload.user_id)
      Cookies.set('mg_f', payload.name)
      Cookies.set('mg_e', payload.email)
      Cookies.set('mg_rl', payload.role)
      Cookies.set('mg_tp', payload.type)
    }
  },
  SET_AUTH_COOKIE_SSR(state, payload) {
    if (payload) {
      state.authenticated.access_token = payload.details.access_token;
      state.authenticated.user_id = payload.details.user_id;
      state.authenticated.name = payload.details.name;
      state.authenticated.email = payload.details.email;
      state.authenticated.role = payload.details.role;
      state.authenticated.type = payload.details.type;
      payload.res.cookie('mg_t', payload.details.access_token)
      payload.res.cookie('mg_u', payload.details.user_id)
      payload.res.cookie('mg_f', payload.details.name)
      payload.res.cookie('mg_e', payload.details.email)
      payload.res.cookie('mg_rl', payload.details.role)
      payload.res.cookie('mg_tp', payload.details.type)
    }
  },
  REMOVE_AUTH_COOKIE(state) {
    state.authenticated.access_token = null;
    state.authenticated.user_id = null;
    state.authenticated.email = null;
    state.authenticated.name = null;
    state.authenticated.role = null;
    state.authenticated.type = null;
    Cookies.remove('mg_t');
    Cookies.remove('mg_u');
    Cookies.remove('mg_f');
    Cookies.remove('mg_e');
    Cookies.remove('mg_rl');
    Cookies.remove('mg_tp');
  },
  REMOVE_AUTH_COOKIE_SSR(state, res) {
    state.authenticated.access_token = null;
    state.authenticated.user_id = null;
    state.authenticated.email = null;
    state.authenticated.name = null;
    state.authenticated.role = null;
    state.authenticated.type = null;
    res.clearCookie("mg_t");
    res.clearCookie('mg_u');
    res.clearCookie('mg_f');
    res.clearCookie('mg_e');
    res.clearCookie("mg_rl");
    res.clearCookie("mg_tp");
  },
}


