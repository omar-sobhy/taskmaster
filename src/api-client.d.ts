declare module 'vue/types/vue' {
  interface Vue {
    // eslint-disable-next-line camelcase
    $api_client: {
      login(),
      signUp()
    }
  }
}
